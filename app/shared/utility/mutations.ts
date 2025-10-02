// Type for mutation hook arguments with generic data type
export type MutationHookArgs<TData = unknown> = {
	onSuccess?: (data: TData) => void;
	onApiError?: (error: Error) => void;
	onValidationError?: (error: Error) => void;
	onUnknownError?: (error: unknown) => void;
};

export const MUTATION_KEYS = {
	LOGIN: 'login',
	LOGOUT: 'logout',
} as const;
