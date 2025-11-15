import { cn } from '@heroui/react';
import { memo, type ReactNode } from 'react';

interface FieldIconProps {
	children: ReactNode;
}

export const FieldIcon = memo(({ children }: FieldIconProps) => {
	return (
		<span
			className={cn("text-default-400 group-data-[invalid='true']:text-danger")}
		>
			{children}
		</span>
	);
});
