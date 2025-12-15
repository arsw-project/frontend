import {
	Badge,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
	cn,
	Tooltip,
} from '@heroui/react';
import type { TicketDifficulty } from '@pages/board/board.validators';
import {
	CheckCircleIcon,
	ClockIcon,
	HashIcon,
	TagIcon,
	UserCircleIcon,
} from '@phosphor-icons/react';
import type { TicketApi } from '@shared/hooks/tickets/ticket.types';
import { dataAttr } from '@shared/utility/props';
import { memo, useMemo } from 'react';
import { useIntlayer } from 'react-intlayer';

type TicketCardProps = {
	ticket: TicketApi;
	onClick?: (ticket: TicketApi) => void;
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

export const TicketCard = memo<TicketCardProps>(({ ticket, onClick }) => {
	const content = useIntlayer('ticket-card');

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

	const handleClick = () => {
		onClick?.(ticket);
	};

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
			onPress={onClick ? handleClick : undefined}
			className={cn([
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
				<div className={cn(['flex items-start justify-between w-full gap-2'])}>
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
					<Badge
						color={difficultyColor}
						variant="flat"
						size="sm"
						className={cn(['shrink-0'])}
					>
						{difficultyLabel}
					</Badge>
				</div>

				<div className={cn(['flex items-center gap-2 flex-wrap'])}>
					<div
						className={cn([
							'flex items-center gap-1 text-foreground-500 text-tiny',
						])}
					>
						<HashIcon size={14} weight="bold" />
						<span className={cn(['font-mono'])}>{ticket.id.slice(0, 8)}</span>
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
							<p className={cn(['text-foreground-600 text-tiny line-clamp-2'])}>
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
				<div
					className={cn([
						'flex items-center gap-1.5 text-foreground-500 text-tiny',
					])}
				>
					<UserCircleIcon size={14} weight="duotone" />
					<span
						className={cn([
							ticket.assigneeId ? '' : 'italic text-foreground-400',
						])}
						data-assigned={dataAttr(!!ticket.assigneeId)}
					>
						{ticket.assigneeId ? content.assignedTo : content.unassigned}
					</span>
				</div>

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
			</CardFooter>
		</Card>
	);
});

TicketCard.displayName = 'TicketCard';
