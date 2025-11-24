import { useAxios } from '@shared/hooks/axios.hook';
import type { ApiError } from '@shared/utility/errors';
import type { MutationHookArgs } from '@shared/utility/mutations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useCallback } from 'react';

const useDeleteMemberMutation = (args: MutationHookArgs<undefined> = {}) => {
	const axios = useAxios();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ['delete-member'],
		mutationFn: async ({
			organizationId,
			membershipId,
		}: {
			organizationId: string;
			membershipId: string;
		}) => {
			await axios.delete(
				`/organizations/${organizationId}/members/${membershipId}`,
				{ withCredentials: true },
			);
			return { organizationId };
		},
		onSuccess: (result) => {
			queryClient.invalidateQueries({
				queryKey: ['organization-members', result.organizationId],
			});
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
		async (organizationId: string, membershipId: string) => {
			return await mutation.mutateAsync({ organizationId, membershipId });
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

export { useDeleteMemberMutation };
