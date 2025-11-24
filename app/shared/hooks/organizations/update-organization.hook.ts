import { useAxios } from '@shared/hooks/axios.hook';
import {
	type UpdateOrganizationPayload,
	type UpdateOrganizationResponse,
	updateOrganizationSchema,
} from '@shared/hooks/organizations/organization.types';
import type { ApiError } from '@shared/utility/errors';
import type { MutationHookArgs } from '@shared/utility/mutations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useCallback } from 'react';
import { z } from 'zod';

const useUpdateOrganizationMutation = (
	args: MutationHookArgs<UpdateOrganizationResponse> = {},
) => {
	const axios = useAxios();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ['update-organization'],
		mutationFn: async ({
			organizationId,
			payload,
		}: {
			organizationId: string;
			payload: UpdateOrganizationPayload;
		}) => {
			const validated = updateOrganizationSchema.parse(payload);
			const { data } = await axios.patch<UpdateOrganizationResponse>(
				`/organizations/${organizationId}`,
				validated,
				{ withCredentials: true },
			);
			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['organizations'] });
			queryClient.invalidateQueries({
				queryKey: ['organization', data.organization.id],
			});
			args.onSuccess?.(data);
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
		async (organizationId: string, payload: UpdateOrganizationPayload) => {
			try {
				return await mutation.mutateAsync({ organizationId, payload });
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

export { useUpdateOrganizationMutation };
