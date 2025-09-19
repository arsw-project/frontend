import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { memo, type ReactNode } from 'react';

const queryClient = new QueryClient();

const AppQueryClientProvider = memo(({ children }: { children: ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
});

export { AppQueryClientProvider };
