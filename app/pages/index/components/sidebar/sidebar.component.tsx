import {
	Avatar,
	Button,
	Card,
	CardBody,
	cn,
	Divider,
	Link,
} from '@heroui/react';
import {
	GearIcon,
	HouseIcon,
	KanbanIcon,
	PowerIcon,
	UsersIcon,
} from '@phosphor-icons/react';
import { ThemeSwitcher } from '@shared/components/theme-switcher/theme-switcher.component';
import { dataAttr } from '@shared/utility/props';
import { memo, useCallback, useMemo, useState } from 'react';
import { useIntlayer } from 'react-intlayer';

interface SidebarProps {
	userName: string;
	userEmail: string;
	userAvatar?: string;
	onLogout: () => void;
}

const SidebarNavItem = ({
	id,
	href,
	icon,
	label,
	isActive,
	onClick,
}: {
	id: string;
	href: string;
	icon: React.ReactNode;
	label: React.ReactNode;
	isActive: boolean;
	onClick: (id: string) => void;
}) => (
	<Link
		data-active={dataAttr(isActive)}
		href={href}
		className={cn([
			'flex items-center gap-3 rounded-medium px-4 py-2',
			'text-foreground no-underline transition-all duration-200',
			'hover:bg-default-100 data-active:bg-primary data-active:text-primary-foreground',
			'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
		])}
		onPress={() => onClick(id)}
	>
		<span className={cn(['shrink-0 text-lg'])}>{icon}</span>
		<span className={cn(['font-medium text-small'])}>{label}</span>
	</Link>
);

export const Sidebar = memo(function Sidebar({
	userName,
	userEmail,
	userAvatar,
	onLogout,
}: SidebarProps) {
	const [activeItem, setActiveItem] = useState<string>('dashboard');
	const { dashboard, members, board, settings, signOut } =
		useIntlayer('sidebar');

	const handleItemClick = useCallback((itemId: string) => {
		setActiveItem(itemId);
	}, []);

	const handleLogout = useCallback(() => {
		if (onLogout) {
			onLogout();
		}
	}, [onLogout]);

	const userInitials = useMemo(() => {
		return userName
			.split(' ')
			.map((word) => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}, [userName]);

	return (
		<aside
			className={cn([
				'flex h-dvh w-64 flex-col gap-4 border-divider border-r bg-content1 p-4',
				'transition-all duration-300',
			])}
		>
			<Card className={cn(['transition-all duration-200 hover:shadow-medium'])}>
				<CardBody className={cn(['flex-row items-center gap-3 px-4 py-3'])}>
					<Avatar
						isBordered
						color="primary"
						name={userInitials}
						radius="lg"
						size="md"
						src={userAvatar}
						showFallback
					/>
					<div className={cn(['flex min-w-0 flex-1 flex-col'])}>
						<p
							className={cn([
								'truncate font-semibold text-foreground text-small',
							])}
						>
							{userName}
						</p>
						<p className={cn(['truncate text-foreground-500 text-tiny'])}>
							{userEmail}
						</p>
					</div>
				</CardBody>
			</Card>

			<Divider className={cn(['my-1'])} />

			<nav className={cn(['flex flex-1 flex-col gap-2'])}>
				{(() => {
					const labelMap = { dashboard, members, board, settings };
					return (
						<>
							<SidebarNavItem
								id="dashboard"
								href="/"
								icon={<HouseIcon size={20} weight="fill" />}
								label={labelMap.dashboard}
								isActive={activeItem === 'dashboard'}
								onClick={handleItemClick}
							/>
							<SidebarNavItem
								id="members"
								href="/members"
								icon={<UsersIcon size={20} weight="fill" />}
								label={labelMap.members}
								isActive={activeItem === 'members'}
								onClick={handleItemClick}
							/>
							<SidebarNavItem
								id="board"
								href="/board"
								icon={<KanbanIcon size={20} weight="fill" />}
								label={labelMap.board}
								isActive={activeItem === 'board'}
								onClick={handleItemClick}
							/>
							<Divider />
							<SidebarNavItem
								id="settings"
								href="/settings"
								icon={<GearIcon size={20} weight="fill" />}
								label={labelMap.settings}
								isActive={activeItem === 'settings'}
								onClick={handleItemClick}
							/>
						</>
					);
				})()}
			</nav>

			<Divider className={cn(['my-1'])} />

			<ThemeSwitcher />

			<Divider className={cn(['my-1'])} />

			<Button
				fullWidth
				color="danger"
				variant="flat"
				startContent={<PowerIcon size={18} weight="fill" />}
				className={cn(['transition-all duration-200'])}
				onPress={handleLogout}
			>
				{signOut}
			</Button>
		</aside>
	);
});
