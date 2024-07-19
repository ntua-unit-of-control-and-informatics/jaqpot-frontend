import { NextResponse } from 'next/server';
import {
  ApiResponse,
  errorResponse,
  handleApiResponse,
} from '@/app/util/response';
import { auth } from '@/auth';
import { isAuthenticated } from '@/app/util/auth';

export async function GET(
  request: Request,
  { params }: { params: { organizationSlug: string } },
): Promise<NextResponse<ApiResponse>> {
  const session = await auth();
  if (!isAuthenticated(session)) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const res = await fetch(
    `${process.env.API_URL}/v1/organizations/${params.organizationSlug}/invitations`,
    {
      headers: {
        Authorization: `Bearer ${session!.token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  return handleApiResponse(res);
}

export async function POST(
  request: Request,
  { params }: { params: { organizationSlug: string } },
): Promise<NextResponse<ApiResponse>> {
  const session = await auth();
  if (!isAuthenticated(session)) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const invitationsRequestDto = await request.json();

  const res = await fetch(
    `${process.env.API_URL}/v1/organizations/${params.organizationSlug}/invitations`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session!.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invitationsRequestDto),
    },
  );

  return handleApiResponse(res);
}
