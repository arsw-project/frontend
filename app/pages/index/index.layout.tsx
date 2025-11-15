import { useLogoutMutation, useSession } from '@providers/session.provider';
import { AnimatePresence } from 'framer-motion';
import { memo, useCallback } from 'react';
import { Navigate, Outlet } from 'react-router';
import { AppLoading } from './components/app-loading/app-loading.component';
import { Sidebar } from './components/sidebar/sidebar.component';

const IndexLayout = memo(() => {
	const { session } = useSession();
	const logoutMutation = useLogoutMutation();

	const handleLogout = useCallback(() => {
		logoutMutation.execute();
	}, [logoutMutation]);

	if (session.isError) {
		return <Navigate to="/auth/login" replace />;
	}

	if (!session.data) {
		return null;
	}

	const userEmail = session.data.user.email;
	const userName = session.data.user.name;

	return (
		<main className="flex h-dvh w-dvw bg-background">
			<AnimatePresence>{session.isLoading && <AppLoading />}</AnimatePresence>
			{!session.isLoading && (
				<>
					<Sidebar
						userName={userName}
						userEmail={userEmail}
						onLogout={handleLogout}
					/>
					<div className="flex-1 overflow-auto">
						<Outlet />
					</div>
				</>
			)}
		</main>
	);
});

export default IndexLayout;
