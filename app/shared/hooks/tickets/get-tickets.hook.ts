import type {
	GetTicketsResponse,
	TicketApi,
} from '@shared/hooks/tickets/ticket.types';
import type { QueryResult } from '@shared/utility/queries';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const ticketsAxios = axios.create({
	baseURL: 'http://localhost:3001',
	timeout: 10000,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
});

const useTickets = (orgId: string): QueryResult<TicketApi[]> => {
	const buildUrl = (organizationId: string) => {
		return `/tickets/organization/${organizationId}`;
	};

	const ticketsQuery = useQuery({
		queryKey: ['tickets', orgId],
		queryFn: async () => {
			const { data } = await ticketsAxios.get<GetTicketsResponse>(
				buildUrl(orgId),
			);
			return data.tickets;
		},
		enabled: !!orgId,
		retry: false,
	});

	return {
		data: ticketsQuery.data,
		error: ticketsQuery.error,
		isSuccess: ticketsQuery.isSuccess,
		isError: ticketsQuery.isError,
		isLoading: ticketsQuery.isPending,
	} as QueryResult<TicketApi[]>;
};

export { useTickets };
