import { memo, type ReactNode } from 'react';
import { IntlayerProvider } from 'react-intlayer';
import { AppHeroUIProvider } from './heroui.provider';
import { AppQueryClientProvider } from './query-client.provider';
import { AppSessionProvider } from './session.provider';
import { AppThemeProvider } from './theme.provider';

const AppProviders = memo(
	({ children, locale }: { children: ReactNode; locale?: string }) => {
		return (
			<IntlayerProvider locale={locale}>
				<AppQueryClientProvider>
					<AppSessionProvider>
						<AppHeroUIProvider>
							<AppThemeProvider>{children}</AppThemeProvider>
						</AppHeroUIProvider>
					</AppSessionProvider>
				</AppQueryClientProvider>
			</IntlayerProvider>
		);
	},
);

export { AppProviders };
