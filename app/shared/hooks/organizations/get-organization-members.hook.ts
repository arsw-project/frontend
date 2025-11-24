import { useAxios } from '@shared/hooks/axios.hook';
import type { MembershipApi } from '@shared/hooks/organizations/organization.types';
import type { QueryResult } from '@shared/utility/queries';
import { useQuery } from '@tanstack/react-query';

type UseOrganizationMembersOptions = {
	enabled?: boolean;
};

const useOrganizationMembers = (
	organizationId: string | null,
	options: UseOrganizationMembersOptions = {},
): QueryResult<MembershipApi[]> => {
	const axios = useAxios();
	const { enabled = true } = options;

	const membersQuery = useQuery({
		queryKey: ['organization-members', organizationId],
		queryFn: async () => {
			if (!organizationId) {
				throw new Error('Organization ID is required');
			}
			const { data } = await axios.get(
				`/organizations/${organizationId}/members`,
				{ withCredentials: true },
			);
			return data.members as MembershipApi[];
		},
		enabled: enabled && !!organizationId,
		retry: false,
	});

	return {
		data: membersQuery.data,
		error: membersQuery.error,
		isSuccess: membersQuery.isSuccess,
		isError: membersQuery.isError,
		isLoading: membersQuery.isPending,
	} as QueryResult<MembershipApi[]>;
};

export { useOrganizationMembers };
export type { UseOrganizationMembersOptions };
