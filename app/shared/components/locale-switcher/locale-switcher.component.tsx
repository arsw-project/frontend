import { Button, cn } from '@heroui/react';
import { getLocaleName, getLocalizedUrl, getPathWithoutLocale } from 'intlayer';
import { memo, useCallback } from 'react';
import { setLocaleInStorage, useLocale } from 'react-intlayer';
import { useLocation } from 'react-router';

const LocaleSwitcher = memo(() => {
	const { locale: currentLocale, availableLocales } = useLocale();
	const { pathname } = useLocation();

	const pathWithoutLocale = getPathWithoutLocale(pathname);

	const handleLocaleChange = useCallback(
		(newLocale: string) => {
			setLocaleInStorage(newLocale);
			const localizedPath = getLocalizedUrl(pathWithoutLocale, newLocale);
			window.location.href = localizedPath;
		},
		[pathWithoutLocale],
	);

	return (
		<div className={cn(['flex gap-2'])}>
			{availableLocales.map((localeItem) => (
				<Button
					key={localeItem}
					size="sm"
					variant={currentLocale === localeItem ? 'solid' : 'bordered'}
					color={currentLocale === localeItem ? 'primary' : 'default'}
					onPress={() => handleLocaleChange(localeItem)}
					aria-current={currentLocale === localeItem ? 'page' : undefined}
					aria-label={`Switch to ${getLocaleName(localeItem, currentLocale)}`}
					title={getLocaleName(localeItem)}
				>
					{localeItem.toUpperCase()}
				</Button>
			))}
		</div>
	);
});

LocaleSwitcher.displayName = 'LocaleSwitcher';

export { LocaleSwitcher };
