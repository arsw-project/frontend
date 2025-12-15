import { useLogoutMutation, useSession } from '@providers/session.provider';
import { Footer } from '@shared/components/footer';
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
		<main className="flex h-dvh w-dvw flex-col bg-background md:flex-row">
			<AnimatePresence>{session.isLoading && <AppLoading />}</AnimatePresence>
			{!session.isLoading && (
				<>
					<Sidebar
						userName={userName}
						userEmail={userEmail}
						onLogout={handleLogout}
					/>
					<div className="flex flex-1 flex-col overflow-auto pt-16 md:pt-0">
						<div className="flex-1">
							<Outlet />
						</div>
						<Footer />
					</div>
				</>
			)}
		</main>
	);
});

export default IndexLayout;
