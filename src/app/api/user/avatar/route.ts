import { NextResponse } from 'next/server';
import {
  ApiResponse,
  errorResponse,
  handleApiResponse,
} from '@/app/util/response';
import { auth } from '@/auth';
import { isAuthenticated } from '@/app/util/auth';

export async function POST(
  request: Request,
): Promise<NextResponse<ApiResponse>> {
  const session = await auth();
  if (!isAuthenticated(session)) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const formData = await request.formData();

  const res = await fetch(`${process.env.API_URL}/v1/user/avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session!.token}`,
    },
    body: formData,
  });

  return handleApiResponse(res);
}

export async function DELETE(
  request: Request,
): Promise<NextResponse<ApiResponse>> {
  const session = await auth();
  if (!isAuthenticated(session)) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const res = await fetch(`${process.env.API_URL}/v1/user/avatar`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${session!.token}`,
    },
  });

  return handleApiResponse(res);
}
