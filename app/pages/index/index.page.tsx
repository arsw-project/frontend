import { Button, cn } from '@heroui/react';
import { useLogoutMutation, useSession } from '@providers/session.provider';
import { memo, useCallback } from 'react';

export function meta() {
	return [
		{ title: 'ARSW Project - Dashboard' },
		{ name: 'description', content: 'Welcome to ARSW Project Dashboard' },
	];
}

const HomePage = memo(() => {
	const { session } = useSession();
	const logoutMutation = useLogoutMutation();

	const handleLogout = useCallback(() => {
		logoutMutation.execute();
	}, [logoutMutation]);

	return (
		<div className={cn(['flex h-full flex-col gap-6 p-6 md:p-8'])}>
			{/* Header */}
			<div className={cn(['space-y-2'])}>
				<h1 className={cn(['font-bold text-3xl text-foreground'])}>
					Welcome, {session.data?.user?.name || 'User'}
				</h1>
				<p className={cn(['text-foreground-500'])}>
					This is your session in ARSW Project
				</p>
			</div>

			{/* Main Content Card */}
			<div
				className={cn([
					'flex flex-col gap-4 rounded-large bg-content1 p-6 text-content1-foreground shadow-small',
					'border border-divider',
				])}
			>
				<div className={cn(['space-y-2'])}>
					<h2 className={cn(['font-semibold text-xl'])}>Session Information</h2>
					<p className={cn(['text-foreground-500 text-small'])}>
						Current account data:
					</p>
				</div>

				<pre
					className={cn([
						'overflow-auto rounded-medium bg-background p-4 text-small',
						'border border-divider font-mono',
					])}
				>
					{JSON.stringify(session.data?.user, null, 2)}
				</pre>

				<Button
					color="danger"
					variant="flat"
					className={cn(['w-fit'])}
					onPress={handleLogout}
				>
					Sign Out
				</Button>
			</div>
		</div>
	);
});

HomePage.displayName = 'HomePage';

export default HomePage;
