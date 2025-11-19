import { useAxios } from '@shared/hooks/axios.hook';
import type { ApiError } from '@shared/utility/errors';
import type { MutationHookArgs } from '@shared/utility/mutations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useCallback } from 'react';

const useDeleteUserMutation = (args: MutationHookArgs<undefined> = {}) => {
	const axios = useAxios();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ['delete-user'],
		mutationFn: async (userId: string) => {
			await axios.delete(`/users/${userId}`, { withCredentials: true });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			args.onSuccess?.(undefined);
		},
		onError: (error: AxiosError<ApiError>) => {
			if (error.response?.data) {
				args.onApiError?.(error.response.data);
			} else {
				args.onUnknownError?.(error);
			}
		},
	});

	const execute = useCallback(
		async (userId: string) => {
			return await mutation.mutateAsync(userId);
		},
		[mutation],
	);

	return {
		execute,
		isLoading: mutation.isPending,
		isSuccess: mutation.isSuccess,
		isError: mutation.isError,
		error: mutation.error,
		reset: mutation.reset,
	};
};

export { useDeleteUserMutation };
