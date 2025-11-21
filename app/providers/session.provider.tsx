import {
	apiValidationSchema,
	type LoginFormState,
} from '@pages/login/login.validators';
import { useAxios } from '@shared/hooks/axios.hook';
import { isApiError } from '@shared/utility/errors';
import {
	MUTATION_KEYS,
	type MutationHookArgs,
} from '@shared/utility/mutations';
import { QUERY_KEYS, type QueryResult } from '@shared/utility/queries';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type AxiosInstance, isAxiosError } from 'axios';
import { createContext, memo, type ReactNode, use } from 'react';
import { useNavigate } from 'react-router';
import { z } from 'zod';

type LoginResponse = Awaited<ReturnType<typeof loginMutationFn>>;

export type UserRole = 'user' | 'admin' | 'system';

type User = {
	id: string;
	name: string;
	email: string;
	authProvider: string;
	providerId: string | null;
	role: UserRole;
	memberships: string[];
	createdAt: string;
	updatedAt: string;
};

type Session = {
	user: User;
};

type SessionContextType = {
	session: QueryResult<Session>;
};

type LoginCredentials = {
	email: string;
	password: string;
};

const loginMutationFn = async (
	form: LoginCredentials,
	axios: AxiosInstance,
) => {
	const { email, password } = form;

	const response = await axios.post('/auth/login', { email, password });

	return response.data as Session;
};

export const useLoginMutation = (
	args: MutationHookArgs<LoginResponse> = {},
) => {
	const queryClient = useQueryClient();
	const axios = useAxios();

	const loginMutation = useMutation({
		mutationKey: [MUTATION_KEYS.LOGIN],
		mutationFn: (form: LoginFormState) => {
			const parsedForm = apiValidationSchema.parse(form);
			return loginMutationFn(parsedForm, axios);
		},
		onSuccess: (data) => {
			queryClient.setQueryData([QUERY_KEYS.SESSION], data);
			args.onSuccess?.(data);
		},
		onError: (rawError) => {
			if (isAxiosError(rawError)) {
				const apiError = rawError.response?.data;

				if (!apiError) {
					args.onUnknownError?.(rawError);
					return;
				}

				if (!isApiError(apiError)) {
					args.onUnknownError?.(rawError);
					return;
				}

				return args.onApiError?.(apiError);
			}

			if (rawError instanceof z.ZodError) {
				return args.onValidationError?.(rawError);
			}

			args.onUnknownError?.(rawError);
		},
		retry: false,
	});

	return {
		execute: loginMutation.mutateAsync,
		reset: loginMutation.reset,
		data: loginMutation.data,
		error: loginMutation.error,
		isSuccess: loginMutation.isSuccess,
		isError: loginMutation.isError,
		isLoading: loginMutation.isPending,
	};
};

const logoutMutationFn = async (axios: AxiosInstance) => {
	await axios.post('/auth/logout');
};

export const useLogoutMutation = (args: MutationHookArgs<void> = {}) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const axios = useAxios();

	const logoutMutation = useMutation({
		mutationKey: [MUTATION_KEYS.LOGOUT],
		mutationFn: () => logoutMutationFn(axios),
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: [QUERY_KEYS.SESSION] });
			navigate('/auth/login', { replace: true });
			args.onSuccess?.();
		},
		onError: (error) => {
			args.onUnknownError?.(error);
		},
	});

	return {
		execute: logoutMutation.mutateAsync,
		reset: logoutMutation.reset,
		data: logoutMutation.data,
		error: logoutMutation.error,
		isSuccess: logoutMutation.isSuccess,
		isError: logoutMutation.isError,
		isLoading: logoutMutation.isPending,
	};
};

const SessionContext = createContext<SessionContextType | null>(null);

export const useSession = () => {
	const context = use(SessionContext);

	if (!context) {
		throw new Error('useSession must be used within a SessionProvider');
	}

	return context;
};

const getSessionQueryFn = async (axios: AxiosInstance) => {
	const response = await axios.get('/auth/me');
	return response.data as Session;
};

const useSessionHooks = (): SessionContextType => {
	const axios = useAxios();

	const sessionQuery = useQuery({
		queryKey: [QUERY_KEYS.SESSION],
		queryFn: () => getSessionQueryFn(axios),
		retry: false,
	});

	const session = {
		data: sessionQuery.data,
		isLoading: sessionQuery.isLoading,
		isSuccess: sessionQuery.isSuccess,
		error: sessionQuery.error,
		isError: sessionQuery.isError,
	} as QueryResult<Session>;

	return {
		session,
	};
};

const SessionProvider = ({ children }: { children: ReactNode }) => {
	const session = useSessionHooks();

	return (
		<SessionContext.Provider value={session}>
			{children}
		</SessionContext.Provider>
	);
};

const AppSessionProvider = memo(({ children }: { children: ReactNode }) => {
	return <SessionProvider>{children}</SessionProvider>;
});

export { AppSessionProvider };
