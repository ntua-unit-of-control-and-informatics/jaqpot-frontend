import { NextResponse } from 'next/server';
import {
  ApiResponse,
  errorResponse,
  handleApiResponse,
} from '@/app/util/response';
import { auth } from '@/auth';
import { isAuthenticated } from '@/app/util/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ apiKey: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { apiKey } = await params;
  const session = await auth();
  if (!isAuthenticated(session)) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const data = await request.json();
  const res = await fetch(
    `${process.env.API_URL}/v1/user/api-keys/${apiKey}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session!.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  return handleApiResponse(res);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ apiKey: string }> },
) {
  const { apiKey } = await params;
  const session = await auth();
  if (!isAuthenticated(session)) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const res = await fetch(
    `${process.env.API_URL}/v1/user/api-keys/${apiKey}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session!.token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  return handleApiResponse(res);
}
