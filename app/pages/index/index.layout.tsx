import { useSession } from '@providers/session.provider';
import { memo } from 'react';
import { Navigate, Outlet } from 'react-router';
import { AppLoading } from './components/app-loading/app-loading.component';

const IndexLayout = memo(() => {
	const { session } = useSession();

	if (session.isLoading) {
		return <AppLoading />;
	}

	if (session.isError) {
		return <Navigate to="/auth/login" replace />;
	}

	return (
		<main className="grid h-dvh w-dvw place-items-center">
			<Outlet />
		</main>
	);
});

export default IndexLayout;
