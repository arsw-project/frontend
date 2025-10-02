import { Button } from '@heroui/react';
import { useLogoutMutation, useSession } from '@providers/session.provider';
import { memo, useCallback } from 'react';

export function meta() {
	return [
		{ title: 'New React Router App' },
		{ name: 'description', content: 'Welcome to React Router!' },
	];
}

const HomePage = memo(() => {
	const { session } = useSession();
	const logoutMutation = useLogoutMutation();

	const handleLogout = useCallback(() => {
		logoutMutation.execute();
	}, [logoutMutation]);

	return (
		<div className="flex flex-col gap-4 rounded-large bg-content1 p-4 text-content1-foreground shadow-small">
			<h1 className="text-center font-bold text-large">
				ARSW Project - Frontend
			</h1>
			<pre>{JSON.stringify(session.data, null, 2)}</pre>
			<Button onPress={handleLogout}>Logout</Button>
		</div>
	);
});

export default HomePage;
