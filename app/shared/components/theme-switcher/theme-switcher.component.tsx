import { Card, CardBody, cn, Switch } from '@heroui/react';
import { Moon, Sun } from '@phosphor-icons/react';
import { useTheme } from '@providers/theme.provider';
import { memo, useCallback } from 'react';

export const ThemeSwitcher = memo(function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	const isDark = theme === 'dark';

	const handleThemeChange = useCallback(
		(isSelected: boolean) => {
			setTheme(isSelected ? 'dark' : 'light');
		},
		[setTheme],
	);

	return (
		<Card className={cn(['transition-all duration-200 hover:shadow-medium'])}>
			<CardBody
				className={cn([
					'flex-row items-center justify-between gap-3 px-4 py-3',
				])}
			>
				<div className={cn(['flex flex-col gap-1'])}>
					<p className={cn(['font-semibold text-foreground text-small'])}>
						Theme
					</p>
					<p
						className={cn([
							'text-foreground-500 text-tiny',
							isDark ? 'text-blue-400' : 'text-orange-400',
						])}
					>
						{isDark ? 'Dark mode' : 'Light mode'}
					</p>
				</div>

				<Switch
					isSelected={isDark}
					color="primary"
					size="lg"
					onValueChange={handleThemeChange}
					startContent={
						<Sun size={16} weight="fill" className={cn(['text-orange-400'])} />
					}
					endContent={
						<Moon size={16} weight="fill" className={cn(['text-blue-400'])} />
					}
					classNames={{
						base: 'flex-row-reverse',
						wrapper: 'group-data-hover:bg-content2',
					}}
					aria-label="Toggle theme"
				/>
			</CardBody>
		</Card>
	);
});
