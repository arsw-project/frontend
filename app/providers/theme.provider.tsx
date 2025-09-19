import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	use,
	useEffect,
	useState,
} from 'react';

export type ThemeContextType = {
	theme: string;
	setTheme: Dispatch<SetStateAction<string>>;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
	undefined,
);

export function useTheme() {
	const context = use(ThemeContext);

	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}

	return context;
}

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState('light');

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const savedTheme = localStorage.getItem('theme');
			if (savedTheme) {
				setTheme(savedTheme);
			}
		}
	}, []);

	useEffect(() => {
		document.documentElement.classList.toggle('dark', theme === 'dark');
		if (typeof window !== 'undefined') {
			localStorage.setItem('theme', theme);
		}
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
