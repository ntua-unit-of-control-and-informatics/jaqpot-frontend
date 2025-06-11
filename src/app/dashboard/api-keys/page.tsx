import { ApiKeyDto, ModelDto } from '@/app/api.types';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { logger } from '@/logger';
import React from 'react';
import ApiKeys from '@/app/dashboard/api-keys/components/ApiKeys';
import { isAuthenticated } from '@/app/util/auth';

const log = logger.child({ module: 'modelPage' });

async function getApiKeys(): Promise<ApiKeyDto[] | undefined> {
  const session = await auth();

  const res = await fetch(`${process.env.API_URL}/v1/user/api-keys`, {
    headers: {
      Authorization: `Bearer ${session!.token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return undefined;
    } else if (res.status === 401 || res.status === 403) {
      redirect('/dashboard/unauthorized');
    }
    return undefined;
  }

  return res.json();
}

export default async function Page() {
  const session = await auth();
  if (!isAuthenticated(session)) {
    return <div>You need to be logged in to access this page</div>;
  }

  const apiKeys = await getApiKeys();
  if (!apiKeys) {
    return <div>No API keys found</div>;
  }

  return (
    <div>
      <ApiKeys apiKeys={apiKeys} />
    </div>
  );
}
