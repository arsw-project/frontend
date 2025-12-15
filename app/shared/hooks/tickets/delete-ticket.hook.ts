import type { ApiError } from '@shared/utility/errors';
import type { MutationHookArgs } from '@shared/utility/mutations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { type AxiosError } from 'axios';
import { useCallback } from 'react';

const ticketsAxios = axios.create({
	baseURL: 'http://localhost:3001',
	timeout: 10000,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
});

export type DeleteTicketResponse = unknown;

const useDeleteTicketMutation = (
	args: MutationHookArgs<DeleteTicketResponse> = {},
) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ['delete-ticket'],
		mutationFn: async (ticketId: string) => {
			const { data } = await ticketsAxios.delete<DeleteTicketResponse>(
				`/tickets/${ticketId}`,
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
			return await mutation.mutateAsync(ticketId);
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
