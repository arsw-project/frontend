export type SuccessQueryResponse<T> = {
	data: T;
	error: never;
	isSuccess: true;
	isError: false;
	isLoading: false;
};

export type ErrorQueryResponse = {
	data?: never;
	error: Error | null;
	isSuccess: false;
	isError: true;
	isLoading: false;
};

export type LoadingQuery = {
	data?: never;
	error: never;
	isSuccess: false;
	isLoading: true;
	isError: false;
};

export type QueryResult<T> =
	| SuccessQueryResponse<T>
	| ErrorQueryResponse
	| LoadingQuery;

export const QUERY_KEYS = {
	SESSION: 'session',
};
