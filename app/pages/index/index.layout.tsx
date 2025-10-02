import { useSession } from '@providers/session.provider';
import { AnimatePresence } from 'framer-motion';
import { memo } from 'react';
import { Navigate, Outlet } from 'react-router';
import { AppLoading } from './components/app-loading/app-loading.component';

const IndexLayout = memo(() => {
	const { session } = useSession();

	if (session.isError) {
		return <Navigate to="/auth/login" replace />;
	}

	return (
		<main className="grid h-dvh w-dvw place-items-center">
			<AnimatePresence>{session.isLoading && <AppLoading />}</AnimatePresence>
			{session.isLoading ? <AppLoading /> : <Outlet />}
		</main>
	);
});

export default IndexLayout;
