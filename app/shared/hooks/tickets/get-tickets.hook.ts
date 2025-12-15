import { useAxios } from '@shared/hooks/axios.hook';
import type {
	GetTicketsResponse,
	TicketApi,
} from '@shared/hooks/tickets/ticket.types';
import type { QueryResult } from '@shared/utility/queries';
import { useQuery } from '@tanstack/react-query';

const useTickets = (orgId: string): QueryResult<TicketApi[]> => {
	const axios = useAxios();

	const buildUrl = (organizationId: string) => {
		return `/tickets/organization/${organizationId}`;
	};

	const ticketsQuery = useQuery({
		queryKey: ['tickets', orgId],
		queryFn: async () => {
			const { data } = await axios.get<GetTicketsResponse>(buildUrl(orgId), {
				withCredentials: true,
			});
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
