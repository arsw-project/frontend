import { useEffect, useState } from 'react';

/**
 * Hook para detectar si la pantalla es mayor a un breakpoint específico
 * @param breakpoint - Ancho mínimo en píxeles (default: 768 para tablets)
 * @returns boolean indicando si la pantalla es mayor al breakpoint
 */
export const useMediaQuery = (breakpoint: number = 768): boolean => {
	const [isMatched, setIsMatched] = useState<boolean>(false);
	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isMounted) return;

		const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);

		// Establecer el valor inicial
		setIsMatched(mediaQuery.matches);

		// Listener para cambios
		const handleChange = (e: MediaQueryListEvent) => {
			setIsMatched(e.matches);
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [breakpoint, isMounted]);

	// Retornar false en SSR/inicial para evitar hydration mismatch
	return isMounted && isMatched;
};
