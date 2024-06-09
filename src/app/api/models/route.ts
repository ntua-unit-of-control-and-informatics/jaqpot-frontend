import { auth } from '@/auth';
import { NextRequest } from 'next/server';
import { errorResponse } from '@/app/util/response';

const PAGE_SIZE = '10';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') || '0';
  const size = PAGE_SIZE;

  return await fetch(
    `${process.env.API_URL}/v1/models?${new URLSearchParams({ page, size })}`,
    {
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },
    },
  );
}
