import { memo, type ReactNode } from 'react';
import { AppHeroUIProvider } from './heroui.provider';
import { AppQueryClientProvider } from './query-client.provider';
import { AppThemeProvider } from './theme.provider';

const AppProviders = memo(({ children }: { children: ReactNode }) => {
	return (
		<AppQueryClientProvider>
			<AppHeroUIProvider>
				<AppThemeProvider>{children}</AppThemeProvider>
			</AppHeroUIProvider>
		</AppQueryClientProvider>
	);
});

export { AppProviders };
