import { auth } from '@/auth';

export async function GET(
  request: Request,
  { params }: { params: { datasetId: string } },
) {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
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
