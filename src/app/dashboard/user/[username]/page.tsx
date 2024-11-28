import { logger } from '@/logger';
import { isAuthenticated } from '@/app/util/auth';
import { auth } from '@/auth';
import { Metadata } from 'next';
import { generateSharedMetadata } from '@/app/shared.metadata';
import { UserDto, UserSettingsDto } from '@/app/api.types';
import UserProfile from '@/app/dashboard/user/[username]/components/UserProfile';
import CustomErrorPage from '@/app/components/CustomErrorPage';
import React from 'react';
import { notFound } from 'next/navigation';

const log = logger.child({ module: 'error' });

interface UserPageParams {
  username: string;
}

export async function generateMetadata({
  params,
}: {
  params: UserPageParams;
}): Promise<Metadata> {
  let user;
  try {
    user = await getUser(params.username);
  } catch (e) {
    return generateSharedMetadata();
  }

  return generateSharedMetadata(
    `@${user?.username ?? ''}`,
    `User profile for user ${user?.username}`,
  );
}

async function getUser(username: string): Promise<UserDto | undefined> {
  const authorizationHeader: Record<string, string> = {};
  const session = await auth();
  if (isAuthenticated(session)) {
    authorizationHeader['Authorization'] = `Bearer ${session!.token}`;
  }

  const res = await fetch(`${process.env.API_URL}/v1/users/${username}`, {
    headers: {
      ...authorizationHeader,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    } else if (res.status === 401) {
      throw new Error(
        'You are not logged in. Please log in to access this page.',
      );
    } else if (res.status === 403) {
      throw new Error('You do not have permission to access this page.');
    }
    logger.warn(`User not found, status returned: ${res.status}`);
    notFound();
  }

  return res.json();
}

export default async function Page({ params }: { params: UserPageParams }) {
  let user;
  try {
    user = await getUser(params.username);
  } catch (e: any) {
    if (e?.message === 'NEXT_REDIRECT' || e?.digest === 'NEXT_NOT_FOUND') {
      throw e;
    }

    return (
      <CustomErrorPage
        title="Something's wrong here 🚧"
        description={(e as any)?.message}
      />
    );
  }
  return <UserProfile user={user!} />;
}
