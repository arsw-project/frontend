import { memo, type ReactNode } from 'react';
import { AppHeroUIProvider } from './heroui.provider';
import { AppThemeProvider } from './theme.provider';

const AppProviders = memo(({ children }: { children: ReactNode }) => {
	return (
		<AppHeroUIProvider>
			<AppThemeProvider>{children}</AppThemeProvider>
		</AppHeroUIProvider>
	);
});

export { AppProviders };
