import type {
	CreateTicketPayload,
	CreateTicketResponse,
} from '@pages/board/board.validators';
import { createTicketSchema } from '@pages/board/board.validators';
import { useAxios } from '@shared/hooks/axios.hook';
import type { ApiError } from '@shared/utility/errors';
import type { MutationHookArgs } from '@shared/utility/mutations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useCallback } from 'react';
import { z } from 'zod';

const useCreateTicketMutation = (
	args: MutationHookArgs<CreateTicketResponse> = {},
) => {
	const axios = useAxios();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ['create-ticket'],
		mutationFn: async (payload: CreateTicketPayload) => {
			const validated = createTicketSchema.parse(payload);
			const { data } = await axios.post<CreateTicketResponse>(
				'/tickets',
				validated,
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
		async (payload: CreateTicketPayload) => {
			try {
				return await mutation.mutateAsync(payload);
			} catch (error) {
				if (error instanceof z.ZodError) {
					args.onValidationError?.(error);
				}
				throw error;
			}
		},
		[mutation, args],
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

export { useCreateTicketMutation };
