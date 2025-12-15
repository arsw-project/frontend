import { Button, cn } from '@heroui/react';
import { XIcon } from '@phosphor-icons/react';
import { memo, useCallback } from 'react';

interface AcceptanceCriteriaListProps {
	criteria: string[];
	onRemove: (index: number) => void;
	isDisabled?: boolean;
}

export const AcceptanceCriteriaList = memo(function AcceptanceCriteriaList({
	criteria,
	onRemove,
	isDisabled = false,
}: AcceptanceCriteriaListProps) {
	if (criteria.length === 0) {
		return null;
	}

	return (
		<div className={cn(['flex flex-col gap-2 w-full'])}>
			{criteria.map((criterion, index) => (
				<AcceptanceCriteriaItem
					key={criterion}
					criterion={criterion}
					index={index}
					onRemove={onRemove}
					isDisabled={isDisabled}
				/>
			))}
		</div>
	);
});

interface AcceptanceCriteriaItemProps {
	criterion: string;
	index: number;
	onRemove: (index: number) => void;
	isDisabled?: boolean;
}

const AcceptanceCriteriaItem = memo(function AcceptanceCriteriaItem({
	criterion,
	index,
	onRemove,
	isDisabled = false,
}: AcceptanceCriteriaItemProps) {
	const handleRemove = useCallback(() => {
		onRemove(index);
	}, [index, onRemove]);

	return (
		<div
			className={cn([
				'flex items-start gap-3 p-3 rounded-medium',
				'bg-content2 border border-divider',
				'transition-all duration-200',
				!isDisabled && 'hover:bg-content3 hover:border-primary-300',
			])}
		>
			<div className={cn(['flex-1 pt-0.5'])}>
				<p
					className={cn([
						'text-foreground text-small leading-small',
						'word-break whitespace-pre-wrap',
					])}
				>
					{criterion}
				</p>
			</div>
			<Button
				isIconOnly
				variant="light"
				size="sm"
				onPress={handleRemove}
				isDisabled={isDisabled}
				className={cn([
					'text-foreground-400 hover:text-danger',
					'hover:bg-danger-50 min-w-fit',
					'shrink-0',
				])}
				aria-label="Remove criterion"
			>
				<XIcon size={16} weight="bold" />
			</Button>
		</div>
	);
});

AcceptanceCriteriaItem.displayName = 'AcceptanceCriteriaItem';
