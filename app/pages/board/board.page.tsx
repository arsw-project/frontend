import {
	Badge,
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	cn,
	Form,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	Textarea,
	useDisclosure,
} from '@heroui/react';
import type { UserApi } from '@pages/users/users.validators';
import {
	KanbanIcon,
	PlusIcon,
	StackIcon,
	TrashIcon,
} from '@phosphor-icons/react';
import { useSession } from '@providers/session.provider';
import { AcceptanceCriteriaList } from '@shared/components/acceptance-criteria-list/acceptance-criteria-list.component';
import { FieldError } from '@shared/components/field-error/field-error.component';
import { TicketCard } from '@shared/components/ticket-card/ticket-card.component';
import { useUsers } from '@shared/hooks/get-users.hook';
import { useCreateTicketMutation } from '@shared/hooks/tickets/create-ticket.hook';
import { useDeleteTicketMutation } from '@shared/hooks/tickets/delete-ticket.hook';
import { useTickets } from '@shared/hooks/tickets/get-tickets.hook';
import type { TicketApi } from '@shared/hooks/tickets/ticket.types';
import { useUpdateTicketMutation } from '@shared/hooks/tickets/update-ticket.hook';
import { useErrorParser } from '@shared/utility/errors';
import { useForm } from '@tanstack/react-form';
import type { FormEvent, ReactNode } from 'react';
import { memo, useCallback, useMemo, useState } from 'react';
import { useIntlayer } from 'react-intlayer';
import {
	type CreateTicketFormState,
	createTicketForm,
	type TicketDifficulty,
	type TicketStatus,
} from './board.validators';

export function meta() {
	return [
		{ title: 'ARSW Project - Board' },
		{ name: 'description', content: 'Ticket management board' },
	];
}

interface Column {
	id: string;
	title: ReactNode;
	status: TicketStatus;
	tickets: TicketApi[];
}

const BoardColumn = memo<{
	column: Column;
	emptyMessage: ReactNode;
	createTicketLabel: ReactNode;
	onCreateClick: (status: TicketStatus) => void;
	onTicketClick?: (ticketId: string) => void;
	users?: UserApi[];
}>(
	({
		column,
		emptyMessage,
		createTicketLabel,
		onCreateClick,
		onTicketClick,
		users,
	}) => {
		const handleCreatePress = useCallback(() => {
			onCreateClick(column.status);
		}, [column.status, onCreateClick]);

		return (
			<Card
				className={cn([
					'min-w-[280px] flex-1 sm:min-w-[300px] md:min-w-[320px]',
					'border border-divider shadow-small',
					'flex flex-col',
				])}
			>
				<CardHeader
					className={cn([
						'flex flex-row items-center justify-between',
						'px-4 sm:px-5 md:px-6',
						'py-3 sm:py-4',
						'border-divider border-b',
					])}
				>
					<div className={cn(['flex items-center gap-2 sm:gap-3'])}>
						<StackIcon
							size={18}
							weight="duotone"
							className={cn(['text-primary'])}
						/>
						<h3
							className={cn([
								'font-semibold text-base sm:text-lg md:text-xl',
								'text-foreground',
							])}
						>
							{column.title}
						</h3>
					</div>
					<div className={cn(['flex items-center gap-2'])}>
						<Badge
							color="default"
							variant="flat"
							size="sm"
							className={cn(['text-xs sm:text-small'])}
						>
							{column.tickets.length}
						</Badge>
						<Button
							isIconOnly
							size="sm"
							variant="light"
							aria-label={String(createTicketLabel)}
							onPress={handleCreatePress}
							className={cn(['text-primary hover:bg-primary-50'])}
						>
							<PlusIcon size={18} weight="bold" />
						</Button>
					</div>
				</CardHeader>

				<CardBody
					className={cn([
						'px-3 sm:px-4 md:px-5',
						'py-3 sm:py-4 md:py-5',
						'flex flex-col gap-3 sm:gap-4',
						'min-h-[300px] sm:min-h-[400px] md:min-h-[500px]',
					])}
				>
					{column.tickets.length === 0 ? (
						<div
							className={cn([
								'flex flex-col items-center justify-center',
								'h-full min-h-[200px]',
								'text-center',
							])}
						>
							<div
								className={cn([
									'mb-3 rounded-full bg-default-100 p-4 sm:mb-4 sm:p-5 md:p-6',
								])}
							>
								<KanbanIcon
									size={32}
									weight="duotone"
									className={cn(['text-default-400'])}
								/>
							</div>
							<p
								className={cn([
									'text-foreground-400 text-sm sm:text-base md:text-medium',
								])}
							>
								{emptyMessage}
							</p>
						</div>
					) : (
						<div className={cn(['space-y-3 sm:space-y-4'])}>
							{column.tickets.map((ticket) => (
								<TicketCard
									key={ticket.id}
									ticket={ticket}
									users={users}
									onClick={() => onTicketClick?.(ticket.id)}
								/>
							))}
						</div>
					)}
				</CardBody>
			</Card>
		);
	},
);

