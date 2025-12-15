import {
	Avatar,
	Badge,
	Button,
	cn,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	ScrollShadow,
} from '@heroui/react';
import {
	AtIcon,
	BellIcon,
	ChatCircleTextIcon,
	CheckCircleIcon,
	ChecksIcon,
	KanbanIcon,
	UserPlusIcon,
	VideoIcon,
} from '@phosphor-icons/react';
import { memo, useCallback, useMemo, useState } from 'react';
import { useIntlayer } from 'react-intlayer';

export interface Notification {
	id: string;
	type:
		| 'ticket_assigned'
		| 'ticket_status'
		| 'ticket_comment'
		| 'video_call'
		| 'mention'
		| 'ticket_completed'
		| 'member_added';
	title: string;
	message: string;
	timestamp: Date;
	read: boolean;
	avatar?: string;
	userName: string;
	ticketId?: string;
	ticketTitle?: string;
}

interface NotificationsMenuProps {
	className?: string;
}

// Mock notifications - In production, these would come from an API or WebSocket
const mockNotifications: Notification[] = [
	{
		id: '1',
		type: 'ticket_assigned',
		title: 'New Ticket Assigned',
		message: 'assigned you a new ticket',
		timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
		read: false,
		userName: 'Sarah Johnson',
		ticketId: 'TICKET-123',
		ticketTitle: 'Fix login page bug',
	},
	{
		id: '2',
		type: 'video_call',
		title: 'Video Call Started',
		message: 'started a video call for',
		timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
		read: false,
		userName: 'Michael Chen',
		ticketId: 'TICKET-098',
		ticketTitle: 'Database migration discussion',
	},
	{
		id: '3',
		type: 'ticket_comment',
		title: 'New Comment',
		message: 'commented on ticket',
		timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
		read: false,
		userName: 'Emma Davis',
		ticketId: 'TICKET-087',
		ticketTitle: 'Update user interface',
	},
	{
		id: '4',
		type: 'mention',
		title: 'You were mentioned',
		message: 'mentioned you in',
		timestamp: new Date(Date.now() - 4 * 3600000), // 4 hours ago
		read: true,
		userName: 'Alex Rodriguez',
		ticketId: 'TICKET-076',
		ticketTitle: 'API documentation',
	},
	{
		id: '5',
		type: 'ticket_completed',
		title: 'Ticket Completed',
		message: 'marked ticket as completed',
		timestamp: new Date(Date.now() - 24 * 3600000), // 1 day ago
		read: true,
		userName: 'Lisa Wang',
		ticketId: 'TICKET-055',
		ticketTitle: 'Security audit',
	},
	{
		id: '6',
		type: 'member_added',
		title: 'New Team Member',
		message: 'added a new member to',
		timestamp: new Date(Date.now() - 2 * 24 * 3600000), // 2 days ago
		read: true,
		userName: 'David Kim',
		ticketTitle: 'Engineering Team',
	},
];

const getNotificationIcon = (type: Notification['type']) => {
	switch (type) {
		case 'ticket_assigned':
			return <KanbanIcon size={20} weight="duotone" className="text-primary" />;
		case 'ticket_status':
			return (
				<CheckCircleIcon size={20} weight="duotone" className="text-success" />
			);
		case 'ticket_comment':
			return (
				<ChatCircleTextIcon
					size={20}
					weight="duotone"
					className="text-warning"
				/>
			);
		case 'video_call':
			return <VideoIcon size={20} weight="duotone" className="text-danger" />;
		case 'mention':
			return <AtIcon size={20} weight="duotone" className="text-secondary" />;
		case 'ticket_completed':
			return <ChecksIcon size={20} weight="duotone" className="text-success" />;
		case 'member_added':
			return (
				<UserPlusIcon size={20} weight="duotone" className="text-primary" />
			);
		default:
			return <BellIcon size={20} weight="duotone" />;
	}
};

const getTimeAgo = (timestamp: Date, content: any): string => {
	const now = new Date();
	const diffMs = now.getTime() - timestamp.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return content.justNow;
	if (diffMins < 60) return `${diffMins} ${content.minutesAgo}`;
	if (diffHours < 24) return `${diffHours} ${content.hoursAgo}`;
	return `${diffDays} ${content.daysAgo}`;
};

