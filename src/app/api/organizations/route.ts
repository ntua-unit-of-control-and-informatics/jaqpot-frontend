import { auth } from '@/auth';
import { DatasetDto } from '@/app/api.types';
import { errorResponse } from '@/app/util/response';
import { redirect } from 'next/navigation';

export async function GET() {
  const session = await auth();
  if (!session) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  return await fetch(`${process.env.API_URL}/v1/organizations`, {
    headers: {
      Authorization: `Bearer ${session.token}`,
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const organizationDto = await request.json();

  const res = await fetch(`${process.env.API_URL}/v1/organizations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(organizationDto),
  });

  const organizationUrl = res.headers.get('Location');

  if (!res.ok || !organizationUrl) {
    const data = await res.json();
    return errorResponse(data.message || null);
  }
  const organizationUrlParts = organizationUrl.split('/');
  const organizationName =
    organizationUrlParts[organizationUrlParts.length - 1];

  return Response.json({ organizationName }, { status: 201 });
}
