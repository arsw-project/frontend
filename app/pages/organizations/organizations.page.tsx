import {
	addToast,
	Avatar,
	Badge,
	Button,
	Card,
	CardBody,
	Chip,
	cn,
	Divider,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Pagination,
	Progress,
	Select,
	SelectItem,
	Spinner,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tabs,
	Textarea,
	Tooltip,
	useDisclosure,
} from '@heroui/react';
import {
	BuildingsIcon,
	CalendarIcon,
	DotsThreeVerticalIcon,
	DownloadIcon,
	EnvelopeIcon,
	MagnifyingGlassIcon,
	PencilSimpleIcon,
	PlusIcon,
	ShieldCheckIcon,
	TrashIcon,
	UsersIcon,
} from '@phosphor-icons/react';
import { FieldError } from '@shared/components/field-error/field-error.component';
import { PermissionWrapper } from '@shared/components/permission-wrapper/permission-wrapper.component';
import { useUsers } from '@shared/hooks/get-users.hook';
import { useAddMemberMutation } from '@shared/hooks/organizations/add-member.hook';
import { useCreateOrganizationMutation } from '@shared/hooks/organizations/create-organization.hook';
import { useDeleteOrganizationMutation } from '@shared/hooks/organizations/delete-organization.hook';
import { useOrganizationMembers } from '@shared/hooks/organizations/get-organization-members.hook';
import { useOrganizations } from '@shared/hooks/organizations/get-organizations.hook';
import type {
	MembershipRole,
	OrganizationApi,
} from '@shared/hooks/organizations/organization.types';
import { useUpdateOrganizationMutation } from '@shared/hooks/organizations/update-organization.hook';
import { useErrorParser } from '@shared/utility/errors';
import { dataAttr } from '@shared/utility/props';
import { useForm } from '@tanstack/react-form';
import { memo, useCallback, useMemo, useState } from 'react';
import { useIntlayer } from 'react-intlayer';
import {
	type CreateOrganizationFormState,
	createEditOrganizationForm,
	createOrganizationForm,
	type EditOrganizationFormState,
} from './organizations.validators';

export function meta() {
	return [
		{ title: 'ARSW Project - Organizations' },
		{ name: 'description', content: 'Manage organizations in the system' },
	];
}

const MembersCount = memo(({ organizationId }: { organizationId: string }) => {
	const membersQuery = useOrganizationMembers(organizationId);

	if (membersQuery.isLoading) {
		return <Spinner size="sm" color="primary" />;
	}

	if (membersQuery.isError) {
		return <span className={cn(['text-foreground-400 text-small'])}>N/A</span>;
	}

	return (
		<span className={cn(['font-medium text-foreground text-small'])}>
			{membersQuery.data?.length || 0}
		</span>
	);
});

MembersCount.displayName = 'MembersCount';

const ROWS_PER_PAGE = 8;
const AVAILABLE_ROLES: MembershipRole[] = [
	'owner',
	'admin',
	'member',
	'viewer',
];

