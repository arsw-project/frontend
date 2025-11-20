import type { UserApi } from '@pages/users/users.validators';
import { useAxios } from '@shared/hooks/axios.hook';
import type { QueryResult } from '@shared/utility/queries';
import { useQuery } from '@tanstack/react-query';

const useUsers = (): QueryResult<UserApi[]> => {
	const axios = useAxios();

	const buildUrl = () => {
		return `/users`;
	};

	const usersQuery = useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const { data } = await axios.get(buildUrl());
			return data.users as UserApi[];
		},
		retry: false,
	});

	return {
		data: usersQuery.data,
		error: usersQuery.error,
		isSuccess: usersQuery.isSuccess,
		isError: usersQuery.isError,
		isLoading: usersQuery.isPending,
	} as QueryResult<UserApi[]>;
};

export { useUsers };
