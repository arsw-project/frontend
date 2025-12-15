import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	cn,
	Progress,
	ScrollShadow,
} from '@heroui/react';
import {
	ArrowRightIcon,
	CalendarIcon,
	ChartBarIcon,
	CheckCircleIcon,
	ClockIcon,
	KanbanIcon,
	RocketIcon,
	SpinnerGapIcon,
	StackIcon,
	TrendUpIcon,
	UsersIcon,
	VideoCameraIcon,
} from '@phosphor-icons/react';
import { useLogoutMutation, useSession } from '@providers/session.provider';
import { LocaleSwitcher } from '@shared/components/locale-switcher/locale-switcher.component';
import { useUsers } from '@shared/hooks/get-users.hook';
import { useTickets } from '@shared/hooks/tickets/get-tickets.hook';
import type { TicketApi } from '@shared/hooks/tickets/ticket.types';
import { memo, useCallback, useMemo } from 'react';
import { useIntlayer } from 'react-intlayer';
import { useNavigate } from 'react-router';

export function meta() {
	return [
		{ title: 'ARSW Project - Dashboard' },
		{ name: 'description', content: 'Welcome to ARSW Project Dashboard' },
	];
}

const HomePage = memo(() => {
	const { session } = useSession();
	const logoutMutation = useLogoutMutation();
	const navigate = useNavigate();
	const { welcome, logout } = useIntlayer('index');

	const orgIdFromSession = session.data?.user?.membership?.organizationId ?? '';
	const currentUserId = session.data?.user?.id ?? '';

	const ticketsQuery = useTickets(orgIdFromSession);
	const usersQuery = useUsers();

	const handleLogout = useCallback(() => {
		logoutMutation.execute();
	}, [logoutMutation]);

	const handleNavigateToBoard = useCallback(() => {
		navigate('/board');
	}, [navigate]);

	const handleNavigateToUsers = useCallback(() => {
		navigate('/users');
	}, [navigate]);

	// Calculate statistics
	const statistics = useMemo(() => {
		const tickets = ticketsQuery.data || [];
		const total = tickets.length;

		const byStatus = {
			open: tickets.filter((t) => t.status === 'Open').length,
			inProgress: tickets.filter((t) => t.status === 'In Progress').length,
			done: tickets.filter((t) => t.status === 'Done').length,
		};

		const byDifficulty = {
			small: tickets.filter((t) => t.difficulty === 'S').length,
			medium: tickets.filter((t) => t.difficulty === 'M').length,
			large: tickets.filter((t) => t.difficulty === 'L').length,
		};

		const assignedToMe = tickets.filter((t) => t.assigneeId === currentUserId);
		const myActive = assignedToMe.filter((t) => t.status !== 'Done');
		const myCompleted = assignedToMe.filter((t) => t.status === 'Done');

		const completionRate =
			total > 0 ? Math.round((byStatus.done / total) * 100) : 0;
		const myCompletionRate =
			assignedToMe.length > 0
				? Math.round((myCompleted.length / assignedToMe.length) * 100)
				: 0;

		// Recent activity - last 5 updated tickets
		const recentTickets = [...tickets]
			.sort(
				(a, b) =>
					new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
			)
			.slice(0, 5);

		return {
			total,
			byStatus,
			byDifficulty,
			completionRate,
			myTickets: {
				total: assignedToMe.length,
				active: myActive.length,
				completed: myCompleted.length,
				completionRate: myCompletionRate,
			},
			recentTickets,
			totalUsers: usersQuery.data?.length || 0,
		};
	}, [ticketsQuery.data, usersQuery.data, currentUserId]);

	const getTicketStatusColor = (ticket: TicketApi) => {
		switch (ticket.status) {
			case 'Open':
				return 'default';
			case 'In Progress':
				return 'warning';
			case 'Done':
				return 'success';
			default:
				return 'default';
		}
	};

	const getDifficultyLabel = (difficulty: string) => {
		switch (difficulty) {
			case 'S':
				return 'Pequeña';
			case 'M':
				return 'Media';
			case 'L':
				return 'Grande';
			default:
				return difficulty;
		}
	};

	const formatRelativeTime = (date: string) => {
		const now = new Date();
		const past = new Date(date);
		const diffMs = now.getTime() - past.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Ahora mismo';
		if (diffMins < 60) return `Hace ${diffMins} min`;
		if (diffHours < 24) return `Hace ${diffHours}h`;
		if (diffDays < 7) return `Hace ${diffDays}d`;
		return past.toLocaleDateString();
	};

	return (
		<div className={cn(['flex h-full flex-col gap-6 p-4 sm:p-6 md:p-8'])}>
			{/* Header */}
			<div
				className={cn([
					'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4',
				])}
			>
				<div className={cn(['space-y-2'])}>
					<h1
						className={cn(['font-bold text-2xl sm:text-3xl text-foreground'])}
					>
						{welcome}, {session.data?.user?.name || 'User'}! 👋
					</h1>
					<p className={cn(['text-foreground-500 text-sm sm:text-base'])}>
						Aquí está un resumen de tu actividad y estadísticas del proyecto
					</p>
				</div>
				<div className={cn(['flex items-center gap-3'])}>
					<LocaleSwitcher />
					<Button
						color="danger"
						variant="flat"
						size="sm"
						onPress={handleLogout}
					>
						{logout}
					</Button>
				</div>
			</div>

			{/* Quick Stats Grid */}
			<div
				className={cn(['grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'])}
			>
				{/* Total Tickets */}
				<Card
					className={cn([
						'bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200',
					])}
				>
					<CardBody className={cn(['flex flex-row items-center gap-4 p-5'])}>
						<div className={cn(['rounded-full bg-primary-500/10 p-3'])}>
							<StackIcon
								size={24}
								weight="duotone"
								className={cn(['text-primary-600'])}
							/>
						</div>
						<div className={cn(['flex-1'])}>
							<p className={cn(['text-xs font-medium text-foreground-600'])}>
								Total Tickets
							</p>
							<p className={cn(['text-2xl font-bold text-primary'])}>
								{statistics.total}
							</p>
						</div>
					</CardBody>
				</Card>

				{/* Active Tickets */}
				<Card
					className={cn([
						'bg-gradient-to-br from-warning-50 to-warning-100 border border-warning-200',
					])}
				>
					<CardBody className={cn(['flex flex-row items-center gap-4 p-5'])}>
						<div className={cn(['rounded-full bg-warning-500/10 p-3'])}>
							<SpinnerGapIcon
								size={24}
								weight="duotone"
								className={cn(['text-warning-600'])}
							/>
						</div>
						<div className={cn(['flex-1'])}>
							<p className={cn(['text-xs font-medium text-foreground-600'])}>
								En Progreso
							</p>
							<p className={cn(['text-2xl font-bold text-warning'])}>
								{statistics.byStatus.inProgress}
							</p>
						</div>
					</CardBody>
				</Card>

				{/* Completed */}
				<Card
					className={cn([
						'bg-gradient-to-br from-success-50 to-success-100 border border-success-200',
					])}
				>
					<CardBody className={cn(['flex flex-row items-center gap-4 p-5'])}>
						<div className={cn(['rounded-full bg-success-500/10 p-3'])}>
							<CheckCircleIcon
								size={24}
								weight="duotone"
								className={cn(['text-success-600'])}
							/>
						</div>
						<div className={cn(['flex-1'])}>
							<p className={cn(['text-xs font-medium text-foreground-600'])}>
								Completados
							</p>
							<p className={cn(['text-2xl font-bold text-success'])}>
								{statistics.byStatus.done}
							</p>
						</div>
					</CardBody>
				</Card>

				{/* Team Members */}
				<Card
					className={cn([
						'bg-gradient-to-br from-secondary-50 to-secondary-100 border border-secondary-200',
					])}
				>
					<CardBody className={cn(['flex flex-row items-center gap-4 p-5'])}>
						<div className={cn(['rounded-full bg-secondary-500/10 p-3'])}>
							<UsersIcon
								size={24}
								weight="duotone"
								className={cn(['text-secondary-600'])}
							/>
						</div>
						<div className={cn(['flex-1'])}>
							<p className={cn(['text-xs font-medium text-foreground-600'])}>
								Miembros del Equipo
							</p>
							<p className={cn(['text-2xl font-bold text-secondary'])}>
								{statistics.totalUsers}
							</p>
						</div>
					</CardBody>
				</Card>
			</div>

			{/* Main Content Grid */}
			<div className={cn(['grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'])}>
				{/* Left Column - My Work & Progress */}
				<div className={cn(['lg:col-span-2 flex flex-col gap-4 sm:gap-6'])}>
					{/* My Tickets Card */}
					<Card className={cn(['border border-divider shadow-small'])}>
						<CardHeader
							className={cn(['flex items-center gap-3 px-5 sm:px-6 py-4'])}
						>
							<RocketIcon
								size={20}
								weight="duotone"
								className={cn(['text-primary'])}
							/>
							<h2 className={cn(['font-semibold text-lg text-foreground'])}>
								Mis Tickets
							</h2>
						</CardHeader>
						<CardBody className={cn(['px-5 sm:px-6 pb-6 space-y-4'])}>
							<div className={cn(['grid grid-cols-1 sm:grid-cols-3 gap-3'])}>
								<div className={cn(['rounded-lg bg-default-100 p-4'])}>
									<p
										className={cn(['text-xs text-foreground-600 font-medium'])}
									>
										Total
									</p>
									<p
										className={cn(['text-2xl font-bold text-foreground mt-1'])}
									>
										{statistics.myTickets.total}
									</p>
								</div>
								<div className={cn(['rounded-lg bg-warning-100 p-4'])}>
									<p
										className={cn(['text-xs text-foreground-600 font-medium'])}
									>
										Activos
									</p>
									<p className={cn(['text-2xl font-bold text-warning mt-1'])}>
										{statistics.myTickets.active}
									</p>
								</div>
								<div className={cn(['rounded-lg bg-success-100 p-4'])}>
									<p
										className={cn(['text-xs text-foreground-600 font-medium'])}
									>
										Completados
									</p>
									<p className={cn(['text-2xl font-bold text-success mt-1'])}>
										{statistics.myTickets.completed}
									</p>
								</div>
							</div>

							<div className={cn(['space-y-2'])}>
								<div className={cn(['flex items-center justify-between'])}>
									<p className={cn(['text-sm font-medium text-foreground'])}>
										Mi Tasa de Completación
									</p>
									<p className={cn(['text-sm font-bold text-primary'])}>
										{statistics.myTickets.completionRate}%
									</p>
								</div>
								<Progress
									value={statistics.myTickets.completionRate}
									color="primary"
									size="md"
									className={cn(['w-full'])}
								/>
							</div>
						</CardBody>
					</Card>

					{/* Overall Progress */}
					<Card className={cn(['border border-divider shadow-small'])}>
						<CardHeader
							className={cn(['flex items-center gap-3 px-5 sm:px-6 py-4'])}
						>
							<ChartBarIcon
								size={20}
								weight="duotone"
								className={cn(['text-primary'])}
							/>
							<h2 className={cn(['font-semibold text-lg text-foreground'])}>
								Progreso General del Proyecto
							</h2>
						</CardHeader>
						<CardBody className={cn(['px-5 sm:px-6 pb-6 space-y-4'])}>
							<div className={cn(['space-y-3'])}>
								<div className={cn(['space-y-2'])}>
									<div className={cn(['flex items-center justify-between'])}>
										<div className={cn(['flex items-center gap-2'])}>
											<div
												className={cn(['w-3 h-3 rounded-full bg-default-400'])}
											/>
											<span className={cn(['text-sm text-foreground'])}>
												Abiertos
											</span>
										</div>
										<span
											className={cn(['text-sm font-semibold text-foreground'])}
										>
											{statistics.byStatus.open}
										</span>
									</div>
									<Progress
										value={(statistics.byStatus.open / statistics.total) * 100}
										color="default"
										size="sm"
									/>
								</div>

								<div className={cn(['space-y-2'])}>
									<div className={cn(['flex items-center justify-between'])}>
										<div className={cn(['flex items-center gap-2'])}>
											<div
												className={cn(['w-3 h-3 rounded-full bg-warning'])}
											/>
											<span className={cn(['text-sm text-foreground'])}>
												En Progreso
											</span>
										</div>
										<span
											className={cn(['text-sm font-semibold text-foreground'])}
										>
											{statistics.byStatus.inProgress}
										</span>
									</div>
									<Progress
										value={
											(statistics.byStatus.inProgress / statistics.total) * 100
										}
										color="warning"
										size="sm"
									/>
								</div>

								<div className={cn(['space-y-2'])}>
									<div className={cn(['flex items-center justify-between'])}>
										<div className={cn(['flex items-center gap-2'])}>
											<div
												className={cn(['w-3 h-3 rounded-full bg-success'])}
											/>
											<span className={cn(['text-sm text-foreground'])}>
												Completados
											</span>
										</div>
										<span
											className={cn(['text-sm font-semibold text-foreground'])}
										>
											{statistics.byStatus.done}
										</span>
									</div>
									<Progress
										value={(statistics.byStatus.done / statistics.total) * 100}
										color="success"
										size="sm"
									/>
								</div>
							</div>

							<div
								className={cn([
									'rounded-lg bg-primary-50 p-4 border border-primary-200',
								])}
							>
								<div className={cn(['flex items-center gap-3'])}>
									<TrendUpIcon
										size={24}
										weight="duotone"
										className={cn(['text-primary'])}
									/>
									<div className={cn(['flex-1'])}>
										<p className={cn(['text-xs text-foreground-600'])}>
											Tasa de Completación Total
										</p>
										<p className={cn(['text-xl font-bold text-primary'])}>
											{statistics.completionRate}%
										</p>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>

				{/* Right Column - Quick Actions & Recent Activity */}
				<div className={cn(['flex flex-col gap-4 sm:gap-6'])}>
					{/* Quick Actions */}
					<Card className={cn(['border border-divider shadow-small'])}>
						<CardHeader className={cn(['px-5 sm:px-6 py-4'])}>
							<h2 className={cn(['font-semibold text-lg text-foreground'])}>
								Accesos Rápidos
							</h2>
						</CardHeader>
						<CardBody className={cn(['px-5 sm:px-6 pb-6 space-y-3'])}>
							<Button
								color="primary"
								variant="flat"
								className={cn(['w-full justify-between'])}
								endContent={<ArrowRightIcon size={16} />}
								onPress={handleNavigateToBoard}
							>
								<div className={cn(['flex items-center gap-2'])}>
									<KanbanIcon size={18} weight="duotone" />
									<span>Ver Tablero Kanban</span>
								</div>
							</Button>

							<Button
								color="secondary"
								variant="flat"
								className={cn(['w-full justify-between'])}
								endContent={<ArrowRightIcon size={16} />}
								onPress={handleNavigateToUsers}
							>
								<div className={cn(['flex items-center gap-2'])}>
									<UsersIcon size={18} weight="duotone" />
									<span>Gestionar Usuarios</span>
								</div>
							</Button>

							<Button
								color="default"
								variant="flat"
								className={cn(['w-full justify-between'])}
								endContent={<ArrowRightIcon size={16} />}
								isDisabled
							>
								<div className={cn(['flex items-center gap-2'])}>
									<VideoCameraIcon size={18} weight="duotone" />
									<span>Videollamadas Activas</span>
								</div>
							</Button>
						</CardBody>
					</Card>

					{/* Recent Activity */}
					<Card className={cn(['border border-divider shadow-small flex-1'])}>
						<CardHeader
							className={cn(['flex items-center gap-3 px-5 sm:px-6 py-4'])}
						>
							<ClockIcon
								size={20}
								weight="duotone"
								className={cn(['text-primary'])}
							/>
							<h2 className={cn(['font-semibold text-lg text-foreground'])}>
								Actividad Reciente
							</h2>
						</CardHeader>
						<CardBody className={cn(['px-0 pb-0'])}>
							<ScrollShadow className={cn(['h-[300px] px-5 sm:px-6'])}>
								{statistics.recentTickets.length > 0 ? (
									<div className={cn(['space-y-3 pb-6'])}>
										{statistics.recentTickets.map((ticket) => (
											<div
												key={ticket.id}
												className={cn([
													'p-3 rounded-lg border border-divider',
													'hover:bg-default-100 transition-colors cursor-pointer',
												])}
												onClick={() => navigate('/board')}
											>
												<div
													className={cn([
														'flex items-start justify-between gap-2',
													])}
												>
													<div className={cn(['flex-1 min-w-0'])}>
														<p
															className={cn([
																'text-sm font-medium text-foreground truncate',
															])}
														>
															{ticket.title}
														</p>
														<div
															className={cn(['flex items-center gap-2 mt-1'])}
														>
															<Chip
																size="sm"
																variant="flat"
																color={getTicketStatusColor(ticket)}
															>
																{ticket.status}
															</Chip>
															<Chip size="sm" variant="flat" color="default">
																{getDifficultyLabel(ticket.difficulty)}
															</Chip>
														</div>
													</div>
													<div
														className={cn([
															'flex items-center gap-1 text-xs text-foreground-500',
														])}
													>
														<CalendarIcon size={12} />
														<span>{formatRelativeTime(ticket.updatedAt)}</span>
													</div>
												</div>
											</div>
										))}
									</div>
								) : (
									<div
										className={cn([
											'flex flex-col items-center justify-center h-full py-8',
										])}
									>
										<div
											className={cn(['rounded-full bg-default-100 p-4 mb-3'])}
										>
											<StackIcon
												size={32}
												weight="duotone"
												className={cn(['text-default-400'])}
											/>
										</div>
										<p className={cn(['text-sm text-foreground-500'])}>
											No hay actividad reciente
										</p>
									</div>
								)}
							</ScrollShadow>
						</CardBody>
					</Card>
				</div>
			</div>
		</div>
	);
});

HomePage.displayName = 'HomePage';

export default HomePage;
