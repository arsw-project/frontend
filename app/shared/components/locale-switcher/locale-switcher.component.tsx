import {
	Button,
	cn,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@heroui/react';
import { CheckIcon } from '@phosphor-icons/react';
import { getLocalizedUrl, getPathWithoutLocale } from 'intlayer';
import { memo, useCallback } from 'react';
import { useLocale } from 'react-intlayer';
import { useLocation, useNavigate } from 'react-router';

// Mapping of language codes to flag emojis
const LOCALE_FLAGS: Record<string, string> = {
	en: '🇺🇸',
	es: '🇪🇸',
	fr: '🇫🇷',
	de: '🇩🇪',
	it: '🇮🇹',
	pt: '🇵🇹',
	ru: '🇷🇺',
	ja: '🇯🇵',
	zh: '🇨🇳',
	ko: '🇰🇷',
	ar: '🇸🇦',
	hi: '🇮🇳',
};

const LocaleSwitcher = memo(() => {
	const { pathname } = useLocation();
	const navigate = useNavigate();

	const pathWithoutLocale = getPathWithoutLocale(pathname);

	const {
		locale: currentLocale,
		availableLocales,
		setLocale,
	} = useLocale({
		onLocaleChange: (newLocale: string) => {
			const localizedPath = getLocalizedUrl(pathWithoutLocale, newLocale);
			navigate(localizedPath);
		},
	});

	const handleLocaleChange = useCallback(
		(newLocale: string) => {
			setLocale(newLocale);
		},
		[setLocale],
	);

	const currentFlag =
		LOCALE_FLAGS[currentLocale.split('-')[0].toLowerCase()] || '🌐';

	return (
		<Dropdown placement="bottom-end">
			<DropdownTrigger>
				<Button
					isIconOnly
					variant="light"
					className={cn([
						'transition-all duration-200',
						'hover:bg-default-100',
					])}
					size="sm"
					aria-label="Select language"
				>
					<span className="text-lg">{currentFlag}</span>
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label="Select a language"
				onAction={(key) => handleLocaleChange(key as string)}
				className={cn(['max-w-xs'])}
				itemClasses={{
					base: [
						'rounded-md',
						'px-2 py-1.5',
						'text-small',
						'transition-colors duration-100',
						'data-[hover=true]:bg-default-100',
						'data-[selected=true]:bg-default-100',
						'data-[selected=true]:font-medium',
					],
				}}
			>
				{availableLocales.map((localeItem) => {
					const flag =
						LOCALE_FLAGS[localeItem.split('-')[0].toLowerCase()] || '🌐';
					const code = localeItem.split('-')[0].toUpperCase();
					const isSelected = localeItem === currentLocale;

					return (
						<DropdownItem
							key={localeItem}
							startContent={<span className="text-base">{flag}</span>}
							endContent={isSelected ? <CheckIcon size={16} /> : null}
							aria-current={isSelected ? 'page' : undefined}
						>
							{code}
						</DropdownItem>
					);
				})}
			</DropdownMenu>
		</Dropdown>
	);
});

LocaleSwitcher.displayName = 'LocaleSwitcher';

export { LocaleSwitcher };
