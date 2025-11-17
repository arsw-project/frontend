import {
	addToast,
	Button,
	Card,
	CardBody,
	Chip,
	cn,
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
	Select,
	SelectItem,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tooltip,
	User,
	useDisclosure,
} from '@heroui/react';
import {
	DotsThreeVerticalIcon,
	GoogleLogoIcon,
	MagnifyingGlassIcon,
	PencilSimpleIcon,
	ShieldCheckIcon,
	TrashIcon,
	UserCircleIcon,
	UsersIcon,
} from '@phosphor-icons/react';
import { FieldError } from '@shared/components/field-error/field-error.component';
import { useDeleteUserMutation } from '@shared/hooks/delete-user.hook';
import { useUsers } from '@shared/hooks/get-users.hook';
import { useUpdateUserMutation } from '@shared/hooks/update-user.hook';
import { useErrorParser } from '@shared/utility/errors';
import { dataAttr } from '@shared/utility/props';
import { useForm } from '@tanstack/react-form';
import { memo, useCallback, useMemo, useState } from 'react';
import { useIntlayer } from 'react-intlayer';
import { createEditUserForm, type EditUserFormState } from './users.validators';

export function meta() {
	return [
		{ title: 'ARSW Project - Users' },
		{ name: 'description', content: 'Manage users in the system' },
	];
}

type UserApi = {
	id: string;
	name: string;
	email: string;
	authProvider: string;
	providerId: string | null;
	role: string;
	createdAt: string;
	updatedAt: string;
};

const ROWS_PER_PAGE = 8;

const roleColorMap: Record<string, 'primary' | 'success' | 'warning'> = {
	user: 'primary',
	admin: 'success',
	system: 'warning',
};