BoardColumn.displayName = 'BoardColumn';

const IndexedChip = memo(
	({
		value,
		index,
		color,
		onRemove,
	}: {
		value: string;
		index: number;
		color: 'primary' | 'secondary';
		onRemove: (index: number) => void;
	}) => {
		const handleClose = useCallback(() => {
			onRemove(index);
		}, [index, onRemove]);

		return (
			<Chip
				variant="flat"
				color={color}
				onClose={handleClose}
				className={cn(['cursor-pointer'])}
			>
				{value}
			</Chip>
		);
	},
);

IndexedChip.displayName = 'IndexedChip';

const BoardPage = memo(() => {
	const { parseFieldErrors } = useErrorParser();
	const {
		title,
		subtitle,
		columnOpen,
		columnInProgress,
		columnDone,
		emptyColumn,
		createTicket,
		createTicketTitle,
		ticketTitle,
		ticketTitlePlaceholder,
		ticketDescription,
		ticketDescriptionPlaceholder,
		acceptanceCriteria: acceptanceCriteriaLabel,
		acceptanceCriteriaPlaceholder,
		difficulty: difficultyLabel,
		difficultySmall,
		difficultyMedium,
		difficultyLarge,
		tags: tagsLabel,
		tagPlaceholder,
		cancel,
		create,
		editTicketTitle,
		saveChanges,
		delete: deleteLabel,
		deleteTicketTitle,
		deleteTicketConfirm,
		assignTo,
		selectUser,
		status,
	} = useIntlayer('board');

	const TicketForm = useMemo(() => createTicketForm(), []);
	const createTicketMutation = useCreateTicketMutation();
	const updateTicketMutation = useUpdateTicketMutation();
	const deleteTicketMutation = useDeleteTicketMutation();

	const { session } = useSession();
	const createModal = useDisclosure();
	const editModal = useDisclosure();
	const deleteModal = useDisclosure();
	const [_selectedStatus, setSelectedStatus] = useState<TicketStatus>('Open');
	const [selectedTicket, setSelectedTicket] = useState<TicketApi | null>(null);

	const orgIdFromSession = session.data?.user?.membership?.organizationId ?? '';
	const createdByFromSession = session.data?.user?.id ?? '';

	const ticketsQuery = useTickets(orgIdFromSession);

	const form = useForm({
		defaultValues: {
			orgId: '',
			title: '',
			description: '',
			acceptanceCriteria: [],
			newAcceptanceCriteria: '',
			status: 'Open',
			assigneeId: null,
			difficulty: 'M',
			tags: [],
			newTag: '',
			createdBy: '',
		} as CreateTicketFormState,
		onSubmit: async ({ value }) => {
			const payload = TicketForm.validationSchema.parse(value);

			try {
				await createTicketMutation.execute(payload);
				createModal.onClose();
				form.reset();
			} catch (error) {
				console.error('Create ticket failed:', error);
			}
		},
	});

	const usersQuery = useUsers();

	const editForm = useForm({
		defaultValues: {
			title: '',
			description: '',
			status: 'Open' as TicketStatus,
			difficulty: 'M' as TicketDifficulty,
			assigneeId: null as string | null,
			acceptanceCriteria: [] as string[],
			newAcceptanceCriteria: '',
			tags: [] as string[],
			newTag: '',
		},
		onSubmit: async ({ value }) => {
			if (!selectedTicket) return;

			try {
				await updateTicketMutation.execute(selectedTicket.id, {
					title: value.title.trim(),
					description: value.description.trim(),
					status: value.status,
					difficulty: value.difficulty,
					assigneeId: value.assigneeId,
					acceptanceCriteria: value.acceptanceCriteria,
					tags: value.tags,
				});
				editModal.onClose();
				setSelectedTicket(null);
				editForm.reset();
			} catch (error) {
				console.error('Update ticket failed:', error);
			}
		},
	});

	const columns = useMemo<Column[]>(() => {
		const tickets = ticketsQuery.data || [];

		return [
			{
				id: 'open',
				title: columnOpen,
				status: 'Open',
				tickets: tickets.filter((t) => t.status === 'Open'),
			},
			{
				id: 'in-progress',
				title: columnInProgress,
				status: 'In Progress',
				tickets: tickets.filter((t) => t.status === 'In Progress'),
			},
			{
				id: 'done',
				title: columnDone,
				status: 'Done',
				tickets: tickets.filter((t) => t.status === 'Done'),
			},
		];
	}, [columnOpen, columnInProgress, columnDone, ticketsQuery.data]);

	const handleCreateClick = useCallback(
		(status: TicketStatus) => {
			setSelectedStatus(status);
			form.reset();
			form.setFieldValue('status', status);
			form.setFieldValue('orgId', orgIdFromSession);
			form.setFieldValue('createdBy', createdByFromSession);
			form.setFieldValue('assigneeId', createdByFromSession);
			createModal.onOpen();
		},
		[createModal, createdByFromSession, form, orgIdFromSession],
	);

	const handleAddCriteria = useCallback(() => {
		const next = form.getFieldValue('newAcceptanceCriteria').trim();
		if (!next) return;

		const current = form.getFieldValue('acceptanceCriteria');
		form.setFieldValue('acceptanceCriteria', [...current, next]);
		form.setFieldValue('newAcceptanceCriteria', '');
	}, [form]);

	const handleRemoveCriteria = useCallback(
		(index: number) => {
			const currentCriteria = form.getFieldValue('acceptanceCriteria');
			form.setFieldValue(
				'acceptanceCriteria',
				currentCriteria.filter((_, i) => i !== index),
			);
		},
		[form],
	);

	const handleAddTag = useCallback(() => {
		const next = form.getFieldValue('newTag').trim();
		if (!next) return;

		const current = form.getFieldValue('tags');
		form.setFieldValue('tags', [...current, next]);
		form.setFieldValue('newTag', '');
	}, [form]);

	const handleRemoveTag = useCallback(
		(index: number) => {
			const currentTags = form.getFieldValue('tags');
			form.setFieldValue(
				'tags',
				currentTags.filter((_, i) => i !== index),
			);
		},
		[form],
	);

	const handleCloseModal = useCallback(() => {
		createModal.onClose();
		form.reset();
	}, [createModal, form]);

	const handleSubmit = useCallback(
		(event: FormEvent) => {
			event.preventDefault();
			event.stopPropagation();
			form.handleSubmit();
		},
		[form],
	);

	const handleSubmitPress = useCallback(() => {
		form.handleSubmit();
	}, [form]);

	const handleEditTicket = useCallback(
		(ticket: TicketApi) => {
			setSelectedTicket(ticket);
			editForm.setFieldValue('title', ticket.title);
			editForm.setFieldValue('description', ticket.description);
			editForm.setFieldValue('status', ticket.status);
			editForm.setFieldValue('difficulty', ticket.difficulty);
			editForm.setFieldValue('assigneeId', ticket.assigneeId ?? null);
			editForm.setFieldValue(
				'acceptanceCriteria',
				ticket.acceptanceCriteria || [],
			);
			editForm.setFieldValue('tags', ticket.tags || []);
			editModal.onOpen();
		},
		[editModal, editForm],
	);

	const handleDeleteTicket = useCallback(
		(ticket: TicketApi) => {
			setSelectedTicket(ticket);
			deleteModal.onOpen();
		},
		[deleteModal],
	);

	const handleAddEditCriteria = useCallback(() => {
		const next = editForm.getFieldValue('newAcceptanceCriteria').trim();
		if (!next) return;

		const current = editForm.getFieldValue('acceptanceCriteria');
		editForm.setFieldValue('acceptanceCriteria', [...current, next]);
		editForm.setFieldValue('newAcceptanceCriteria', '');
	}, [editForm]);

	const handleRemoveEditCriteria = useCallback(
		(index: number) => {
			const currentCriteria = editForm.getFieldValue('acceptanceCriteria');
			editForm.setFieldValue(
				'acceptanceCriteria',
				currentCriteria.filter((_, i) => i !== index),
			);
		},
		[editForm],
	);

	const handleAddEditTag = useCallback(() => {
		const next = editForm.getFieldValue('newTag').trim();
		if (!next) return;

		const current = editForm.getFieldValue('tags');
		editForm.setFieldValue('tags', [...current, next]);
		editForm.setFieldValue('newTag', '');
	}, [editForm]);

	const handleRemoveEditTag = useCallback(
		(index: number) => {
			const currentTags = editForm.getFieldValue('tags');
			editForm.setFieldValue(
				'tags',
				currentTags.filter((_, i) => i !== index),
			);
		},
		[editForm],
	);

	const handleConfirmDelete = useCallback(async () => {
		if (!selectedTicket) return;
		try {
			await deleteTicketMutation.execute(selectedTicket.id);
			deleteModal.onClose();
			setSelectedTicket(null);
		} catch (error) {
			console.error('Delete ticket failed:', error);
		}
	}, [selectedTicket, deleteTicketMutation, deleteModal]);

	const handleTicketClick = useCallback(
		(ticketId: string) => {
			const ticket = ticketsQuery.data?.find((t) => t.id === ticketId);
			if (ticket) {
				handleEditTicket(ticket);
			}
		},
		[ticketsQuery.data, handleEditTicket],
	);

	return (
		<div
			className={cn([
				'flex h-full w-full flex-col',
				'bg-background',
				'overflow-hidden',
			])}
		>
			{/* Header */}
			<div
				className={cn([
					'flex flex-col items-start justify-between sm:flex-row sm:items-center',
					'px-4 sm:px-6 md:px-8 lg:px-10',
					'py-4 sm:py-5 md:py-6',
					'border-divider border-b',
					'gap-3 sm:gap-4',
				])}
			>
				<div className={cn(['flex-1 space-y-1'])}>
					<h1
						className={cn([
							'font-bold text-2xl sm:text-3xl md:text-4xl',
							'text-foreground',
						])}
					>
						{title}
					</h1>
					<p
						className={cn([
							'text-foreground-500 text-sm sm:text-base md:text-medium',
						])}
					>
						{subtitle}
					</p>
				</div>
			</div>

			{/* Board Content */}
			<div
				className={cn([
					'flex-1 overflow-x-auto overflow-y-hidden',
					'px-4 sm:px-6 md:px-8 lg:px-10',
					'py-4 sm:py-5 md:py-6',
				])}
			>
				<div
					className={cn([
						'flex gap-4 sm:gap-5 md:gap-6',
						'h-full',
						'min-w-min',
					])}
				>
					{columns.map((column) => (
						<BoardColumn
							key={column.id}
							column={column}
							emptyMessage={emptyColumn}
							createTicketLabel={createTicket}
							onCreateClick={handleCreateClick}
							onTicketClick={handleTicketClick}
							users={usersQuery.data}
						/>
					))}
				</div>
			</div>

			{/* Create Ticket Modal */}
			<Modal
				isOpen={createModal.isOpen}
				onOpenChange={createModal.onOpenChange}
				size="lg"
				backdrop="blur"
				classNames={{
					base: 'bg-content1',
					header: 'border-b border-divider',
					closeButton: 'hover:bg-default-100',
				}}
			>
				<ModalContent>
					<ModalHeader className={cn(['flex flex-col gap-1'])}>
						<h2 className={cn(['font-semibold text-foreground text-xl'])}>
							{createTicketTitle}
						</h2>
					</ModalHeader>

					<ModalBody className={cn(['gap-4'])}>
						<Form
							validationBehavior="aria"
							onSubmit={handleSubmit}
							className={cn(['flex flex-col gap-4'])}
						>
							{/* Title Field */}
							<form.Field
								name="title"
								validators={{ onBlur: TicketForm.validationRules.title }}
							>
								{(field) => (
									<Input
										label={ticketTitle}
										placeholder={ticketTitlePlaceholder.value}
										color={!field.state.meta.isValid ? 'danger' : 'primary'}
										variant="bordered"
										name={field.name}
										value={field.state.value}
										onValueChange={field.handleChange}
										onBlur={field.handleBlur}
										isInvalid={!field.state.meta.isValid}
										errorMessage={
											<FieldError
												errors={parseFieldErrors(field.state.meta.errors)}
												maxDisplayLength={60}
												size="sm"
												color="danger"
											/>
										}
										className={cn(['w-full'])}
									/>
								)}
							</form.Field>

							{/* Description Field */}
							<form.Field
								name="description"
								validators={{ onBlur: TicketForm.validationRules.description }}
							>
								{(field) => (
									<Textarea
										label={ticketDescription}
										placeholder={ticketDescriptionPlaceholder.value}
										color={!field.state.meta.isValid ? 'danger' : 'primary'}
										variant="bordered"
										name={field.name}
										value={field.state.value}
										onValueChange={field.handleChange}
										onBlur={field.handleBlur}
										isInvalid={!field.state.meta.isValid}
										errorMessage={
											<FieldError
												errors={parseFieldErrors(field.state.meta.errors)}
												maxDisplayLength={60}
												size="sm"
												color="danger"
											/>
										}
										className={cn(['w-full'])}
										rows={4}
									/>
								)}
							</form.Field>

							{/* Difficulty Field */}
							<form.Field name="difficulty">
								{(field) => (
									<Select
										label={difficultyLabel}
										selectedKeys={[field.state.value]}
										onSelectionChange={(keys) => {
											const selected = Array.from(keys)[0];
											if (selected) {
												field.handleChange(selected as TicketDifficulty);
											}
										}}
										color="primary"
										variant="bordered"
										className={cn(['w-full'])}
									>
										<SelectItem key="S" textValue={difficultySmall.value}>
											{difficultySmall}
										</SelectItem>
										<SelectItem key="M" textValue={difficultyMedium.value}>
											{difficultyMedium}
										</SelectItem>
										<SelectItem key="L" textValue={difficultyLarge.value}>
											{difficultyLarge}
										</SelectItem>
									</Select>
								)}
							</form.Field>

							{/* Assignee Field */}
							<form.Field name="assigneeId">
								{(field) => (
									<Select
										label={assignTo}
										placeholder={selectUser.value}
										selectedKeys={field.state.value ? [field.state.value] : []}
										onSelectionChange={(keys) => {
											const selected = Array.from(keys)[0];
											field.handleChange(selected as string);
										}}
										color="primary"
										variant="bordered"
										className={cn(['w-full'])}
										isLoading={usersQuery.isLoading}
									>
										{(usersQuery.data || []).map((user) => (
											<SelectItem
												key={user.id}
												textValue={user.name || user.email}
											>
												{user.name || user.email}
											</SelectItem>
										))}
									</Select>
								)}
							</form.Field>

							{/* Tags Field */}
							<form.Field
								name="tags"
								validators={{ onChange: TicketForm.validationRules.tags }}
							>
								{(field) => (
									<div className={cn(['flex flex-col gap-2 w-full'])}>
										<span
											className={cn(['font-medium text-foreground text-sm'])}
										>
											{tagsLabel}
										</span>
										<div className={cn(['flex gap-2'])}>
											<form.Field name="newTag">
												{(newField) => (
													<Input
														placeholder={tagPlaceholder.value}
														variant="bordered"
														name={newField.name}
														value={newField.state.value}
														onValueChange={newField.handleChange}
														onBlur={newField.handleBlur}
														className={cn(['flex-1'])}
													/>
												)}
											</form.Field>
											<Button
												isIconOnly
												color="primary"
												variant="flat"
												onPress={handleAddTag}
											>
												<PlusIcon size={18} />
											</Button>
										</div>
										{field.state.value && field.state.value.length > 0 && (
											<div className={cn(['mt-2 flex flex-wrap gap-2'])}>
												{field.state.value.map((tagValue, index) => (
													<IndexedChip
														key={`tag-${tagValue}`}
														value={tagValue}
														index={index}
														color="secondary"
														onRemove={handleRemoveTag}
													/>
												))}
											</div>
										)}
										<FieldError
											errors={parseFieldErrors(field.state.meta.errors)}
											maxDisplayLength={60}
											size="sm"
											color="danger"
										/>
									</div>
								)}
							</form.Field>

							{/* Acceptance Criteria Field */}
							<form.Field
								name="acceptanceCriteria"
								validators={{
									onChange: TicketForm.validationRules.acceptanceCriteria,
								}}
							>
								{(field) => (
									<div className={cn(['flex flex-col gap-2 w-full'])}>
										<span
											className={cn(['font-medium text-foreground text-sm'])}
										>
											{acceptanceCriteriaLabel}
										</span>
										<div className={cn(['flex gap-2'])}>
											<form.Field name="newAcceptanceCriteria">
												{(newField) => (
													<Input
														placeholder={acceptanceCriteriaPlaceholder.value}
														variant="bordered"
														name={newField.name}
														value={newField.state.value}
														onValueChange={newField.handleChange}
														onBlur={newField.handleBlur}
														className={cn(['flex-1'])}
													/>
												)}
											</form.Field>
											<Button
												isIconOnly
												color="primary"
												variant="flat"
												onPress={handleAddCriteria}
											>
												<PlusIcon size={18} />
											</Button>
										</div>
										{field.state.value && field.state.value.length > 0 && (
											<AcceptanceCriteriaList
												criteria={field.state.value}
												onRemove={handleRemoveCriteria}
											/>
										)}
										<FieldError
											errors={parseFieldErrors(field.state.meta.errors)}
											maxDisplayLength={60}
											size="sm"
											color="danger"
										/>
									</div>
								)}
							</form.Field>
						</Form>
					</ModalBody>

					<ModalFooter className={cn(['gap-2'])}>
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<>
									<Button
										color="default"
										variant="light"
										onPress={handleCloseModal}
										isDisabled={isSubmitting}
									>
										{cancel}
									</Button>
									<Button
										color="primary"
										isDisabled={!canSubmit || isSubmitting}
										isLoading={isSubmitting}
										onPress={handleSubmitPress}
									>
										{create}
									</Button>
								</>
							)}
						</form.Subscribe>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Edit Ticket Modal */}
			<Modal
				isOpen={editModal.isOpen}
				onOpenChange={editModal.onOpenChange}
				size="lg"
				backdrop="blur"
				classNames={{
					base: 'bg-content1',
					header: 'border-b border-divider',
					closeButton: 'hover:bg-default-100',
				}}
			>
				<ModalContent>
					<ModalHeader className={cn(['flex flex-col gap-1'])}>
						<h2 className={cn(['font-semibold text-foreground text-xl'])}>
							{editTicketTitle}
						</h2>
					</ModalHeader>

					<ModalBody className={cn(['gap-4'])}>
						<Form
							validationBehavior="aria"
							onSubmit={(e) => {
								e.preventDefault();
								editForm.handleSubmit();
							}}
							className={cn(['flex flex-col gap-4'])}
						>
							{/* Title Field */}
							<editForm.Field name="title">
								{(field) => (
									<Input
										label={ticketTitle}
										placeholder={ticketTitlePlaceholder.value}
										color="primary"
										variant="bordered"
										name={field.name}
										value={field.state.value}
										onValueChange={field.handleChange}
										onBlur={field.handleBlur}
										className={cn(['w-full'])}
									/>
								)}
							</editForm.Field>

							{/* Description Field */}
							<editForm.Field name="description">
								{(field) => (
									<Textarea
										label={ticketDescription}
										placeholder={ticketDescriptionPlaceholder.value}
										color="primary"
										variant="bordered"
										name={field.name}
										value={field.state.value}
										onValueChange={field.handleChange}
										onBlur={field.handleBlur}
										className={cn(['w-full'])}
										rows={3}
									/>
								)}
							</editForm.Field>

							{/* Status Field */}
							<editForm.Field name="status">
								{(field) => (
									<Select
										label={status}
										selectedKeys={[field.state.value]}
										onSelectionChange={(keys) => {
											const selected = Array.from(keys)[0];
											if (selected) {
												field.handleChange(selected as TicketStatus);
											}
										}}
										color="primary"
										variant="bordered"
										className={cn(['w-full'])}
									>
										<SelectItem key="Open" textValue="Open">
											Open
										</SelectItem>
										<SelectItem key="In Progress" textValue="In Progress">
											In Progress
										</SelectItem>
										<SelectItem key="Done" textValue="Done">
											Done
										</SelectItem>
									</Select>
								)}
							</editForm.Field>

							{/* Difficulty Field */}
							<editForm.Field name="difficulty">
								{(field) => (
									<Select
										label={difficultyLabel}
										selectedKeys={[field.state.value]}
										onSelectionChange={(keys) => {
											const selected = Array.from(keys)[0];
											if (selected) {
												field.handleChange(selected as TicketDifficulty);
											}
										}}
										color="primary"
										variant="bordered"
										className={cn(['w-full'])}
									>
										<SelectItem key="S" textValue={difficultySmall.value}>
											{difficultySmall}
										</SelectItem>
										<SelectItem key="M" textValue={difficultyMedium.value}>
											{difficultyMedium}
										</SelectItem>
										<SelectItem key="L" textValue={difficultyLarge.value}>
											{difficultyLarge}
										</SelectItem>
									</Select>
								)}
							</editForm.Field>

							{/* Assignee Field */}
							<editForm.Field name="assigneeId">
								{(field) => (
									<Select
										label={assignTo}
										placeholder={selectUser.value}
										selectedKeys={field.state.value ? [field.state.value] : []}
										onSelectionChange={(keys) => {
											const selected = Array.from(keys)[0];
											field.handleChange(selected as string);
										}}
										color="primary"
										variant="bordered"
										className={cn(['w-full'])}
										isLoading={usersQuery.isLoading}
									>
										{(usersQuery.data || []).map((user) => (
											<SelectItem
												key={user.id}
												textValue={user.name || user.email}
											>
												{user.name || user.email}
											</SelectItem>
										))}
									</Select>
								)}
							</editForm.Field>

							{/* Tags Field */}
							<editForm.Field name="tags">
								{(field) => (
									<div className={cn(['flex flex-col gap-2 w-full'])}>
										<span
											className={cn(['font-medium text-foreground text-sm'])}
										>
											{tagsLabel}
										</span>
										<div className={cn(['flex gap-2'])}>
											<editForm.Field name="newTag">
												{(newField) => (
													<Input
														placeholder={tagPlaceholder.value}
														variant="bordered"
														name={newField.name}
														value={newField.state.value}
														onValueChange={newField.handleChange}
														onBlur={newField.handleBlur}
														className={cn(['flex-1'])}
													/>
												)}
											</editForm.Field>
											<Button
												isIconOnly
												color="primary"
												variant="flat"
												onPress={handleAddEditTag}
											>
												<PlusIcon size={18} />
											</Button>
										</div>
										{field.state.value && field.state.value.length > 0 && (
											<div className={cn(['mt-2 flex flex-wrap gap-2'])}>
												{field.state.value.map((tagValue, index) => (
													<IndexedChip
														key={`edit-tag-${tagValue}`}
														value={tagValue}
														index={index}
														color="secondary"
														onRemove={handleRemoveEditTag}
													/>
												))}
											</div>
										)}
									</div>
								)}
							</editForm.Field>

							{/* Acceptance Criteria Field */}
							<editForm.Field name="acceptanceCriteria">
								{(field) => (
									<div className={cn(['flex flex-col gap-2 w-full'])}>
										<span
											className={cn(['font-medium text-foreground text-sm'])}
										>
											{acceptanceCriteriaLabel}
										</span>
										<div className={cn(['flex gap-2'])}>
											<editForm.Field name="newAcceptanceCriteria">
												{(newField) => (
													<Input
														placeholder={acceptanceCriteriaPlaceholder.value}
														variant="bordered"
														name={newField.name}
														value={newField.state.value}
														onValueChange={newField.handleChange}
														onBlur={newField.handleBlur}
														className={cn(['flex-1'])}
													/>
												)}
											</editForm.Field>
											<Button
												isIconOnly
												color="primary"
												variant="flat"
												onPress={handleAddEditCriteria}
											>
												<PlusIcon size={18} />
											</Button>
										</div>
										{field.state.value && field.state.value.length > 0 && (
											<AcceptanceCriteriaList
												criteria={field.state.value}
												onRemove={handleRemoveEditCriteria}
											/>
										)}
									</div>
								)}
							</editForm.Field>
						</Form>
					</ModalBody>

					<ModalFooter className={cn(['gap-2'])}>
						<Button
							color="default"
							variant="light"
							onPress={editModal.onClose}
							isDisabled={updateTicketMutation.isLoading}
						>
							{cancel}
						</Button>
						<Button
							color="danger"
							startContent={<TrashIcon size={16} />}
							onPress={() => {
								editModal.onClose();
								if (selectedTicket) {
									handleDeleteTicket(selectedTicket);
								}
							}}
							isDisabled={updateTicketMutation.isLoading}
						>
							{deleteLabel}
						</Button>
						<editForm.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<Button
									color="primary"
									isDisabled={!canSubmit || isSubmitting}
									isLoading={isSubmitting}
									onPress={() => editForm.handleSubmit()}
								>
									{saveChanges}
								</Button>
							)}
						</editForm.Subscribe>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Delete Ticket Modal */}
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
					<ModalHeader>
						<span className={cn(['font-medium text-danger'])}>
							{deleteTicketTitle}
						</span>
					</ModalHeader>
					<ModalBody className={cn(['py-6'])}>
						<p className={cn(['text-foreground-500 text-small'])}>
							{deleteTicketConfirm}
						</p>
						{selectedTicket && (
							<div className={cn(['rounded-medium bg-default-50 p-4'])}>
								<p className={cn(['font-medium text-foreground text-small'])}>
									{selectedTicket.title}
								</p>
							</div>
						)}
					</ModalBody>
					<ModalFooter>
						<Button
							color="default"
							variant="light"
							onPress={deleteModal.onClose}
							isDisabled={deleteTicketMutation.isLoading}
							size="sm"
						>
							{cancel}
						</Button>
						<Button
							color="danger"
							onPress={handleConfirmDelete}
							isLoading={deleteTicketMutation.isLoading}
							size="sm"
						>
							{deleteLabel}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
});

BoardPage.displayName = 'BoardPage';

export default BoardPage;
