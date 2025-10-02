import { useSession } from '@providers/session.provider';
import { memo } from 'react';
import { Navigate, Outlet } from 'react-router';

const IndexLayout = memo(() => {
	const { session } = useSession();

	if (session.isLoading) {
		return <div>Loading...</div>;
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
