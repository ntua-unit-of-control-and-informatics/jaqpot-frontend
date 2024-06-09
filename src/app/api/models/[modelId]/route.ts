import { auth } from '@/auth';
import { errorResponse } from '@/app/util/response';

export async function GET(
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

  return await fetch(`${process.env.API_URL}/v1/models/${params.modelId}`, {
    headers: {
      Authorization: `Bearer ${session.token}`,
      'Content-Type': 'application/json',
    },
  });
}
