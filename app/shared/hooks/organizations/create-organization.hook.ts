import { useAxios } from '@shared/hooks/axios.hook';
import {
	type CreateOrganizationPayload,
	type CreateOrganizationResponse,
	createOrganizationSchema,
} from '@shared/hooks/organizations/organization.types';
import type { ApiError } from '@shared/utility/errors';
import type { MutationHookArgs } from '@shared/utility/mutations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useCallback } from 'react';
import { z } from 'zod';

const useCreateOrganizationMutation = (
	args: MutationHookArgs<CreateOrganizationResponse> = {},
) => {
	const axios = useAxios();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ['create-organization'],
		mutationFn: async (payload: CreateOrganizationPayload) => {
			const validated = createOrganizationSchema.parse(payload);
			const { data } = await axios.post<CreateOrganizationResponse>(
				'/organizations',
				validated,
				{ withCredentials: true },
			);
			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['organizations'] });
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
		async (payload: CreateOrganizationPayload) => {
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

export { useCreateOrganizationMutation };