const OrganizationsPage = memo(() => {
	const { parseFieldErrors } = useErrorParser();
	const content = useIntlayer('organizations');
	const organizationsQuery = useOrganizations();
	const usersQuery = useUsers();

	const [filterValue, setFilterValue] = useState('');
	const [page, setPage] = useState(1);

	const createModal = useDisclosure();
	const editModal = useDisclosure();
	const deleteModal = useDisclosure();
	const addMemberModal = useDisclosure();
	const viewMembersModal = useDisclosure();
	const [selectedOrganization, setSelectedOrganization] =
		useState<OrganizationApi | null>(null);
	const [selectedUserId, setSelectedUserId] = useState<string>('');
	const [selectedRole, setSelectedRole] = useState<MembershipRole>('member');

	const CreateOrgForm = createOrganizationForm({
		nameRequired: content.nameRequired.value,
		descriptionRequired: content.descriptionRequired.value,
		nameMinLength: content.nameMinLength.value,
		descriptionMinLength: content.descriptionMinLength.value,
	});

	const EditOrgForm = createEditOrganizationForm({
		nameRequired: content.nameRequired.value,
		descriptionRequired: content.descriptionRequired.value,
		nameMinLength: content.nameMinLength.value,
		descriptionMinLength: content.descriptionMinLength.value,
	});

	const createMutation = useCreateOrganizationMutation({
		onSuccess: () => {
			addToast({
				title: content.organizationCreated,
				color: 'success',
				timeout: 3000,
			});
			createModal.onClose();
			createForm.reset();
		},
	});

	const updateMutation = useUpdateOrganizationMutation({
		onSuccess: () => {
			addToast({
				title: content.organizationUpdated,
				color: 'success',
				timeout: 3000,
			});
			editModal.onClose();
			setSelectedOrganization(null);
		},
	});

	const deleteMutation = useDeleteOrganizationMutation({
		onSuccess: () => {
			addToast({
				title: content.organizationDeleted,
				color: 'success',
				timeout: 3000,
			});
			deleteModal.onClose();
			setSelectedOrganization(null);
		},
	});

	const addMemberMutation = useAddMemberMutation({
		onSuccess: () => {
			addToast({
				title: content.memberAdded,
				color: 'success',
				timeout: 3000,
			});
			addMemberModal.onClose();
			setSelectedOrganization(null);
			setSelectedUserId('');
			setSelectedRole('member');
		},
	});

	const createForm = useForm({
		defaultValues: {
			name: '',
			description: '',
		} as CreateOrganizationFormState,
		onSubmit: async ({ value }) => {
			try {
				await createMutation.execute({
					name: value.name.trim(),
					description: value.description.trim(),
				});
			} catch (error) {
				console.error('Create failed:', error);
			}
		},
	});

	const editForm = useForm({
		defaultValues: {
			name: selectedOrganization?.name || '',
			description: selectedOrganization?.description || '',
		} as EditOrganizationFormState,
		onSubmit: async ({ value }) => {
			if (!selectedOrganization) return;

			const changes: { name?: string; description?: string } = {};

			if (value.name !== selectedOrganization.name)
				changes.name = value.name.trim();
			if (value.description !== selectedOrganization.description)
				changes.description = value.description.trim();

			if (Object.keys(changes).length > 0) {
				try {
					await updateMutation.execute(selectedOrganization.id, changes);
				} catch (error) {
					console.error('Update failed:', error);
				}
			} else {
				editModal.onClose();
			}
		},
	});

	const filteredItems = useMemo(() => {
		if (!organizationsQuery.data) return [];

		let filtered = [...organizationsQuery.data];

		if (filterValue) {
			const searchLower = filterValue.toLowerCase();
			filtered = filtered.filter(
				(org) =>
					org.name.toLowerCase().includes(searchLower) ||
					org.description.toLowerCase().includes(searchLower),
			);
		}

		return filtered;
	}, [organizationsQuery.data, filterValue]);

	const stats = useMemo(() => {
		const organizations = organizationsQuery.data || [];
		const totalOrganizations = organizations.length;

		const now = new Date();
		const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

		const recentlyCreated = organizations.filter(
			(org) => new Date(org.createdAt) >= thisMonth,
		).length;

		const createdLastMonth = organizations.filter((org) => {
			const date = new Date(org.createdAt);
			return date >= lastMonth && date < thisMonth;
		}).length;

		const olderOrganizations = organizations.filter(
			(org) => new Date(org.createdAt) < lastMonth,
		).length;

		return {
			totalOrganizations,
			recentlyCreated,
			createdLastMonth,
			olderOrganizations,
		};
	}, [organizationsQuery.data]);

	const pages = Math.ceil(filteredItems.length / ROWS_PER_PAGE) || 1;

	const paginatedItems = useMemo(() => {
		const start = (page - 1) * ROWS_PER_PAGE;
		const end = start + ROWS_PER_PAGE;
		return filteredItems.slice(start, end);
	}, [page, filteredItems]);

	const handleSearchChange = useCallback((value: string) => {
		setFilterValue(value);
		setPage(1);
	}, []);

	const handleExportCSV = useCallback(() => {
		if (!organizationsQuery.data) return;

		const headers = [
			'ID',
			'Name',
			'Description',
			'Created Date',
			'Updated Date',
		];
		const rows = organizationsQuery.data.map((org) => [
			org.id,
			org.name,
			org.description,
			new Date(org.createdAt).toLocaleDateString(),
			new Date(org.updatedAt).toLocaleDateString(),
		]);

		const csvContent = [
			headers.join(','),
			...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
		].join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `organizations-export-${new Date().toISOString().split('T')[0]}.csv`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);

		addToast({
			title: 'Exported successfully',
			color: 'success',
			timeout: 3000,
		});
	}, [organizationsQuery.data]);

	const handleCreateOrganization = useCallback(() => {
		createForm.reset();
		createModal.onOpen();
	}, [createModal, createForm]);

	const handleEditOrganization = useCallback(
		(organization: OrganizationApi) => {
			setSelectedOrganization(organization);
			editForm.reset();
			editForm.setFieldValue('name', organization.name);
			editForm.setFieldValue('description', organization.description);
			editModal.onOpen();
		},
		[editModal, editForm],
	);

	const handleDeleteOrganization = useCallback(
		(organization: OrganizationApi) => {
			setSelectedOrganization(organization);
			deleteModal.onOpen();
		},
		[deleteModal],
	);

	const handleConfirmDelete = useCallback(async () => {
		if (!selectedOrganization) return;
		await deleteMutation.execute(selectedOrganization.id);
	}, [deleteMutation, selectedOrganization]);

	const handleAddMember = useCallback(
		(organization: OrganizationApi) => {
			setSelectedOrganization(organization);
			setSelectedUserId('');
			setSelectedRole('member');
			addMemberModal.onOpen();
		},
		[addMemberModal],
	);

	const handleViewMembers = useCallback(
		(organization: OrganizationApi) => {
			setSelectedOrganization(organization);
			viewMembersModal.onOpen();
		},
		[viewMembersModal],
	);

	const handleConfirmAddMember = useCallback(async () => {
		if (!selectedOrganization || !selectedUserId) return;
		await addMemberMutation.execute(selectedOrganization.id, {
			userId: selectedUserId,
			role: selectedRole,
		});
	}, [addMemberMutation, selectedOrganization, selectedUserId, selectedRole]);

	const formatDate = useCallback((dateString: string) => {
		return new Date(dateString).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}, []);

	const renderCell = useCallback(
		(organization: OrganizationApi, columnKey: string) => {
			switch (columnKey) {
				case 'name':
					return (
						<div className={cn(['flex flex-col'])}>
							<span className={cn(['font-medium text-foreground text-small'])}>
								{organization.name}
							</span>
							<span
								className={cn([
									'line-clamp-1 max-w-xs text-foreground-400 text-tiny',
								])}
							>
								{organization.description || content.noDescription}
							</span>
						</div>
					);
				case 'description': {
					const desc = organization.description || content.noDescription;
					return (
						<span
							className={cn([
								'line-clamp-2 max-w-md text-foreground-500 text-small',
							])}
						>
							{desc}
						</span>
					);
				}
				case 'members':
					return <MembersCount organizationId={organization.id} />;
				case 'createdAt':
					return (
						<span className={cn(['text-foreground-500 text-small'])}>
							{formatDate(organization.createdAt)}
						</span>
					);
				case 'updatedAt':
					return (
						<span className={cn(['text-foreground-500 text-small'])}>
							{formatDate(organization.updatedAt)}
						</span>
					);
				case 'actions':
					return (
						<PermissionWrapper
							require={{ type: 'any', roles: ['system'] }}
							fallback={
								<div
									className={cn([
										'relative flex items-center justify-end gap-2',
									])}
								>
									<Tooltip content={content.editOrganization}>
										<Button
											isIconOnly
											size="sm"
											variant="light"
											color="default"
											onPress={() => handleEditOrganization(organization)}
											className={cn(['text-foreground-500 hover:text-primary'])}
										>
											<PencilSimpleIcon size={18} />
										</Button>
									</Tooltip>
									<Tooltip content={content.deleteOrganization} color="danger">
										<Button
											isIconOnly
											size="sm"
											variant="light"
											color="danger"
											onPress={() => handleDeleteOrganization(organization)}
										>
											<TrashIcon size={18} />
										</Button>
									</Tooltip>
									<Dropdown>
										<DropdownTrigger>
											<Button
												isIconOnly
												size="sm"
												variant="light"
												className={cn(['text-foreground-500'])}
											>
												<DotsThreeVerticalIcon size={18} weight="bold" />
											</Button>
										</DropdownTrigger>
										<DropdownMenu aria-label="Organization actions">
											<DropdownItem
												key="edit"
												startContent={<PencilSimpleIcon size={16} />}
												onPress={() => handleEditOrganization(organization)}
												textValue={content.editOrganization.value}
											>
												{content.editOrganization}
											</DropdownItem>
											<DropdownItem
												key="members"
												startContent={<UsersIcon size={16} />}
												textValue={content.viewMembers.value}
											>
												{content.viewMembers}
											</DropdownItem>
											<DropdownItem
												key="delete"
												color="danger"
												className={cn(['text-danger'])}
												startContent={<TrashIcon size={16} />}
												onPress={() => handleDeleteOrganization(organization)}
												textValue={content.deleteOrganization.value}
											>
												{content.deleteOrganization}
											</DropdownItem>
										</DropdownMenu>
									</Dropdown>
								</div>
							}
						>
							<div
								className={cn(['relative flex items-center justify-end gap-2'])}
							>
								<Tooltip content={content.editOrganization}>
									<Button
										isIconOnly
										size="sm"
										variant="light"
										color="default"
										onPress={() => handleEditOrganization(organization)}
										className={cn(['text-foreground-500 hover:text-primary'])}
									>
										<PencilSimpleIcon size={18} />
									</Button>
								</Tooltip>
								<Tooltip content={content.deleteOrganization} color="danger">
									<Button
										isIconOnly
										size="sm"
										variant="light"
										color="danger"
										onPress={() => handleDeleteOrganization(organization)}
									>
										<TrashIcon size={18} />
									</Button>
								</Tooltip>
								<Dropdown>
									<DropdownTrigger>
										<Button
											isIconOnly
											size="sm"
											variant="light"
											className={cn(['text-foreground-500'])}
										>
											<DotsThreeVerticalIcon size={18} weight="bold" />
										</Button>
									</DropdownTrigger>
									<DropdownMenu aria-label="Organization actions">
										<DropdownItem
											key="edit"
											startContent={<PencilSimpleIcon size={16} />}
											onPress={() => handleEditOrganization(organization)}
											textValue={content.editOrganization.value}
										>
											{content.editOrganization}
										</DropdownItem>
										<DropdownItem
											key="members"
											startContent={<UsersIcon size={16} />}
											onPress={() => handleViewMembers(organization)}
											textValue={content.viewMembers.value}
										>
											{content.viewMembers}
										</DropdownItem>
										<DropdownItem
											key="add-member"
											startContent={<PlusIcon size={16} />}
											onPress={() => handleAddMember(organization)}
											textValue={content.addMember.value}
										>
											{content.addMember}
										</DropdownItem>
										<DropdownItem
											key="delete"
											color="danger"
											className={cn(['text-danger'])}
											startContent={<TrashIcon size={16} />}
											onPress={() => handleDeleteOrganization(organization)}
											textValue={content.deleteOrganization.value}
										>
											{content.deleteOrganization}
										</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</div>
						</PermissionWrapper>
					);
				default:
					return null;
			}
		},
		[
			content,
			formatDate,
			handleEditOrganization,
			handleDeleteOrganization,
			handleAddMember,
		],
	);

	const topContent = useMemo(() => {
		return (
			<div
				className={cn(['flex flex-col gap-4', 'md:flex-row md:items-center'])}
			>
				<Input
					isClearable
					classNames={{
						base: 'w-full md:max-w-xs',
						inputWrapper: 'bg-default-100',
					}}
					placeholder={content.searchPlaceholder.value}
					size="sm"
					startContent={
						<MagnifyingGlassIcon
							className={cn(['text-foreground-400'])}
							size={16}
						/>
					}
					value={filterValue}
					variant="flat"
					onClear={() => handleSearchChange('')}
					onValueChange={handleSearchChange}
				/>
				<div className={cn(['flex flex-1 justify-end gap-2'])}>
					{filterValue && (
						<Button
							size="sm"
							variant="bordered"
							onPress={() => {
								setFilterValue('');
								setPage(1);
							}}
						>
							{content.clearFilters}
						</Button>
					)}
					<Button
						size="sm"
						color="default"
						variant="flat"
						startContent={<DownloadIcon size={16} />}
						onPress={handleExportCSV}
					>
						{content.exportCSV}
					</Button>
					<Button
						size="sm"
						color="primary"
						startContent={<PlusIcon size={16} />}
						onPress={handleCreateOrganization}
					>
						{content.createOrganization}
					</Button>
				</div>
			</div>
		);
	}, [
		content,
		filterValue,
		handleSearchChange,
		handleExportCSV,
		handleCreateOrganization,
	]);

	const bottomContent = useMemo(() => {
		return (
			<div className={cn(['flex w-full items-center justify-between py-2'])}>
				<span className={cn(['text-foreground-400 text-tiny'])}>
					{paginatedItems.length} / {filteredItems.length}
				</span>
				<Pagination
					isCompact
					showControls
					color="primary"
					page={page}
					total={pages}
					onChange={setPage}
					size="sm"
				/>
			</div>
		);
	}, [page, pages, paginatedItems.length, filteredItems.length]);

	if (organizationsQuery.isLoading) {
		return (
			<div
				className={cn([
					'flex h-full w-full flex-col items-center justify-center gap-3',
				])}
			>
				<Spinner size="lg" color="primary" />
				<p className={cn(['text-foreground-400 text-small'])}>
					{content.loading}
				</p>
			</div>
		);
	}

	if (organizationsQuery.isError) {
		return (
			<div
				className={cn([
					'flex h-full w-full flex-col items-center justify-center',
				])}
			>
				<div
					className={cn([
						'flex flex-col items-center gap-4 rounded-large bg-default-50 p-8',
					])}
				>
					<BuildingsIcon
						size={40}
						className={cn(['text-danger-400'])}
						weight="duotone"
					/>
					<p className={cn(['text-foreground-500 text-small'])}>
						{content.error}
					</p>
					<Button
						color="primary"
						variant="flat"
						size="sm"
						onPress={() => window.location.reload()}
					>
						{content.retry}
					</Button>
				</div>
			</div>
		);
	}

	const columns = [
		{ key: 'name', label: content.name },
		{ key: 'description', label: content.organizationDescription },
		{ key: 'members', label: 'Miembros' },
		{ key: 'createdAt', label: content.createdAt },
		{ key: 'updatedAt', label: content.updatedAt },
		{ key: 'actions', label: content.actions },
	];

	return (
		<div className={cn(['flex h-full flex-col gap-8 p-6', 'md:p-8 lg:p-10'])}>
			<header>
				<h1
					className={cn([
						'font-semibold text-foreground text-xl',
						'md:text-2xl',
					])}
				>
					{content.title}
				</h1>
				<p className={cn(['mt-1 text-foreground-400 text-small'])}>
					{content.description}
				</p>
			</header>

			{/* Stats Cards */}
			<div className={cn(['grid grid-cols-2 gap-4', 'md:grid-cols-4'])}>
				<Card shadow="sm" className={cn(['border-none bg-default-50'])}>
					<CardBody className={cn(['flex flex-col gap-3 p-4'])}>
						<div className={cn(['flex items-center gap-3'])}>
							<div
								className={cn([
									'flex h-10 w-10 items-center justify-center rounded-medium',
									'bg-primary-100 text-primary',
								])}
							>
								<BuildingsIcon size={20} weight="duotone" />
							</div>
							<div>
								<p className={cn(['text-foreground-400 text-tiny uppercase'])}>
									{content.summaryTotalOrganizations}
								</p>
								<p className={cn(['font-semibold text-foreground text-xl'])}>
									{stats.totalOrganizations}
								</p>
							</div>
						</div>
					</CardBody>
				</Card>

				<Card shadow="sm" className={cn(['border-none bg-default-50'])}>
					<CardBody className={cn(['flex flex-col gap-3 p-4'])}>
						<div className={cn(['flex items-center gap-3'])}>
							<div
								className={cn([
									'flex h-10 w-10 items-center justify-center rounded-medium',
									'bg-success-100 text-success',
								])}
							>
								<CalendarIcon size={20} weight="duotone" />
							</div>
							<div>
								<p className={cn(['text-foreground-400 text-tiny uppercase'])}>
									{content.thisMonth}
								</p>
								<p className={cn(['font-semibold text-foreground text-xl'])}>
									{stats.recentlyCreated}
								</p>
							</div>
						</div>
						<Progress
							value={
								(stats.recentlyCreated /
									Math.max(stats.totalOrganizations, 1)) *
								100
							}
							color="success"
							size="sm"
							showValueLabel={true}
							formatOptions={{ style: 'percent', minimumFractionDigits: 0 }}
						/>
					</CardBody>
				</Card>

				<Card shadow="sm" className={cn(['border-none bg-default-50'])}>
					<CardBody className={cn(['flex flex-col gap-3 p-4'])}>
						<div className={cn(['flex items-center gap-3'])}>
							<div
								className={cn([
									'flex h-10 w-10 items-center justify-center rounded-medium',
									'bg-secondary-100 text-secondary',
								])}
							>
								<CalendarIcon size={20} weight="duotone" />
							</div>
							<div>
								<p className={cn(['text-foreground-400 text-tiny uppercase'])}>
									{content.lastMonth}
								</p>
								<p className={cn(['font-semibold text-foreground text-xl'])}>
									{stats.createdLastMonth}
								</p>
							</div>
						</div>
						<Progress
							value={
								(stats.createdLastMonth /
									Math.max(stats.totalOrganizations, 1)) *
								100
							}
							color="secondary"
							size="sm"
							showValueLabel={true}
							formatOptions={{ style: 'percent', minimumFractionDigits: 0 }}
						/>
					</CardBody>
				</Card>

				<Card shadow="sm" className={cn(['border-none bg-default-50'])}>
					<CardBody className={cn(['flex flex-col gap-3 p-4'])}>
						<div className={cn(['flex items-center gap-3'])}>
							<div
								className={cn([
									'flex h-10 w-10 items-center justify-center rounded-medium',
									'bg-warning-100 text-warning',
								])}
							>
								<BuildingsIcon size={20} weight="duotone" />
							</div>
							<div>
								<p className={cn(['text-foreground-400 text-tiny uppercase'])}>
									{content.older}
								</p>
								<p className={cn(['font-semibold text-foreground text-xl'])}>
									{stats.olderOrganizations}
								</p>
							</div>
						</div>
						<Progress
							value={
								(stats.olderOrganizations /
									Math.max(stats.totalOrganizations, 1)) *
								100
							}
							color="warning"
							size="sm"
							showValueLabel={true}
							formatOptions={{ style: 'percent', minimumFractionDigits: 0 }}
						/>
					</CardBody>
				</Card>
			</div>

			{/* Tabs with Table and Analytics */}
			<Tabs
				aria-label="Organizations content"
				color="primary"
				variant="underlined"
			>
				<Tab
					key="organizations"
					title={content.organizationsList}
					className={cn(['w-full'])}
				>
					<div className={cn(['mt-4 flex-1'])}>
						<Table
							aria-label="Organizations table"
							isHeaderSticky
							bottomContent={bottomContent}
							bottomContentPlacement="outside"
							topContent={topContent}
							topContentPlacement="outside"
						>
							<TableHeader columns={columns}>
								{(column) => (
									<TableColumn
										key={column.key}
										align={column.key === 'actions' ? 'end' : 'start'}
									>
										{column.label}
									</TableColumn>
								)}
							</TableHeader>
							<TableBody
								items={paginatedItems}
								emptyContent={content.noOrganizations}
								loadingContent={<Spinner color="primary" size="sm" />}
							>
								{(item) => (
									<TableRow key={item.id}>
										{(columnKey) => (
											<TableCell>
												{renderCell(item, columnKey as string)}
											</TableCell>
										)}
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</Tab>
				<Tab
					key="analytics"
					title={content.analytics}
					className={cn(['w-full'])}
				>
					<div className={cn(['mt-6 grid gap-6', 'md:grid-cols-2'])}>
						<Card className={cn(['border-none bg-default-50'])}>
							<CardBody className={cn(['gap-6 p-6'])}>
								<div>
									<h3
										className={cn([
											'mb-4 font-semibold text-foreground text-lg',
										])}
									>
										{content.creationTimeline}
									</h3>
									<div className={cn(['space-y-4'])}>
										<div>
											<div
												className={cn([
													'mb-2 flex items-center justify-between',
												])}
											>
												<span
													className={cn([
														'font-medium text-foreground text-small',
													])}
												>
													{content.thisMonth}
												</span>
												<span
													className={cn(['text-foreground-500 text-small'])}
												>
													{stats.recentlyCreated} (
													{Math.round(
														(stats.recentlyCreated /
															Math.max(stats.totalOrganizations, 1)) *
															100,
													)}
													%)
												</span>
											</div>
											<Progress
												value={
													(stats.recentlyCreated /
														Math.max(stats.totalOrganizations, 1)) *
													100
												}
												color="success"
												size="md"
												showValueLabel={false}
											/>
										</div>
										<div>
											<div
												className={cn([
													'mb-2 flex items-center justify-between',
												])}
											>
												<span
													className={cn([
														'font-medium text-foreground text-small',
													])}
												>
													{content.lastMonth}
												</span>
												<span
													className={cn(['text-foreground-500 text-small'])}
												>
													{stats.createdLastMonth} (
													{Math.round(
														(stats.createdLastMonth /
															Math.max(stats.totalOrganizations, 1)) *
															100,
													)}
													%)
												</span>
											</div>
											<Progress
												value={
													(stats.createdLastMonth /
														Math.max(stats.totalOrganizations, 1)) *
													100
												}
												color="secondary"
												size="md"
												showValueLabel={false}
											/>
										</div>
										<div>
											<div
												className={cn([
													'mb-2 flex items-center justify-between',
												])}
											>
												<span
													className={cn([
														'font-medium text-foreground text-small',
													])}
												>
													{content.older}
												</span>
												<span
													className={cn(['text-foreground-500 text-small'])}
												>
													{stats.olderOrganizations} (
													{Math.round(
														(stats.olderOrganizations /
															Math.max(stats.totalOrganizations, 1)) *
															100,
													)}
													%)
												</span>
											</div>
											<Progress
												value={
													(stats.olderOrganizations /
														Math.max(stats.totalOrganizations, 1)) *
													100
												}
												color="warning"
												size="md"
												showValueLabel={false}
											/>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
						<Card className={cn(['border-none bg-default-50'])}>
							<CardBody className={cn(['gap-6 p-6'])}>
								<div>
									<h3
										className={cn([
											'mb-4 font-semibold text-foreground text-lg',
										])}
									>
										{content.organizationInfo}
									</h3>
									<div className={cn(['space-y-4'])}>
										<div
											className={cn([
												'flex items-center justify-between rounded-medium bg-default-100 p-4',
											])}
										>
											<span
												className={cn([
													'font-medium text-foreground text-small',
												])}
											>
												{content.summaryTotalOrganizations}
											</span>
											<span
												className={cn([
													'font-semibold text-foreground text-lg',
												])}
											>
												{stats.totalOrganizations}
											</span>
										</div>
										<div
											className={cn([
												'flex items-center justify-between rounded-medium bg-success-50 p-4',
											])}
										>
											<span
												className={cn(['font-medium text-small text-success'])}
											>
												{content.summaryRecentlyCreated}
											</span>
											<span
												className={cn(['font-semibold text-lg text-success'])}
											>
												{stats.recentlyCreated}
											</span>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
				</Tab>
			</Tabs>

			{/* Create Organization Modal */}
			<Modal
				isOpen={createModal.isOpen}
				onOpenChange={createModal.onOpenChange}
				size="md"
				backdrop="blur"
				classNames={{
					base: 'bg-content1',
					header: 'border-b border-divider',
					footer: 'border-t border-divider',
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>
								<span className={cn(['font-medium text-foreground'])}>
									{content.createModalTitle}
								</span>
							</ModalHeader>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									createForm.handleSubmit();
								}}
							>
								<ModalBody className={cn(['py-6'])}>
									<p className={cn(['text-foreground-400 text-small', 'mb-4'])}>
										{content.createModalDescription}
									</p>
									<div
										className={cn(['flex flex-col gap-4'])}
										data-loading={dataAttr(createMutation.isLoading)}
									>
										<createForm.Field
											name="name"
											validators={{
												onBlur: CreateOrgForm.validationRules.name,
											}}
										>
											{(field) => (
												<Input
													label={content.nameLabel}
													placeholder={content.namePlaceholder.value}
													name={field.name}
													value={field.state.value}
													onValueChange={field.handleChange}
													onBlur={field.handleBlur}
													isInvalid={!field.state.meta.isValid}
													errorMessage={
														<FieldError
															errors={parseFieldErrors(field.state.meta.errors)}
															maxDisplayLength={60}
															color="danger"
															size="sm"
														/>
													}
													variant="flat"
													isRequired
													size="sm"
												/>
											)}
										</createForm.Field>

										<createForm.Field
											name="description"
											validators={{
												onBlur: CreateOrgForm.validationRules.description,
											}}
										>
											{(field) => (
												<Textarea
													label={content.descriptionLabel}
													placeholder={content.descriptionPlaceholder.value}
													name={field.name}
													value={field.state.value}
													onValueChange={field.handleChange}
													onBlur={field.handleBlur}
													isInvalid={!field.state.meta.isValid}
													errorMessage={
														<FieldError
															errors={parseFieldErrors(field.state.meta.errors)}
															maxDisplayLength={60}
															color="danger"
															size="sm"
														/>
													}
													variant="flat"
													isRequired
													size="sm"
													minRows={3}
												/>
											)}
										</createForm.Field>
									</div>
								</ModalBody>
								<ModalFooter>
									<Button
										color="default"
										variant="light"
										onPress={onClose}
										isDisabled={createMutation.isLoading}
										size="sm"
									>
										{content.cancel}
									</Button>
									<createForm.Subscribe selector={(state) => state.isValid}>
										{(isFormValid) => (
											<Button
												type="submit"
												color="primary"
												isLoading={createMutation.isLoading}
												data-loading={dataAttr(createMutation.isLoading)}
												isDisabled={!isFormValid || createMutation.isLoading}
												size="sm"
											>
												{createMutation.isLoading
													? content.creating
													: content.create}
											</Button>
										)}
									</createForm.Subscribe>
								</ModalFooter>
							</form>
						</>
					)}
				</ModalContent>
			</Modal>

			{/* Edit Organization Modal */}
			<Modal
				isOpen={editModal.isOpen}
				onOpenChange={editModal.onOpenChange}
				size="md"
				backdrop="blur"
				classNames={{
					base: 'bg-content1',
					header: 'border-b border-divider',
					footer: 'border-t border-divider',
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>
								<span className={cn(['font-medium text-foreground'])}>
									{content.editModalTitle}
								</span>
							</ModalHeader>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									editForm.handleSubmit();
								}}
							>
								<ModalBody className={cn(['py-6'])}>
									<p className={cn(['text-foreground-400 text-small', 'mb-4'])}>
										{content.editModalDescription}
									</p>
									<div
										className={cn(['flex flex-col gap-4'])}
										data-loading={dataAttr(updateMutation.isLoading)}
									>
										<editForm.Field
											name="name"
											validators={{
												onBlur: EditOrgForm.validationRules.name,
											}}
										>
											{(field) => (
												<Input
													label={content.nameLabel}
													placeholder={content.namePlaceholder.value}
													name={field.name}
													value={field.state.value}
													onValueChange={field.handleChange}
													onBlur={field.handleBlur}
													isInvalid={!field.state.meta.isValid}
													errorMessage={
														<FieldError
															errors={parseFieldErrors(field.state.meta.errors)}
															maxDisplayLength={60}
															color="danger"
															size="sm"
														/>
													}
													variant="flat"
													isRequired
													size="sm"
												/>
											)}
										</editForm.Field>

										<editForm.Field
											name="description"
											validators={{
												onBlur: EditOrgForm.validationRules.description,
											}}
										>
											{(field) => (
												<Textarea
													label={content.descriptionLabel}
													placeholder={content.descriptionPlaceholder.value}
													name={field.name}
													value={field.state.value}
													onValueChange={field.handleChange}
													onBlur={field.handleBlur}
													isInvalid={!field.state.meta.isValid}
													errorMessage={
														<FieldError
															errors={parseFieldErrors(field.state.meta.errors)}
															maxDisplayLength={60}
															color="danger"
															size="sm"
														/>
													}
													variant="flat"
													isRequired
													size="sm"
													minRows={3}
												/>
											)}
										</editForm.Field>
									</div>
								</ModalBody>
								<ModalFooter>
									<Button
										color="default"
										variant="light"
										onPress={onClose}
										isDisabled={updateMutation.isLoading}
										size="sm"
									>
										{content.cancel}
									</Button>
									<editForm.Subscribe selector={(state) => state.isValid}>
										{(isFormValid) => (
											<Button
												type="submit"
												color="primary"
												isLoading={updateMutation.isLoading}
												data-loading={dataAttr(updateMutation.isLoading)}
												isDisabled={!isFormValid || updateMutation.isLoading}
												size="sm"
											>
												{updateMutation.isLoading
													? content.updating
													: content.saveChanges}
											</Button>
										)}
									</editForm.Subscribe>
								</ModalFooter>
							</form>
						</>
					)}
				</ModalContent>
			</Modal>

			{/* Delete Organization Modal */}
			<Modal
				isOpen={deleteModal.isOpen}
				onOpenChange={deleteModal.onOpenChange}
				size="sm"
				backdrop="blur"
				classNames={{
					base: 'bg-content1',
					header: 'border-b border-divider',
					footer: 'border-t border-divider',
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>
								<span className={cn(['font-medium text-danger'])}>
									{content.deleteModalTitle}
								</span>
							</ModalHeader>
							<ModalBody className={cn(['py-6'])}>
								<p className={cn(['text-foreground-500 text-small'])}>
									{content.deleteModalDescription}
								</p>
								{selectedOrganization && (
									<div
										className={cn(['mt-4 rounded-medium bg-danger-50/50 p-4'])}
									>
										<div className={cn(['flex flex-col gap-1'])}>
											<span className={cn(['font-medium text-foreground'])}>
												{selectedOrganization.name}
											</span>
											<span
												className={cn([
													'line-clamp-2 text-foreground-400 text-small',
												])}
											>
												{selectedOrganization.description ||
													content.noDescription}
											</span>
										</div>
									</div>
								)}
							</ModalBody>
							<ModalFooter>
								<Button
									color="default"
									variant="light"
									onPress={onClose}
									isDisabled={deleteMutation.isLoading}
									size="sm"
								>
									{content.cancel}
								</Button>
								<Button
									color="danger"
									onPress={handleConfirmDelete}
									isLoading={deleteMutation.isLoading}
									data-loading={dataAttr(deleteMutation.isLoading)}
									size="sm"
								>
									{deleteMutation.isLoading
										? content.deleting
										: content.confirmDelete}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			{/* Add Member Modal */}
			<Modal
				isOpen={addMemberModal.isOpen}
				onOpenChange={addMemberModal.onOpenChange}
				size="md"
				backdrop="blur"
				classNames={{
					base: 'bg-content1',
					header: 'border-b border-divider',
					footer: 'border-t border-divider',
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>
								<span className={cn(['font-medium text-foreground'])}>
									{content.addMemberTitle}
								</span>
							</ModalHeader>
							<ModalBody className={cn(['py-6'])}>
								<p className={cn(['text-foreground-400 text-small', 'mb-4'])}>
									{content.addMemberDescription}
								</p>
								<div className={cn(['flex flex-col gap-4'])}>
									<Select
										label={content.selectUser}
										placeholder={content.selectUserPlaceholder.value}
										selectedKeys={selectedUserId ? [selectedUserId] : []}
										onChange={(e) => setSelectedUserId(e.target.value)}
										variant="flat"
										isRequired
										size="sm"
									>
										{usersQuery.data?.map((user) => (
											<SelectItem key={user.id} textValue={user.name}>
												{user.name} ({user.email})
											</SelectItem>
										)) || []}
									</Select>
									<Select
										label={content.selectRole}
										placeholder={content.selectRolePlaceholder.value}
										selectedKeys={[selectedRole]}
										onChange={(e) =>
											setSelectedRole(e.target.value as MembershipRole)
										}
										variant="flat"
										isRequired
										size="sm"
									>
										{AVAILABLE_ROLES.map((role) => (
											<SelectItem
												key={role}
												textValue={content[role as keyof typeof content].value}
											>
												{content[role as keyof typeof content]}
											</SelectItem>
										))}
									</Select>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button
									color="default"
									variant="light"
									onPress={onClose}
									isDisabled={addMemberMutation.isLoading}
									size="sm"
								>
									{content.cancel}
								</Button>
								<Button
									color="primary"
									onPress={handleConfirmAddMember}
									isLoading={addMemberMutation.isLoading}
									isDisabled={!selectedUserId || addMemberMutation.isLoading}
									data-loading={dataAttr(addMemberMutation.isLoading)}
									size="sm"
								>
									{addMemberMutation.isLoading
										? content.adding
										: content.addMember}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			{/* View Members Modal */}
			<Modal
				isOpen={viewMembersModal.isOpen}
				onOpenChange={viewMembersModal.onOpenChange}
				size="3xl"
				backdrop="blur"
				scrollBehavior="inside"
				classNames={{
					base: 'bg-gradient-to-br from-content1 to-default-100',
					header: 'border-b border-divider/50 pb-4',
					footer: 'border-t border-divider/50 pt-4',
					body: 'py-6 px-6',
				}}
			>
				<ModalContent>
					{(onClose) => {
						const membersQuery = useOrganizationMembers(
							selectedOrganization?.id || null,
						);

						// Helper para obtener datos del usuario
						const getUserData = (userId: string) => {
							return usersQuery.data?.find((u) => u.id === userId);
						};

						const getUserInitials = (name: string) => {
							return name
								.split(' ')
								.map((word) => word[0])
								.join('')
								.toUpperCase()
								.slice(0, 2);
						};

						const getRoleBadgeColor = (role: MembershipRole) => {
							switch (role) {
								case 'owner':
									return 'danger';
								case 'admin':
									return 'warning';
								case 'member':
									return 'primary';
								case 'viewer':
									return 'default';
								default:
									return 'default';
							}
						};

						const getRoleIcon = (role: MembershipRole) => {
							switch (role) {
								case 'owner':
								case 'admin':
									return <ShieldCheckIcon size={14} weight="fill" />;
								default:
									return null;
							}
						};

						return (
							<>
								<ModalHeader>
									<div className={cn(['flex items-center gap-4 w-full'])}>
										<div
											className={cn([
												'flex h-12 w-12 items-center justify-center rounded-full',
												'bg-primary-100 text-primary shrink-0',
											])}
										>
											<UsersIcon size={24} weight="duotone" />
										</div>
										<div className={cn(['flex flex-col gap-1 flex-1'])}>
											<span className={cn(['font-semibold text-foreground text-lg'])}>
												{content.viewMembersTitle}
											</span>
											{selectedOrganization && (
												<div className={cn(['flex items-center gap-2'])}>
													<BuildingsIcon 
														size={14} 
														className={cn(['text-foreground-400'])}
														weight="duotone"
													/>
													<span
														className={cn([
															'text-foreground-500 text-small font-medium',
														])}
													>
														{selectedOrganization.name}
													</span>
												</div>
											)}
										</div>
										{membersQuery.data && membersQuery.data.length > 0 && (
											<Chip
												color="primary"
												variant="flat"
												size="lg"
												className={cn(['font-semibold'])}
											>
												{membersQuery.data.length}
											</Chip>
										)}
									</div>
								</ModalHeader>
								<ModalBody>
									{membersQuery.isLoading && (
										<div
											className={cn([
												'flex flex-col items-center justify-center gap-4 py-12',
											])}
										>
											<Spinner size="lg" color="primary" />
											<p className={cn(['text-foreground-500 text-small font-medium'])}>
												{content.loadingMembers}
											</p>
										</div>
									)}

									{membersQuery.isError && (
										<div
											className={cn([
												'flex flex-col items-center justify-center gap-4 py-12',
												'rounded-large bg-danger-50/50 p-8',
											])}
										>
											<UsersIcon
												size={48}
												className={cn(['text-danger-400'])}
												weight="duotone"
											/>
											<p className={cn(['text-danger text-small font-medium'])}>
												{content.error}
											</p>
										</div>
									)}

									{membersQuery.isSuccess && (
										<>
											{(!membersQuery.data || membersQuery.data.length === 0) && (
												<div
													className={cn([
														'flex flex-col items-center justify-center gap-4 py-12',
														'rounded-large bg-default-100/50 p-8',
													])}
												>
													<UsersIcon
														size={56}
														className={cn(['text-foreground-300'])}
														weight="duotone"
													/>
													<div className={cn(['text-center'])}>
														<p className={cn(['text-foreground-600 text-small font-medium'])}>
															{content.noMembers}
														</p>
														<p className={cn(['text-foreground-400 text-tiny mt-1'])}>
															{content.addMemberDescription}
														</p>
													</div>
												</div>
											)}

											{membersQuery.data && membersQuery.data.length > 0 && (
												<div className={cn(['flex flex-col gap-4'])}>
													<div className={cn(['grid grid-cols-1 md:grid-cols-2 gap-3'])}>
														{membersQuery.data.map((member, index) => {
															const userData = getUserData(member.userId);
															const roleIcon = getRoleIcon(member.role);

															return (
																<Card
																	key={member.id}
																	shadow="sm"
																	isPressable
																	isHoverable
																	className={cn([
																		'border border-divider/50 bg-content1/50',
																		'hover:border-primary/50 hover:bg-content1',
																		'transition-all duration-200',
																		'backdrop-blur-sm',
																	])}
																	style={{
																		animationDelay: `${index * 50}ms`,
																		animation: 'fadeIn 0.3s ease-out forwards',
																		opacity: 0,
																	}}
																>
																	<CardBody
																		className={cn(['flex flex-row items-center gap-4 p-4'])}
																	>
																		<div className={cn(['relative shrink-0'])}>
																			<Avatar
																				name={
																					userData?.name
																						? getUserInitials(userData.name)
																						: '??'
																				}
																				size="lg"
																				color="primary"
																				className={cn([
																					'ring-2 ring-primary/20',
																					'transition-transform hover:scale-110',
																				])}
																				isBordered
																			/>
																			{roleIcon && (
																				<div
																					className={cn([
																						'absolute -bottom-1 -right-1',
																						'flex h-6 w-6 items-center justify-center',
																						'rounded-full bg-content1',
																						'ring-2 ring-content1',
																						getRoleBadgeColor(member.role) === 'danger' 
																							? 'text-danger' 
																							: 'text-warning',
																					])}
																				>
																					{roleIcon}
																				</div>
																			)}
																		</div>
																		<div className={cn(['flex flex-1 flex-col gap-2 min-w-0'])}>
																			<div
																				className={cn([
																					'flex items-center gap-2 flex-wrap',
																				])}
																			>
																				<span
																					className={cn([
																						'font-semibold text-foreground text-base truncate',
																					])}
																				>
																					{userData?.name || 'Unknown User'}
																				</span>
																				<Badge
																					color={getRoleBadgeColor(member.role)}
																					variant="flat"
																					size="sm"
																					className={cn(['font-medium'])}
																				>
																					{content[member.role as keyof typeof content]}
																				</Badge>
																			</div>
																			
																			<div className={cn(['flex flex-col gap-1.5'])}>
																				<div
																					className={cn([
																						'flex items-center gap-2',
																					])}
																				>
																					<EnvelopeIcon
																						size={14}
																						className={cn(['text-foreground-400 shrink-0'])}
																						weight="duotone"
																					/>
																					<span
																						className={cn([
																							'text-foreground-500 text-tiny truncate',
																						])}
																					>
																						{userData?.email || 'No email'}
																					</span>
																				</div>
																				
																				<div
																					className={cn([
																						'flex items-center gap-2',
																					])}
																				>
																					<CalendarIcon
																						size={14}
																						className={cn(['text-foreground-400 shrink-0'])}
																						weight="duotone"
																					/>
																					<span
																						className={cn([
																							'text-foreground-500 text-tiny',
																						])}
																					>
																						{content.memberSince}:{' '}
																						{new Date(member.createdAt).toLocaleDateString(
																							undefined,
																							{
																								year: 'numeric',
																								month: 'short',
																								day: 'numeric',
																							},
																						)}
																					</span>
																				</div>
																			</div>
																		</div>
																	</CardBody>
																</Card>
															);
														})}
													</div>
												</div>
											)}
										</>
									)}
								</ModalBody>
								<ModalFooter>
									<Button
										color="primary"
										variant="shadow"
										onPress={onClose}
										size="md"
										className={cn(['font-medium'])}
									>
										{content.close}
									</Button>
								</ModalFooter>
							</>
						);
					}}
				</ModalContent>
			</Modal>
			<style>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</div>
	);
});

OrganizationsPage.displayName = 'OrganizationsPage';

export default OrganizationsPage;
