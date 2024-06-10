import { auth } from '@/auth';
import { errorResponse } from '@/app/util/response';

export async function PATCH(
  request: Request,
  { params }: { params: { modelId: string } },
) {
  const session = await auth();
  if (!session) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const data = await request.json();
  return await fetch(
    `${process.env.API_URL}/v1/models/${params.modelId}/partial`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );
}
