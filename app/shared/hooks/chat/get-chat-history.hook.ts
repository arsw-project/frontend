import type { QueryResult } from '@shared/utility/queries';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const chatAxios = axios.create({
	baseURL: 'http://localhost:3002',
	timeout: 10000,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
});

export interface ChatMessageApi {
	id: string;
	ticketId: string;
	userId: string;
	userName: string;
	message: string;
	timestamp: string;
}

export interface ChatHistoryResponse {
	data: ChatMessageApi[];
	pagination: {
		total: number;
		limit: number;
		offset: number;
		hasMore: boolean;
	};
}

export const useChatHistory = (
	ticketId: string,
	limit = 50,
	offset = 0,
): QueryResult<ChatMessageApi[]> => {
	const buildUrl = (tId: string, l: number, o: number) => {
		return `/chat/${tId}?limit=${l}&offset=${o}`;
	};

	const chatQuery = useQuery({
		queryKey: ['chat-history', ticketId, limit, offset],
		queryFn: async () => {
			const { data } = await chatAxios.get<ChatHistoryResponse>(
				buildUrl(ticketId, limit, offset),
			);
			return data.data;
		},
		enabled: !!ticketId,
		retry: false,
	});

	return {
		data: chatQuery.data,
		error: chatQuery.error,
		isSuccess: chatQuery.isSuccess,
		isError: chatQuery.isError,
		isLoading: chatQuery.isPending,
	} as QueryResult<ChatMessageApi[]>;
};
