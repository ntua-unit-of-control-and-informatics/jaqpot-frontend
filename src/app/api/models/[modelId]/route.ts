import { auth } from '@/auth';
import { errorResponse, handleApiResponse } from '@/app/util/response';
import { isAuthenticated } from '@/app/util/auth';

export async function GET(
  request: Request,
  { params }: { params: { modelId: string } },
) {
  const session = await auth();
  if (!isAuthenticated(session)) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const res = await fetch(
    `${process.env.API_URL}/v1/models/${params.modelId}`,
    {
      headers: {
        Authorization: `Bearer ${session!.token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  return handleApiResponse(res);
}
