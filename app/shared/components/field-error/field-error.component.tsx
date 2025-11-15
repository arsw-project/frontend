import { cn, Tooltip } from '@heroui/react';
import { dataAttr } from '@shared/utility/props';
import {
	type ComponentProps,
	forwardRef,
	memo,
	type ReactNode,
	useMemo,
} from 'react';
import { useIntlayer } from 'react-intlayer';
import { tv, type VariantProps } from 'tailwind-variants';

const fieldErrorVariants = tv({
	slots: {
		base: [
			// Base wrapper styles
			'inline-flex items-center gap-1',
			'transition-colors duration-200',
		],
		content: [
			// Content text
			'truncate max-w-full',
		],
		counter: [
			// Error counter badge
			'inline-flex items-center justify-center cursor-info',
			'min-w-4 h-4 px-1',
			'text-xs font-medium',
			'rounded-full',
			'ml-1',
		],
		tooltipContent: [
			// Custom tooltip content
			'max-w-xs py-1',
		],
		errorList: [
			// Error list in tooltip
			'space-y-1',
		],
		errorItem: [
			// Individual error item
			'text-small',
			"before:content-['•'] before:mr-2",
		],
	},
	variants: {
		color: {
			danger: {
				base: 'text-danger-500',
				counter: 'bg-danger-50 text-danger-500 border border-danger-200',
				errorItem: 'before:text-danger-300',
			},
			warning: {
				base: 'text-warning-500',
				counter: 'bg-warning-50 text-warning-500 border border-warning-200',
				errorItem: 'before:text-warning-300',
			},
			default: {
				base: 'text-foreground-500',
				counter: 'bg-default-100 text-default-700',
				errorItem: 'before:text-default-400',
			},
		},
		size: {
			sm: {
				base: 'text-xs',
				content: 'text-xs',
				counter: 'min-w-3 h-3 text-xs',
				errorItem: 'text-xs',
			},
			md: {
				base: 'text-tiny',
				content: 'text-tiny',
				counter: 'min-w-4 h-4 text-xs',
				errorItem: 'text-small',
			},
			lg: {
				base: 'text-small',
				content: 'text-small',
				counter: 'min-w-5 h-5 text-small',
				errorItem: 'text-medium',
			},
		},
		isDisabled: {
			true: {
				base: 'opacity-disabled cursor-not-allowed',
				content: 'cursor-not-allowed',
			},
			false: '',
		},
	},
	compoundVariants: [
		// Dark mode optimizations for danger
		{
			color: 'danger',
			class: {
				base: 'dark:text-danger-400',
				counter:
					'dark:bg-danger-950/50 dark:text-danger-300 dark:border-danger-800',
				errorItem: 'dark:before:text-danger-500',
			},
		},
		// Dark mode optimizations for warning
		{
			color: 'warning',
			class: {
				base: 'dark:text-warning-400',
				counter:
					'dark:bg-warning-950/50 dark:text-warning-300 dark:border-warning-800',
				errorItem: 'dark:before:text-warning-500',
			},
		},
		// Dark mode optimizations for default
		{
			color: 'default',
			class: {
				base: 'dark:text-foreground-400',
				counter: 'dark:bg-default-100/10 dark:text-default-400',
				errorItem: 'dark:before:text-default-500',
			},
		},
	],
	defaultVariants: {
		color: 'danger',
		size: 'md',
		isDisabled: false,
	},
});

type FieldErrorVariantProps = VariantProps<typeof fieldErrorVariants>;

// Props interface
interface FieldErrorProps
	extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
		FieldErrorVariantProps {
	// Error data
	errors: string[] | string;

	// Display options
	maxDisplayLength?: number;
	showCounter?: boolean;
	tooltipPlacement?: ComponentProps<typeof Tooltip>['placement'];

	// Custom slot overrides
	classNames?: Partial<
		Record<keyof ReturnType<typeof fieldErrorVariants>, string>
	>;

	// Tooltip customization
	tooltipProps?: Omit<ComponentProps<typeof Tooltip>, 'content' | 'children'>;

	// Custom error formatter
	errorFormatter?: (errors: string[]) => ReactNode;
}

