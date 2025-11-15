import { Button, cn } from '@heroui/react';
import { useLogoutMutation, useSession } from '@providers/session.provider';
import { LocaleSwitcher } from '@shared/components/locale-switcher/locale-switcher.component';
import { memo, useCallback } from 'react';
import { useIntlayer } from 'react-intlayer';

export function meta() {
	return [
		{ title: 'ARSW Project - Dashboard' },
		{ name: 'description', content: 'Welcome to ARSW Project Dashboard' },
	];
}

const HomePage = memo(() => {
	const { session } = useSession();
	const logoutMutation = useLogoutMutation();
	const { welcome, logout, sessionInfo, currentAccountData, yourSessionIn } =
		useIntlayer('index');

	const handleLogout = useCallback(() => {
		logoutMutation.execute();
	}, [logoutMutation]);

	return (
		<div className={cn(['flex h-full flex-col gap-6 p-6 md:p-8'])}>
			<div className={cn(['absolute top-6 right-6'])}>
				<LocaleSwitcher />
			</div>

			<div className={cn(['space-y-2'])}>
				<h1 className={cn(['font-bold text-3xl text-foreground'])}>
					{welcome}, {session.data?.user?.name || 'User'}
				</h1>
				<p className={cn(['text-foreground-500'])}>{yourSessionIn}</p>
			</div>

			<div
				className={cn([
					'flex flex-col gap-4 rounded-large bg-content1 p-6 text-content1-foreground shadow-small',
					'border border-divider',
				])}
			>
				<div className={cn(['space-y-2'])}>
					<h2 className={cn(['font-semibold text-xl'])}>{sessionInfo}</h2>
					<p className={cn(['text-foreground-500 text-small'])}>
						{currentAccountData}
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
					{logout}
				</Button>
			</div>
		</div>
	);
});

HomePage.displayName = 'HomePage';

export default HomePage;
