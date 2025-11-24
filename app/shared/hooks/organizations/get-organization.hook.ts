import { useAxios } from '@shared/hooks/axios.hook';
import type { OrganizationApi } from '@shared/hooks/organizations/organization.types';
import type { QueryResult } from '@shared/utility/queries';
import { useQuery } from '@tanstack/react-query';

type UseOrganizationOptions = {
	enabled?: boolean;
};

const useOrganization = (
	organizationId: string | null,
	options: UseOrganizationOptions = {},
): QueryResult<OrganizationApi> => {
	const axios = useAxios();
	const { enabled = true } = options;

	const organizationQuery = useQuery({
		queryKey: ['organization', organizationId],
		queryFn: async () => {
			if (!organizationId) {
				throw new Error('Organization ID is required');
			}
			const { data } = await axios.get(`/organizations/${organizationId}`, {
				withCredentials: true,
			});
			return data.organization as OrganizationApi;
		},
		enabled: enabled && !!organizationId,
		retry: false,
	});

	return {
		data: organizationQuery.data,
		error: organizationQuery.error,
		isSuccess: organizationQuery.isSuccess,
		isError: organizationQuery.isError,
		isLoading: organizationQuery.isPending,
	} as QueryResult<OrganizationApi>;
};

export { useOrganization };
export type { UseOrganizationOptions };
