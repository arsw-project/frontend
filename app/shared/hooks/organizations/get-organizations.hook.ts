import { useAxios } from '@shared/hooks/axios.hook';
import type { OrganizationApi } from '@shared/hooks/organizations/organization.types';
import type { QueryResult } from '@shared/utility/queries';
import { useQuery } from '@tanstack/react-query';

const useOrganizations = (): QueryResult<OrganizationApi[]> => {
	const axios = useAxios();

	const buildUrl = () => {
		return '/organizations';
	};

	const organizationsQuery = useQuery({
		queryKey: ['organizations'],
		queryFn: async () => {
			const { data } = await axios.get(buildUrl(), { withCredentials: true });
			return data.organizations as OrganizationApi[];
		},
		retry: false,
	});

	return {
		data: organizationsQuery.data,
		error: organizationsQuery.error,
		isSuccess: organizationsQuery.isSuccess,
		isError: organizationsQuery.isError,
		isLoading: organizationsQuery.isPending,
	} as QueryResult<OrganizationApi[]>;
};

export { useOrganizations };
