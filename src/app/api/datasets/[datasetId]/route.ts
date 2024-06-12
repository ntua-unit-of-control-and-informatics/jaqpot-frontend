import { auth } from '@/auth';
import { errorResponse } from '@/app/util/response';

export async function GET(
  request: Request,
  { params }: { params: { datasetId: string } },
) {
  const session = await auth();
  if (!isAuthenticated(session)) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const res = await fetch(
    `${process.env.API_URL}/v1/datasets/${params.datasetId}`,
    {
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return res;
}