export const NotificationsMenu = memo<NotificationsMenuProps>(
	({ className }) => {
		const content = useIntlayer('notifications_menu');
		const [notifications, setNotifications] =
			useState<Notification[]>(mockNotifications);

		const unreadCount = useMemo(
			() => notifications.filter((n) => !n.read).length,
			[notifications],
		);

		const handleMarkAllAsRead = useCallback(() => {
			setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
		}, []);

		const handleNotificationClick = useCallback((notificationId: string) => {
			setNotifications((prev) =>
				prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
			);
			// Here you would navigate to the ticket or relevant page
			console.log('Notification clicked:', notificationId);
		}, []);

		const getUserInitials = useCallback((name: string) => {
			return name
				.split(' ')
				.map((word) => word[0])
				.join('')
				.toUpperCase()
				.slice(0, 2);
		}, []);

		return (
			<Dropdown
				placement="bottom-end"
				className={cn(['max-w-[400px]', className])}
				classNames={{
					content: 'p-0',
				}}
			>
				<DropdownTrigger>
					<Button
						isIconOnly
						variant="light"
						radius="full"
						aria-label={content.title}
						className="relative"
					>
						<Badge
							content={unreadCount}
							color="danger"
							size="sm"
							isInvisible={unreadCount === 0}
							shape="circle"
							placement="top-right"
						>
							<BellIcon
								size={22}
								weight={unreadCount > 0 ? 'fill' : 'regular'}
								className={cn([
									'transition-colors',
									unreadCount > 0 ? 'text-primary' : 'text-foreground',
								])}
							/>
						</Badge>
					</Button>
				</DropdownTrigger>
				<DropdownMenu
					aria-label={content.title}
					variant="flat"
					closeOnSelect={false}
					className="p-0"
					classNames={{
						base: 'p-0 max-h-[500px]',
						list: 'p-0 max-h-[500px]',
					}}
				>
					<DropdownSection
						showDivider
						classNames={{
							base: 'p-0',
							heading: 'px-4 pt-3 pb-2',
						}}
					>
						{/* Header */}
						<DropdownItem
							key="header"
							isReadOnly
							hideSelectedIcon
							className="cursor-default opacity-100 hover:bg-transparent"
							classNames={{
								base: 'px-4 py-3',
							}}
						>
							<div className="flex items-center justify-between">
								<h3 className="font-semibold text-foreground text-lg">
									{content.title}
								</h3>
								{unreadCount > 0 && (
									<Button
										size="sm"
										variant="light"
										onPress={handleMarkAllAsRead}
										className="text-primary"
									>
										{content.markAllAsRead}
									</Button>
								)}
							</div>
						</DropdownItem>
					</DropdownSection>

					{/* Notifications List */}
					{notifications.length > 0 ? (
						<DropdownSection
							classNames={{
								base: 'p-0',
								group: 'p-0',
							}}
						>
							<DropdownItem
								key="notifications-list"
								isReadOnly
								hideSelectedIcon
								className="cursor-default p-0 opacity-100 hover:bg-transparent"
							>
								<ScrollShadow className="max-h-[350px] w-full">
									<div className="flex flex-col">
										{notifications.map((notification) => (
											<button
												key={notification.id}
												type="button"
												onClick={() => handleNotificationClick(notification.id)}
												className={cn([
													'flex w-full items-start gap-3 border-b border-divider px-4 py-3 text-left transition-colors',
													'hover:bg-default-100',
													!notification.read && 'bg-primary/5',
												])}
											>
												<Avatar
													size="sm"
													name={getUserInitials(notification.userName)}
													src={notification.avatar}
													showFallback
													className="shrink-0"
												/>
												<div className="flex min-w-0 flex-1 flex-col gap-1">
													<div className="flex items-start justify-between gap-2">
														<p
															className={cn([
																'text-small',
																!notification.read
																	? 'font-semibold text-foreground'
																	: 'font-medium text-foreground-600',
															])}
														>
															<span className="font-semibold">
																{notification.userName}
															</span>{' '}
															{notification.message}
														</p>
														{!notification.read && (
															<div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
														)}
													</div>
													{notification.ticketTitle && (
														<p className="truncate font-medium text-foreground text-tiny">
															{notification.ticketTitle}
														</p>
													)}
													<div className="flex items-center gap-2">
														{getNotificationIcon(notification.type)}
														<p className="text-foreground-400 text-tiny">
															{getTimeAgo(notification.timestamp, content)}
														</p>
													</div>
												</div>
											</button>
										))}
									</div>
								</ScrollShadow>
							</DropdownItem>
						</DropdownSection>
					) : (
						<DropdownSection
							classNames={{
								base: 'p-0',
							}}
						>
							<DropdownItem
								key="empty"
								isReadOnly
								hideSelectedIcon
								className="cursor-default opacity-100 hover:bg-transparent"
							>
								<div className="flex flex-col items-center gap-2 py-8">
									<BellIcon
										size={48}
										weight="light"
										className="text-foreground-300"
									/>
									<p className="font-medium text-foreground-600 text-small">
										{content.noNotifications}
									</p>
									<p className="text-foreground-400 text-tiny">
										{content.noNotificationsDescription}
									</p>
								</div>
							</DropdownItem>
						</DropdownSection>
					)}

					{/* Footer */}
					{notifications.length > 0 && (
						<DropdownSection
							classNames={{
								base: 'p-0',
							}}
						>
							<DropdownItem
								key="view-all"
								className="rounded-none py-3 text-center"
								classNames={{
									base: 'hover:bg-default-100',
								}}
							>
								<p className="font-medium text-primary text-small">
									{content.viewAll}
								</p>
							</DropdownItem>
						</DropdownSection>
					)}
				</DropdownMenu>
			</Dropdown>
		);
	},
);

NotificationsMenu.displayName = 'NotificationsMenu';
