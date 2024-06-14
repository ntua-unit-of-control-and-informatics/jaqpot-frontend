import { OrganizationDto } from '@/app/api.types';
import { auth } from '@/auth';
import { isAuthenticated } from '@/app/util/auth';

export async function getOrganizationByName(
  orgName: string,
): Promise<OrganizationDto | undefined> {
  const authorizationHeader: Record<string, string> = {};
  const session = await auth();
  if (isAuthenticated(session)) {
    authorizationHeader['Authorization'] = `Bearer ${session!.token}`;
  }

  const res = await fetch(
    `${process.env.API_URL}/v1/organizations/${orgName}`,
    {
      headers: {
        ...authorizationHeader,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!res.ok) return undefined;
  return res.json();
}
