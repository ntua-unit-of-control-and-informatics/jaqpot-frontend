import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { isAuthenticated } from '@/app/util/auth';
import { errorResponse } from '@/app/util/response';

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: '/organizations/create',
};

export async function middleware(request: NextRequest) {
  const session = await auth();
  // Call our authentication function to check the request
  if (!isAuthenticated(session)) {
    // Respond with JSON indicating an error message
    return errorResponse('Authentication failed', 401);
  }
}
