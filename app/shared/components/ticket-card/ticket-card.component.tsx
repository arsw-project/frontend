import {
	Avatar,
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
	cn,
	Tooltip,
} from '@heroui/react';
import type { TicketDifficulty } from '@pages/board/board.validators';
import type { UserApi } from '@pages/users/users.validators';
import {
	CheckCircleIcon,
	ClockIcon,
	FlagIcon,
	HashIcon,
	TagIcon,
	UserCircleIcon,
	VideoCameraIcon,
} from '@phosphor-icons/react';
import type { TicketApi } from '@shared/hooks/tickets/ticket.types';
import { memo, useCallback, useMemo } from 'react';
import { useIntlayer } from 'react-intlayer';

type TicketCardProps = {
	ticket: TicketApi;
	onClick?: (ticket: TicketApi) => void;
	onOpenMeetingRoom?: (ticket: TicketApi) => void;
	users?: UserApi[];
};

const getDifficultyColor = (
	difficulty: TicketDifficulty,
): 'success' | 'warning' | 'danger' => {
	switch (difficulty) {
		case 'S':
			return 'success';
		case 'M':
			return 'warning';
		case 'L':
			return 'danger';
		default:
			return 'warning';
	}
};

export const TicketCard = memo<TicketCardProps>(
	({ ticket, onClick, onOpenMeetingRoom, users = [] }) => {
		const content = useIntlayer('ticket-card');

		const openMeetingRoomAriaLabel = useMemo(() => {
			const label = content.openMeetingRoom;
			if (typeof label === 'string') return label;
			if (label && typeof label === 'object' && 'value' in label) {
				const maybeValue = (label as { value?: unknown }).value;
				if (typeof maybeValue === 'string') return maybeValue;
			}
			return 'Open meeting room';
		}, [content.openMeetingRoom]);

		const difficultyLabel = useMemo(() => {
			switch (ticket.difficulty) {
				case 'S':
					return content.difficultySmall;
				case 'M':
					return content.difficultyMedium;
				case 'L':
					return content.difficultyLarge;
				default:
					return content.difficultyMedium;
			}
		}, [ticket.difficulty, content]);

		const difficultyColor = useMemo(
			() => getDifficultyColor(ticket.difficulty),
			[ticket.difficulty],
		);

		const assigneeName = useMemo(() => {
			if (!ticket.assigneeId) return null;
			const assignee = users.find((user) => user.id === ticket.assigneeId);
			return assignee?.name || assignee?.email || null;
		}, [ticket.assigneeId, users]);
		const assignee = useMemo(() => {
			if (!ticket.assigneeId) return null;
			return users.find((user) => user.id === ticket.assigneeId);
		}, [ticket.assigneeId, users]);

		const getUserInitials = useCallback((name: string) => {
			return name
				.split(' ')
				.map((word) => word[0])
				.join('')
				.toUpperCase()
				.slice(0, 2);
		}, []);

		const priorityConfig = useMemo(() => {
			const priority = ticket.difficulty;
			switch (priority) {
				case 'L':
					return {
						color: 'danger' as const,
						icon: <FlagIcon size={14} weight="fill" className="text-danger" />,
						label: content.priorityHigh,
					};
				case 'M':
					return {
						color: 'warning' as const,
						icon: <FlagIcon size={14} weight="fill" className="text-warning" />,
						label: content.priorityMedium,
					};
				case 'S':
					return {
						color: 'success' as const,
						icon: <FlagIcon size={14} weight="fill" className="text-success" />,
						label: content.priorityLow,
					};
				default:
					return {
						color: 'default' as const,
						icon: <FlagIcon size={14} weight="regular" />,
						label: content.priorityMedium,
					};
			}
		}, [ticket.difficulty, content]);
		const handleCardPress = useCallback(() => {
			onClick?.(ticket);
		}, [onClick, ticket]);

		const handleMeetingRoomPress = useCallback(() => {
			onOpenMeetingRoom?.(ticket);
		}, [onOpenMeetingRoom, ticket]);

		const formattedDate = useMemo(() => {
			const date = new Date(ticket.updatedAt);
			const now = new Date();
			const diffInMs = now.getTime() - date.getTime();
			const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
			const diffInDays = Math.floor(diffInHours / 24);

			if (diffInHours < 24) {
				return `${diffInHours}h ago`;
			}
			if (diffInDays < 7) {
				return `${diffInDays}d ago`;
			}
			return date.toLocaleDateString(undefined, {
				month: 'short',
				day: 'numeric',
			});
		}, [ticket.updatedAt]);

		return (
			<Card
				isPressable={!!onClick}
				onPress={onClick ? handleCardPress : undefined}
				className={cn([
					'group',
					'w-full',
					'bg-content1 border border-divider',
					'transition-all duration-200',
					'hover:shadow-medium hover:border-primary-200',
					onClick && 'cursor-pointer',
				])}
				data-ticket-id={ticket.id}
			>
				<CardHeader
					className={cn(['flex flex-col items-start gap-2 pb-2 px-4 pt-4'])}
				>
					<div
						className={cn(['flex items-start justify-between w-full gap-2'])}
					>
						<Tooltip content={ticket.title} delay={500}>
							<h4
								className={cn([
									'font-semibold text-foreground text-small',
									'line-clamp-2 flex-1',
								])}
							>
								{ticket.title}
							</h4>
						</Tooltip>
						<div className="flex items-center gap-2">
							<Tooltip content={priorityConfig.label} delay={300}>
								<div className="flex items-center">{priorityConfig.icon}</div>
							</Tooltip>
							<Chip
								color={difficultyColor}
								variant="flat"
								size="sm"
								className={cn(['shrink-0'])}
							>
								{difficultyLabel}
							</Chip>
						</div>
					</div>

					{/* Ticket ID and Timestamp */}
					<div className={cn(['flex items-center gap-2 flex-wrap'])}>
						<div
							className={cn([
								'flex items-center gap-1 text-foreground-500 text-tiny',
							])}
						>
							<HashIcon size={14} weight="regular" />
							<span>{ticket.id.slice(0, 8)}</span>
						</div>

						<div
							className={cn([
								'flex items-center gap-1 text-foreground-500 text-tiny',
							])}
						>
							<ClockIcon size={14} weight="regular" />
							<span>{formattedDate}</span>
						</div>
					</div>
				</CardHeader>

				<CardBody className={cn(['px-4 py-3 gap-3'])}>
					{/* Description */}
					<p
						className={cn([
							'text-foreground-600 text-tiny',
							'line-clamp-3',
							'leading-relaxed',
						])}
					>
						{ticket.description}
					</p>

					{/* Acceptance Criteria Preview */}
					{ticket.acceptanceCriteria.length > 0 && (
						<div className={cn(['flex items-start gap-2'])}>
							<CheckCircleIcon
								size={14}
								weight="duotone"
								className={cn(['text-success-500 mt-0.5 shrink-0'])}
							/>
							<div className={cn(['flex flex-col gap-1 flex-1 min-w-0'])}>
								<span
									className={cn(['text-foreground-500 text-tiny font-medium'])}
								>
									{content.acceptanceCriteria}:
								</span>
								<p
									className={cn(['text-foreground-600 text-tiny line-clamp-2'])}
								>
									{ticket.acceptanceCriteria[0]}
								</p>
								{ticket.acceptanceCriteria.length > 1 && (
									<span className={cn(['text-foreground-400 text-tiny'])}>
										+{ticket.acceptanceCriteria.length - 1} more
									</span>
								)}
							</div>
						</div>
					)}

					{/* Tags */}
					{ticket.tags.length > 0 && (
						<div className={cn(['flex items-center gap-2 flex-wrap'])}>
							<TagIcon
								size={14}
								weight="duotone"
								className={cn(['text-primary-500'])}
							/>
							<div className={cn(['flex gap-1.5 flex-wrap'])}>
								{ticket.tags.slice(0, 3).map((tag, index) => (
									<Chip
										key={`${ticket.id}-tag-${index}`}
										size="sm"
										variant="flat"
										color="primary"
										className={cn(['text-tiny'])}
									>
										{tag}
									</Chip>
								))}
								{ticket.tags.length > 3 && (
									<Chip
										size="sm"
										variant="flat"
										color="default"
										className={cn(['text-tiny'])}
									>
										+{ticket.tags.length - 3}
									</Chip>
								)}
							</div>
						</div>
					)}
				</CardBody>

				<CardFooter
					className={cn([
						'px-4 py-3 pt-2',
						'border-t border-divider',
						'flex items-center justify-between',
					])}
				>
					{assignee ? (
						<Tooltip content={assignee.email} delay={300}>
							<div className={cn(['flex items-center gap-2'])}>
								<Avatar
									size="sm"
									name={getUserInitials(assignee.name || assignee.email)}
									className="h-6 w-6 text-tiny"
									showFallback
								/>
								<span
									className={cn(['text-foreground-600 text-tiny font-medium'])}
								>
									{assignee.name || assignee.email}
								</span>
							</div>
						</Tooltip>
					) : (
						<div
							className={cn([
								'flex items-center gap-2 text-foreground-400 italic',
							])}
						>
							<UserCircleIcon size={16} weight="duotone" />
							<span className={cn(['text-tiny'])}>{content.unassigned}</span>
						</div>
					)}

					<div className={cn(['flex items-center gap-2'])}>
						{onOpenMeetingRoom && (
							<Tooltip content={content.openMeetingRoom} delay={500}>
								<Button
									isIconOnly
									size="sm"
									color="primary"
									variant="flat"
									onPress={handleMeetingRoomPress}
									aria-label={openMeetingRoomAriaLabel}
								>
									<VideoCameraIcon size={18} weight="duotone" />
								</Button>
							</Tooltip>
						)}

						{onClick && (
							<span
								className={cn([
									'text-primary text-tiny font-medium',
									'opacity-0 group-hover:opacity-100',
									'transition-opacity duration-200',
								])}
							>
								{content.viewDetails}
							</span>
						)}
					</div>
				</CardFooter>
			</Card>
		);
	},
);

TicketCard.displayName = 'TicketCard';
