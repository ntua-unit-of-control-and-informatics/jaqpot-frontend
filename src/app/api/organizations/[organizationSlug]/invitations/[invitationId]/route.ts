import { auth } from '@/auth';
import { DatasetDto } from '@/app/api.types';
import {
  ApiResponse,
  errorResponse,
  handleApiResponse,
} from '@/app/util/response';
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/app/util/auth';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  props: { params: Promise<{ organizationSlug: string; invitationId: string }> }
): Promise<NextResponse<ApiResponse>> {
  const params = await props.params;
  const session = await auth();
  if (!isAuthenticated(session)) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const organizationInvitationDto = await request.json();

  const res = await fetch(
    `${process.env.API_URL}/v1/organizations/${params.organizationSlug}/invitations/${params.invitationId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${session!.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(organizationInvitationDto),
    },
  );

  return handleApiResponse(res);
}
