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
	ListIcon,
	PowerIcon,
	UsersIcon,
	XIcon,
} from '@phosphor-icons/react';
import { ThemeSwitcher } from '@shared/components/theme-switcher/theme-switcher.component';
import { useMediaQuery } from '@shared/hooks/media-query.hook';
import { dataAttr } from '@shared/utility/props';
import { motion } from 'framer-motion';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useIntlayer } from 'react-intlayer';
import { useLocation } from 'react-router';

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
	onNavigate,
}: {
	id: string;
	href: string;
	icon: React.ReactNode;
	label: React.ReactNode;
	isActive: boolean;
	onClick: (id: string) => void;
	onNavigate?: () => void;
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
		onPress={() => {
			onClick(id);
			onNavigate?.();
		}}
	>
		<span className={cn(['shrink-0 text-lg'])}>{icon}</span>
		<span className={cn(['font-medium text-small'])}>{label}</span>
	</Link>
);

const SidebarContent = memo(function SidebarContent({
	userName,
	userEmail,
	userAvatar,
	onLogout,
	activeItem,
	onItemClick,
	onNavigate,
}: {
	userName: string;
	userEmail: string;
	userAvatar?: string;
	onLogout: () => void;
	activeItem: string;
	onItemClick: (id: string) => void;
	onNavigate?: () => void;
}) {
	const { dashboard, members, board, settings, signOut } =
		useIntlayer('sidebar');

	const handleLogout = useCallback(() => {
		onNavigate?.();
		onLogout();
	}, [onLogout, onNavigate]);

	const userInitials = useMemo(() => {
		return userName
			.split(' ')
			.map((word) => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}, [userName]);

	return (
		<>
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
								onClick={onItemClick}
								onNavigate={onNavigate}
							/>
							<SidebarNavItem
								id="members"
								href="/members"
								icon={<UsersIcon size={20} weight="fill" />}
								label={labelMap.members}
								isActive={activeItem === 'members'}
								onClick={onItemClick}
								onNavigate={onNavigate}
							/>
							<SidebarNavItem
								id="board"
								href="/board"
								icon={<KanbanIcon size={20} weight="fill" />}
								label={labelMap.board}
								isActive={activeItem === 'board'}
								onClick={onItemClick}
								onNavigate={onNavigate}
							/>
							<Divider />
							<SidebarNavItem
								id="settings"
								href="/settings"
								icon={<GearIcon size={20} weight="fill" />}
								label={labelMap.settings}
								isActive={activeItem === 'settings'}
								onClick={onItemClick}
								onNavigate={onNavigate}
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
		</>
	);
});

export const Sidebar = memo(function Sidebar({
	userName,
	userEmail,
	userAvatar,
	onLogout,
}: SidebarProps) {
	const [activeItem, setActiveItem] = useState<string>('dashboard');
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
	const isDesktop = useMediaQuery(768);
	const { menu, app } = useIntlayer('sidebar');
	const location = useLocation();

	// Sincronizar activeItem con la ruta actual
	useEffect(() => {
		const pathname = location.pathname;

		if (pathname.includes('/members')) {
			setActiveItem('members');
		} else if (pathname.includes('/board')) {
			setActiveItem('board');
		} else if (pathname.includes('/settings')) {
			setActiveItem('settings');
		} else {
			setActiveItem('dashboard');
		}
	}, [location.pathname]);

	const handleItemClick = useCallback((itemId: string) => {
		setActiveItem(itemId);
	}, []);

	const closeMobileMenu = useCallback(() => {
		setIsMobileMenuOpen(false);
	}, []);

	const toggleMobileMenu = useCallback(() => {
		setIsMobileMenuOpen((prev) => !prev);
	}, []);

	// Desktop sidebar - siempre visible
	if (isDesktop) {
		return (
			<aside
				className={cn([
					'hidden h-dvh w-64 flex-col gap-4 border-divider border-r bg-content1 p-4 md:flex',
					'transition-all duration-300',
				])}
			>
				<SidebarContent
					userName={userName}
					userEmail={userEmail}
					userAvatar={userAvatar}
					onLogout={onLogout}
					activeItem={activeItem}
					onItemClick={handleItemClick}
				/>
			</aside>
		);
	}

	// Mobile sidebar - drawer con animación
	return (
		<>
			{isMobileMenuOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className={cn([
						'fixed inset-0 z-40 bg-black/50 md:hidden',
						'touch-none',
					])}
					onClick={closeMobileMenu}
					onTap={closeMobileMenu}
				/>
			)}

			<motion.aside
				initial={false}
				animate={isMobileMenuOpen ? 'open' : 'closed'}
				variants={{
					open: {
						x: 0,
						opacity: 1,
						transition: {
							type: 'spring',
							stiffness: 300,
							damping: 30,
							duration: 0.3,
						},
					},
					closed: {
						x: '-100%',
						opacity: 0,
						transition: {
							type: 'spring',
							stiffness: 300,
							damping: 30,
							duration: 0.3,
						},
					},
				}}
				drag="x"
				dragElastic={0.2}
				dragConstraints={{ left: -256, right: 0 }}
				onDragEnd={(_event, info) => {
					// Cerrar si arrastra a la izquierda lo suficiente
					if (info.offset.x < -100 || info.velocity.x < -500) {
						closeMobileMenu();
					}
				}}
				className={cn([
					'fixed inset-y-0 left-0 z-50 w-64 flex-col gap-4 border-divider border-r bg-content1 p-4',
					'flex touch-none md:hidden',
					'will-change-transform',
				])}
			>
				<div className={cn(['flex items-center justify-between'])}>
					<h2 className={cn(['font-semibold text-foreground text-large'])}>
						{menu}
					</h2>
					<Button
						isIconOnly
						variant="light"
						size="sm"
						onPress={closeMobileMenu}
						className={cn(['transition-all duration-200'])}
					>
						<XIcon size={24} weight="bold" />
					</Button>
				</div>

				<SidebarContent
					userName={userName}
					userEmail={userEmail}
					userAvatar={userAvatar}
					onLogout={onLogout}
					activeItem={activeItem}
					onItemClick={handleItemClick}
					onNavigate={closeMobileMenu}
				/>
			</motion.aside>

			<div className={cn(['fixed top-0 right-0 left-0 z-30 md:hidden'])}>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className={cn([
						'flex items-center justify-between border-divider border-b bg-content1 px-4 py-3',
					])}
				>
					<Button
						isIconOnly
						variant="light"
						size="sm"
						onPress={toggleMobileMenu}
						className={cn(['transition-all duration-200'])}
					>
						<motion.div
							animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
							transition={{ duration: 0.2 }}
						>
							<ListIcon size={24} />
						</motion.div>
					</Button>
					<h1 className={cn(['font-semibold text-foreground text-large'])}>
						{app}
					</h1>
					<div className={cn(['w-10'])} />
				</motion.div>
			</div>
		</>
	);
});
