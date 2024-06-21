import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import {
  ApiResponse,
  errorResponse,
  handleApiResponse,
} from '@/app/util/response';
import { isAuthenticated } from '@/app/util/auth';

const PAGE_SIZE = '10';

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  const authorizationHeader: Record<string, string> = {};
  const session = await auth();
  if (isAuthenticated(session)) {
    authorizationHeader['Authorization'] = `Bearer ${session!.token}`;
  }

  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') || '0';
  const size = PAGE_SIZE;
  const query = searchParams.get('query');
  if (!query) {
    return errorResponse(
      'You need to provide a search query to search for models',
    );
  }

  const res = await fetch(
    `${process.env.API_URL}/v1/models/search?${new URLSearchParams({ page, size, query })}`,
    {
      headers: {
        ...authorizationHeader,
        'Content-Type': 'application/json',
      },
    },
  );

  return handleApiResponse(res);
}
