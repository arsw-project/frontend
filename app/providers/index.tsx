import { memo, type ReactNode } from 'react';
import { AppHeroUIProvider } from './heroui.provider';
import { AppQueryClientProvider } from './query-client.provider';
import { AppSessionProvider } from './session.provider';
import { AppThemeProvider } from './theme.provider';

const AppProviders = memo(({ children }: { children: ReactNode }) => {
	return (
		<AppQueryClientProvider>
			<AppSessionProvider>
				<AppHeroUIProvider>
					<AppThemeProvider>{children}</AppThemeProvider>
				</AppHeroUIProvider>
			</AppSessionProvider>
		</AppQueryClientProvider>
	);
});

export { AppProviders };
