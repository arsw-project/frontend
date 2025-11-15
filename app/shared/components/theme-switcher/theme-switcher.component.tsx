import { Card, CardBody, cn, Switch } from '@heroui/react';
import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import { useTheme } from '@providers/theme.provider';
import { dataAttr } from '@shared/utility/props';
import { memo, useCallback, useMemo } from 'react';
import { useIntlayer } from 'react-intlayer';
import { tv, type VariantProps } from 'tailwind-variants';

const themeSwitcherVariants = tv({
	slots: {
		card: [
			'transition-all duration-200',
			'hover:shadow-medium',
			'rounded-medium',
			'bg-content1',
		],
		cardBody: [
			'flex flex-row items-center justify-between',
			'gap-2 sm:gap-3 md:gap-4',
			'px-3 sm:px-4 md:px-5',
			'py-2 sm:py-3 md:py-4',
		],
		labelWrapper: ['flex flex-col', 'gap-0.5 sm:gap-1 md:gap-1.5', 'shrink-0'],
		label: [
			'font-semibold text-foreground',
			'text-xs sm:text-small md:text-base',
		],
		description: [
			'text-foreground-600',
			'text-tiny sm:text-xs md:text-small',
			'transition-colors duration-200',
		],
		switchWrapper: ['shrink-0'],
		sunIcon: ['text-warning', 'text-base sm:text-lg'],
		moonIcon: ['text-primary', 'text-base sm:text-lg'],
	},
});

type ThemeSwitcherVariantProps = VariantProps<typeof themeSwitcherVariants>;

interface ThemeSwitcherProps extends ThemeSwitcherVariantProps {
	children?: React.ReactNode;

	label?: React.ReactNode;
	description?: React.ReactNode;

	className?: string;
	classNames?: Partial<
		Record<keyof ReturnType<typeof themeSwitcherVariants>, string>
	>;

	disableAnimation?: boolean;
}

export const ThemeSwitcher = memo(function ThemeSwitcher({
	className,
	classNames = {},
	disableAnimation = false,
}: ThemeSwitcherProps) {
	const { theme, setTheme } = useTheme();

	const isDark = theme === 'dark';

	const { themeLabel, darkMode, lightMode, toggleThemeAriaLabel } =
		useIntlayer('theme-switcher');

	const handleThemeChange = useCallback(
		(isSelected: boolean) => {
			setTheme(isSelected ? 'dark' : 'light');
		},
		[setTheme],
	);

	const slots = useMemo(() => themeSwitcherVariants(), []);

	return (
		<Card className={cn([slots.card(), classNames.card, className])}>
			<CardBody className={cn([slots.cardBody(), classNames.cardBody])}>
				<div className={cn([slots.labelWrapper(), classNames.labelWrapper])}>
					<p className={cn([slots.label(), classNames.label])}>{themeLabel}</p>
					<p
						className={cn([
							slots.description(),
							!disableAnimation && 'transition-colors duration-200',
							classNames.description,
						])}
						data-theme={dataAttr(isDark ? 'dark' : 'light')}
					>
						{isDark ? darkMode : lightMode}
					</p>
				</div>

				<div className={cn([slots.switchWrapper(), classNames.switchWrapper])}>
					<Switch
						isSelected={isDark}
						color="primary"
						size="lg"
						onValueChange={handleThemeChange}
						disableAnimation={disableAnimation}
						startContent={
							<SunIcon
								size={16}
								weight="fill"
								className={cn([slots.sunIcon(), classNames.sunIcon])}
							/>
						}
						endContent={
							<MoonIcon
								size={16}
								weight="fill"
								className={cn([slots.moonIcon(), classNames.moonIcon])}
							/>
						}
						classNames={{
							base: 'flex-row-reverse',
							wrapper: 'group-data-hover:bg-content2',
						}}
						aria-label={toggleThemeAriaLabel.value}
					/>
				</div>
			</CardBody>
		</Card>
	);
});
