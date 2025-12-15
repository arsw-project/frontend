import { useAxios } from '@shared/hooks/axios.hook';
import type { ApiError } from '@shared/utility/errors';
import type { MutationHookArgs } from '@shared/utility/mutations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useCallback } from 'react';

export type DeleteTicketResponse = unknown;

const useDeleteTicketMutation = (
	args: MutationHookArgs<DeleteTicketResponse> = {},
) => {
	const axios = useAxios();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ['delete-ticket'],
		mutationFn: async (ticketId: string) => {
			const { data } = await axios.delete<DeleteTicketResponse>(
				`/tickets/${ticketId}`,
				{ withCredentials: true },
			);
			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['tickets'] });
			args.onSuccess?.(data);
		},
		onError: (error: AxiosError<ApiError>) => {
			if (error.response?.data) {
				args.onApiError?.(error.response.data);
				return;
			}

			args.onUnknownError?.(error);
		},
		retry: false,
	});

	const execute = useCallback(
		async (ticketId: string) => {
			try {
				return await mutation.mutateAsync(ticketId);
			} catch (error) {
				throw error;
			}
		},
		[mutation],
	);

	return {
		execute,
		isLoading: mutation.isPending,
		isSuccess: mutation.isSuccess,
		isError: mutation.isError,
		error: mutation.error,
		data: mutation.data,
		reset: mutation.reset,
	};
};

export { useDeleteTicketMutation };
