import { auth } from '@/auth';
import { DatasetDto } from '@/app/api.types';
import { errorResponse } from '@/app/util/response';

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return errorResponse('Oops! There seems to be a problem.', 401);
  }

  const organizationDto = await request.json();

  const res = await fetch(`${process.env.API_URL}/v1/organizations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(organizationDto),
  });

  const data = await res.json();
  if (!res.ok) {
    return errorResponse(data.message || null);
  }

  return data;
}
