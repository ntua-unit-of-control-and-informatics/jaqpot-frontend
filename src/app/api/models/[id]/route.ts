import { auth } from '@/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }

  const res = await fetch(`${process.env.API_URL}/v1/models/${params.id}`, {
    headers: {
      Authorization: `Bearer ${session.token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
}
