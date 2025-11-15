import { Card, CardBody, cn, Spinner } from '@heroui/react';
import { motion } from 'framer-motion';
import { memo } from 'react';
import { useIntlayer } from 'react-intlayer';

const AppLoading = memo(() => {
	const { loadingText } = useIntlayer('app-loading');

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className={cn(['fixed inset-0 z-50 flex items-center justify-center'])}
		>
			<Card className={cn(['mx-auto max-w-md shadow-medium'])}>
				<CardBody className={cn(['flex flex-col items-center gap-4 p-8'])}>
					<Spinner size="lg" color="primary" />
					<p className={cn(['text-center text-foreground text-medium'])}>
						{loadingText}
					</p>
				</CardBody>
			</Card>
		</motion.div>
	);
});

export { AppLoading };
