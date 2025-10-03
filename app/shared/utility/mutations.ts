import type { ZodError } from 'zod';
import type { ApiError } from './errors';

// Type for mutation hook arguments with generic data type
export type MutationHookArgs<TData = unknown> = {
	onSuccess?: (data: TData) => void;
	onApiError?: (error: ApiError) => void;
	onValidationError?: (error: ZodError) => void;
	onUnknownError?: (error: unknown) => void;
};

export const MUTATION_KEYS = {
	LOGIN: 'login',
	LOGOUT: 'logout',
} as const;
