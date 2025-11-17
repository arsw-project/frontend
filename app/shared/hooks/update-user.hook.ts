import { useAxios } from '@shared/hooks/axios.hook';
import type { ApiError } from '@shared/utility/errors';
import type { MutationHookArgs } from '@shared/utility/mutations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useCallback } from 'react';
import { z } from 'zod';

type UpdateUserPayload = {
	name?: string;
	email?: string;
	password?: string;
	role?: 'user' | 'admin' | 'system';
};

type UserApi = {
	id: string;
	name: string;
	email: string;
	authProvider: string;
	providerId: string | null;
	role: string;
	createdAt: string;
	updatedAt: string;
};

type UpdateUserResponse = {
	user: UserApi;
};

const updateUserSchema = z.object({
	name: z.string().min(1).optional(),
	email: z.string().email().optional(),
	password: z.string().min(8).optional(),
	role: z.enum(['user', 'admin', 'system']).optional(),
});

const useUpdateUserMutation = (
	args: MutationHookArgs<UpdateUserResponse> = {},
) => {
	const axios = useAxios();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ['update-user'],
		mutationFn: async ({
			userId,
			payload,
		}: {
			userId: string;
			payload: UpdateUserPayload;
		}) => {
			const validated = updateUserSchema.parse(payload);
			const { data } = await axios.patch<UpdateUserResponse>(
				`/users/${userId}`,
				validated,
				{ withCredentials: true },
			);
			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
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
		async (userId: string, payload: UpdateUserPayload) => {
			try {
				return await mutation.mutateAsync({ userId, payload });
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

export { useUpdateUserMutation };
export type { UpdateUserPayload, UpdateUserResponse };