const FieldError = memo(
	forwardRef<HTMLSpanElement, FieldErrorProps>(
		(
			{
				errors,
				maxDisplayLength = 50,
				showCounter = true,
				tooltipPlacement = 'bottom-start',
				color = 'danger',
				size = 'md',
				isDisabled = false,
				className,
				classNames = {},
				tooltipProps = {},
				errorFormatter,
				...spanProps
			},
			ref,
		) => {
			const errorArray = useMemo(() => {
				if (typeof errors === 'string') {
					return errors.trim() ? [errors] : [];
				}
				return errors.filter((error) => error?.trim());
			}, [errors]);

			const { validationError, validationErrors, and, more } =
				useIntlayer('field-error');

			// Memoize slot calculations for performance
			const slots = useMemo(
				() =>
					fieldErrorVariants({
						color,
						size,
						isDisabled,
					}),
				[color, size, isDisabled],
			);

			// Format display text
			const displayText = useMemo(() => {
				if (errorArray.length === 0) return '';
				if (errorArray.length === 1) {
					const singleError = errorArray[0];
					return singleError.length > maxDisplayLength
						? `${singleError.substring(0, maxDisplayLength)}...`
						: singleError;
				}

				const firstError = errorArray[0];
				const additionalCount = errorArray.length - 1;
				const baseText =
					firstError.length > maxDisplayLength - 15
						? `${firstError.substring(0, maxDisplayLength - 15)}...`
						: firstError;

				return `${baseText} ${and.value} ${additionalCount} ${more.value}`;
			}, [errorArray, maxDisplayLength, and, more]);

			// Format tooltip content
			const tooltipContent = useMemo(() => {
				if (errorArray.length === 0) return null;
				if (errorArray.length === 1) return errorArray[0];

				if (errorFormatter) {
					return errorFormatter(errorArray);
				}

				return (
					<div
						className={cn([slots.tooltipContent(), classNames.tooltipContent])}
					>
						<div
							className={cn([
								'mb-2 font-medium',
								color === 'danger' && 'text-danger-600 dark:text-danger-400',
								color === 'warning' && 'text-warning-600 dark:text-warning-400',
								color === 'default' &&
									'text-foreground-600 dark:text-foreground-400',
							])}
						>
							{errorArray.length}{' '}
							{errorArray.length === 1 ? validationError : validationErrors}
						</div>
						<div className={cn([slots.errorList(), classNames.errorList])}>
							{errorArray.map((error, index) => (
								<div
									key={`error-${error.slice(0, 20)}-${index}`}
									className={cn([slots.errorItem(), classNames.errorItem])}
								>
									{error}
								</div>
							))}
						</div>
					</div>
				);
			}, [
				errorArray,
				errorFormatter,
				slots,
				classNames,
				color,
				validationError,
				validationErrors,
			]);

			// Memoize tooltip show logic
			const shouldShowTooltip = useMemo(() => {
				return (
					errorArray.length > 1 || errorArray[0]?.length > maxDisplayLength
				);
			}, [errorArray, maxDisplayLength]);

			// Handle cases where there are no errors
			if (errorArray.length === 0) {
				return null;
			}

			// Content element
			const contentElement = (
				<span
					ref={ref}
					className={cn([slots.base(), className, classNames.base])}
					data-disabled={dataAttr(isDisabled)}
					data-error-count={errorArray.length}
					{...spanProps}
				>
					<span className={cn([slots.content(), classNames.content])}>
						{displayText}
					</span>
					{showCounter && errorArray.length > 1 && (
						<span className={cn([slots.counter(), classNames.counter])}>
							{errorArray.length}
						</span>
					)}
				</span>
			);

			// Return with or without tooltip
			if (shouldShowTooltip) {
				return (
					<Tooltip
						content={tooltipContent}
						placement={tooltipPlacement}
						showArrow
						delay={300}
						closeDelay={100}
						{...tooltipProps}
					>
						{contentElement}
					</Tooltip>
				);
			}

			return contentElement;
		},
	),
);

FieldError.displayName = 'FieldError';

export { FieldError, type FieldErrorProps };
