import { HeroUIProvider } from '@heroui/react';
import { memo, type ReactNode, useCallback } from 'react';
import {
	type NavigateFunction,
	type NavigateOptions,
	useHref,
	useNavigate,
} from 'react-router';

export const AppHeroUIProvider = memo(
	({ children }: { children: ReactNode }) => {
		const navigate = useNavigate();

		const viewTransitionNavigate = useCallback(
			((to: Parameters<NavigateFunction>[0], options?: NavigateOptions) => {
				// If 'to' is a number, call navigate as history delta
				if (typeof to === 'number') {
					navigate(to);
				} else {
					navigate(to, { ...options, viewTransition: true });
				}
			}) as NavigateFunction,
			[],
		);

		return (
			<HeroUIProvider
				navigate={viewTransitionNavigate}
				useHref={useHref}
				validationBehavior="aria"
			>
				{children}
			</HeroUIProvider>
		);
	},
);
