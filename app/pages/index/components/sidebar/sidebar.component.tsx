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
	BellIcon,
	GearIcon,
	HouseIcon,
	PowerIcon,
} from '@phosphor-icons/react';
import { ThemeSwitcher } from '@shared/components/theme-switcher/theme-switcher.component';
import { dataAttr } from '@shared/utility/props';
import { memo, useCallback, useMemo, useState } from 'react';

interface SidebarItem {
	id: string;
	label: string;
	icon: React.ReactNode;
	href: string;
}

interface SidebarProps {
	userName: string;
	userEmail: string;
	userAvatar?: string;
	onLogout: () => void;
}

const sidebarItems: SidebarItem[] = [
	{
		id: 'home',
		label: 'Home',
		icon: <HouseIcon size={20} weight="fill" />,
		href: '/',
	},
	{
		id: 'notifications',
		label: 'Notifications',
		icon: <BellIcon size={20} weight="fill" />,
		href: '/notifications',
	},
	{
		id: 'settings',
		label: 'Settings',
		icon: <GearIcon size={20} weight="fill" />,
		href: '/settings',
	},
];

export const Sidebar = memo(function Sidebar({
	userName,
	userEmail,
	userAvatar,
	onLogout,
}: SidebarProps) {
	const [activeItem, setActiveItem] = useState<string>('home');

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
				{sidebarItems.map((item) => {
					const isActive = activeItem === item.id;
					return (
						<Link
							key={item.id}
							data-active={dataAttr(isActive)}
							href={item.href}
							className={cn([
								'flex items-center gap-3 rounded-medium px-4 py-2',
								'text-foreground no-underline transition-all duration-200',
								'hover:bg-default-100 data-active:bg-primary data-active:text-primary-foreground',
								'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
							])}
							onPress={() => handleItemClick(item.id)}
						>
							<span className={cn(['flex-shrink-0 text-lg'])}>{item.icon}</span>
							<span className={cn(['font-medium text-small'])}>
								{item.label}
							</span>
						</Link>
					);
				})}
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
				Sign Out
			</Button>
		</aside>
	);
});
