import { type Dictionary, t } from 'intlayer';

const themeSwitcherContent = {
	key: 'theme-switcher',
	content: {
		themeLabel: t({
			en: 'Theme',
			es: 'Tema',
		}),
		darkMode: t({
			en: 'Dark mode',
			es: 'Modo oscuro',
		}),
		lightMode: t({
			en: 'Light mode',
			es: 'Modo claro',
		}),
		toggleThemeAriaLabel: t({
			en: 'Toggle theme',
			es: 'Cambiar tema',
		}),
	},
} satisfies Dictionary;

export default themeSwitcherContent;