const UsersPage = memo(() => {
	const { parseFieldErrors } = useErrorParser();
	const content = useIntlayer('users');
	const usersQuery = useUsers();

	const [filterValue, setFilterValue] = useState('');
	const [page, setPage] = useState(1);

	const editModal = useDisclosure();
	const deleteModal = useDisclosure();
	const [selectedUser, setSelectedUser] = useState<UserApi | null>(null);

	const EditUserForm = createEditUserForm({
		nameRequired: content.nameRequired.value,
		emailRequired: content.emailRequired.value,
		invalidEmail: content.invalidEmail.value,
	});

	const updateMutation = useUpdateUserMutation({
		onSuccess: () => {
			addToast({
				title: content.userUpdated,
				color: 'success',
				timeout: 3000,
			});
			editModal.onClose();
			setSelectedUser(null);
		},
	});

	const deleteMutation = useDeleteUserMutation({
		onSuccess: () => {
			addToast({
				title: content.userDeleted,
				color: 'success',
				timeout: 3000,
			});
			deleteModal.onClose();
			setSelectedUser(null);
		},
	});

	const editForm = useForm({
		defaultValues: {
			name: selectedUser?.name || '',
			email: selectedUser?.email || '',
			role: (selectedUser?.role || 'user') as 'user' | 'admin' | 'system',
		} as EditUserFormState,

		onSubmit: async ({ value }) => {
			if (!selectedUser) return;

			const changes: {
				name?: string;
				email?: string;
				role?: 'user' | 'admin' | 'system';
			} = {};

			if (value.name !== selectedUser.name) changes.name = value.name;
			if (value.email !== selectedUser.email) changes.email = value.email;
			if (value.role !== selectedUser.role) changes.role = value.role;

			if (Object.keys(changes).length > 0) {
				try {
					await updateMutation.execute(selectedUser.id, changes);
				} catch (error) {
					console.error('Update failed:', error);
				}
			} else {
				editModal.onClose();
			}
		},
	});

	const filteredItems = useMemo(() => {
		if (!usersQuery.data) return [];

		let filtered = [...usersQuery.data];

		if (filterValue) {
			const searchLower = filterValue.toLowerCase();
			filtered = filtered.filter(
				(user) =>
					user.name.toLowerCase().includes(searchLower) ||
					user.email.toLowerCase().includes(searchLower),
			);
		}

		return filtered;
	}, [usersQuery.data, filterValue]);

	const stats = useMemo(() => {
		const users = usersQuery.data || [];
		const totalUsers = users.length;
		const adminCount = users.filter((u) => u.role === 'admin').length;
		const googleCount = users.filter((u) => u.authProvider === 'google').length;
		const localCount = users.filter((u) => u.authProvider === 'local').length;

		return {
			totalUsers,
			adminCount,
			googleCount,
			localCount,
		};
	}, [usersQuery.data]);

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

	const handleEditUser = useCallback(
		(user: UserApi) => {
			setSelectedUser(user);
			editForm.reset();
			editForm.setFieldValue('name', user.name);
			editForm.setFieldValue('email', user.email);
			editForm.setFieldValue('role', user.role as 'user' | 'admin' | 'system');
			editModal.onOpen();
		},
		[editModal, editForm],
	);

	const handleDeleteUser = useCallback(
		(user: UserApi) => {
			setSelectedUser(user);
			deleteModal.onOpen();
		},
		[deleteModal],
	);

	const handleConfirmDelete = useCallback(async () => {
		if (!selectedUser) return;
		await deleteMutation.execute(selectedUser.id);
	}, [deleteMutation, selectedUser]);

	const getRoleLabel = useCallback(
		(role: string) => {
			switch (role) {
				case 'admin':
					return content.roleAdmin;
				case 'system':
					return content.roleSystem;
				default:
					return content.roleUser;
			}
		},
		[content],
	);

	const getProviderLabel = useCallback(
		(provider: string) => {
			return provider === 'google'
				? content.providerGoogle
				: content.providerLocal;
		},
		[content],
	);

	const formatDate = useCallback((dateString: string) => {
		return new Date(dateString).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}, []);

	const renderCell = useCallback(
		(user: UserApi, columnKey: string) => {
			switch (columnKey) {
				case 'user':
					return (
						<User
							avatarProps={{
								radius: 'full',
								size: 'md',
								name: user.name,
								classNames: {
									base: 'bg-gradient-to-br from-primary-500 to-secondary-500',
									name: 'text-primary-foreground font-medium',
								},
							}}
							classNames={{
								description: 'text-foreground-500',
							}}
							description={user.email}
							name={user.name}
						/>
					);
				case 'role':
					return (
						<Chip
							className={cn(['capitalize'])}
							color={roleColorMap[user.role] || 'default'}
							size="sm"
							variant="flat"
						>
							{getRoleLabel(user.role)}
						</Chip>
					);
				case 'provider':
					return (
						<Chip
							className={cn(['capitalize'])}
							color={user.authProvider === 'google' ? 'secondary' : 'default'}
							size="sm"
							variant="dot"
						>
							{getProviderLabel(user.authProvider)}
						</Chip>
					);
				case 'createdAt':
					return (
						<span className={cn(['text-foreground-500 text-small'])}>
							{formatDate(user.createdAt)}
						</span>
					);
				case 'actions':
					return (
						<div
							className={cn(['relative flex items-center justify-end gap-2'])}
						>
							<Tooltip content={content.editUser}>
								<Button
									isIconOnly
									size="sm"
									variant="light"
									color="default"
									onPress={() => handleEditUser(user)}
									className={cn(['text-foreground-500 hover:text-primary'])}
								>
									<PencilSimpleIcon size={18} />
								</Button>
							</Tooltip>
							<Tooltip content={content.deleteUser} color="danger">
								<Button
									isIconOnly
									size="sm"
									variant="light"
									color="danger"
									onPress={() => handleDeleteUser(user)}
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
								<DropdownMenu aria-label="User actions">
									<DropdownItem
										key="edit"
										startContent={<PencilSimpleIcon size={16} />}
										onPress={() => handleEditUser(user)}
										textValue={content.editUser.value}
									>
										{content.editUser}
									</DropdownItem>
									<DropdownItem
										key="delete"
										color="danger"
										className={cn(['text-danger'])}
										startContent={<TrashIcon size={16} />}
										onPress={() => handleDeleteUser(user)}
										textValue={content.deleteUser.value}
									>
										{content.deleteUser}
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</div>
					);
				default:
					return null;
			}
		},
		[
			content,
			getRoleLabel,
			getProviderLabel,
			formatDate,
			handleEditUser,
			handleDeleteUser,
		],
	);

	const topContent = useMemo(() => {
		return (
			<div className={cn(['flex items-center gap-4'])}>
				<Input
					isClearable
					classNames={{
						base: 'w-full max-w-xs',
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
			</div>
		);
	}, [content, filterValue, handleSearchChange]);

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

	if (usersQuery.isLoading) {
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

	if (usersQuery.isError) {
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
					<UsersIcon
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
		{ key: 'user', label: content.name },
		{ key: 'role', label: content.role },
		{ key: 'provider', label: content.provider },
		{ key: 'createdAt', label: content.createdAt },
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
			<div className={cn(['grid grid-cols-2 gap-4', 'md:grid-cols-4'])}>
				<Card shadow="sm" className={cn(['border-none bg-default-50'])}>
					<CardBody className={cn(['flex flex-row items-center gap-4 p-4'])}>
						<div
							className={cn([
								'flex h-10 w-10 items-center justify-center rounded-medium',
								'bg-primary-100 text-primary',
							])}
						>
							<UsersIcon size={20} weight="duotone" />
						</div>
						<div>
							<p className={cn(['text-foreground-400 text-tiny uppercase'])}>
								{content.summaryTotalUsers}
							</p>
							<p className={cn(['font-semibold text-xl text-foreground'])}>
								{stats.totalUsers}
							</p>
						</div>
					</CardBody>
				</Card>

				<Card shadow="sm" className={cn(['bg-default-50 border-none'])}>
					<CardBody className={cn(['flex flex-row items-center gap-4 p-4'])}>
						<div
							className={cn([
								'flex h-10 w-10 items-center justify-center rounded-medium',
								'bg-success-100 text-success',
							])}
						>
							<ShieldCheckIcon size={20} weight="duotone" />
						</div>
						<div>
							<p className={cn(['text-foreground-400 text-tiny uppercase'])}>
								{content.summaryAdmins}
							</p>
							<p className={cn(['font-semibold text-xl text-foreground'])}>
								{stats.adminCount}
							</p>
						</div>
					</CardBody>
				</Card>

				<Card shadow="sm" className={cn(['bg-default-50 border-none'])}>
					<CardBody className={cn(['flex flex-row items-center gap-4 p-4'])}>
						<div
							className={cn([
								'flex h-10 w-10 items-center justify-center rounded-medium',
								'bg-secondary-100 text-secondary',
							])}
						>
							<GoogleLogoIcon size={20} weight="duotone" />
						</div>
						<div>
							<p className={cn(['text-foreground-400 text-tiny uppercase'])}>
								{content.summaryGoogleUsers}
							</p>
							<p className={cn(['font-semibold text-xl text-foreground'])}>
								{stats.googleCount}
							</p>
						</div>
					</CardBody>
				</Card>

				<Card shadow="sm" className={cn(['bg-default-50 border-none'])}>
					<CardBody className={cn(['flex flex-row items-center gap-4 p-4'])}>
						<div
							className={cn([
								'flex h-10 w-10 items-center justify-center rounded-medium',
								'bg-warning-100 text-warning',
							])}
						>
							<UserCircleIcon size={20} weight="duotone" />
						</div>
						<div>
							<p className={cn(['text-foreground-400 text-tiny uppercase'])}>
								{content.summaryLocalUsers}
							</p>
							<p className={cn(['font-semibold text-xl text-foreground'])}>
								{stats.localCount}
							</p>
						</div>
					</CardBody>
				</Card>
			</div>
			<div className={cn(['flex-1'])}>
				<Table
					aria-label="Users table"
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
						emptyContent={content.noUsers}
						loadingContent={<Spinner color="primary" size="sm" />}
					>
						{(item) => (
							<TableRow key={item.id}>
								{(columnKey) => (
									<TableCell>{renderCell(item, columnKey as string)}</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
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
											validators={{ onBlur: EditUserForm.validationRules.name }}
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
											name="email"
											validators={{
												onBlur: EditUserForm.validationRules.email,
											}}
										>
											{(field) => (
												<Input
													label={content.emailLabel}
													placeholder={content.emailPlaceholder.value}
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
													type="email"
													isRequired
													size="sm"
												/>
											)}
										</editForm.Field>

										<editForm.Field name="role">
											{(field) => (
												<Select
													label={content.roleLabel}
													selectedKeys={new Set([field.state.value])}
													onSelectionChange={(keys) => {
														const key = Array.from(keys)[0];
														if (key)
															field.setValue(
																key as 'user' | 'admin' | 'system',
															);
													}}
													variant="flat"
													size="sm"
												>
													<SelectItem
														key="user"
														textValue={content.roleUser.value}
													>
														{content.roleUser}
													</SelectItem>
													<SelectItem
														key="admin"
														textValue={content.roleAdmin.value}
													>
														{content.roleAdmin}
													</SelectItem>
													<SelectItem
														key="system"
														textValue={content.roleSystem.value}
													>
														{content.roleSystem}
													</SelectItem>
												</Select>
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
			</Modal>{' '}
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
								{selectedUser && (
									<div
										className={cn(['mt-4 rounded-medium bg-danger-50/50 p-4'])}
									>
										<User
											avatarProps={{
												radius: 'full',
												size: 'sm',
												name: selectedUser.name,
												classNames: {
													base: 'bg-danger-100',
												},
											}}
											classNames={{
												description: 'text-foreground-400',
											}}
											description={selectedUser.email}
											name={selectedUser.name}
										/>
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
		</div>
	);
});

UsersPage.displayName = 'UsersPage';

export default UsersPage;
