import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAuthenticated } from '@/app/util/auth';
import { errorResponse } from '@/app/util/response';
import { redirect } from 'next/navigation';

export const config = {
  matcher: '/dashboard/new/organization',
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const session = await auth();
  // Call our authentication function to check the req
  if (!isAuthenticated(session)) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard/unauthorized';
    return NextResponse.rewrite(url);
  }
}
