'use client';

import Link from 'next/link';
import useSWR, { Fetcher } from 'swr';
import { ApiResponse } from '@/app/util/response';
import { DatasetDto, OrganizationDto } from '@/app/api.types';
import { CustomError } from '@/app/types/CustomError';
import React, { useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/spinner';
import useSWRMutation from 'swr/mutation';
import { useSession } from 'next-auth/react';
import { logger } from '@/logger';

const log = logger.child({ module: 'userOrganizations' });

const fetcher: Fetcher<ApiResponse<OrganizationDto[]>, string> = async (
  url,
) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const message = (await res.json()).message;
    const status = res.status;
    if (status >= 500) {
      log.error(message);
    }
  } else {
    return res.json();
  }
};

const backgroundColors = ['bg-emerald-400', 'bg-amber-400', 'bg-fuchsia-400'];

function backgroundColorRotation(index: number) {
  return backgroundColors[index % backgroundColors.length];
}

export default function UserOrganizations() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const {
    data: apiResponse,
    trigger,
    error,
  } = useSWRMutation(`/api/user/organizations`, fetcher);

  useEffect(() => {
    setIsLoading(true);
    trigger().finally(() => setIsLoading(false));
  }, [trigger]);

  let userOrganizations;
  if (apiResponse?.success) {
    userOrganizations = apiResponse.data;
  } else {
    return;
  }

  const userOwnedOrganizations =
    userOrganizations?.filter((org) => org.canEdit) ?? [];
  const userMemberOrganizations =
    userOrganizations?.filter((org) => !org.canEdit) ?? [];

  if (error) return;
  if (isLoading) return <Spinner />;

  return (
    <ul className="space-y-2 font-medium">
      {userOwnedOrganizations.length > 0 && (
        <>
          <div className="p-2 text-xs uppercase text-indigo-200 dark:text-white">
            Your organizations
          </div>
          {userOwnedOrganizations.map((organization, index) => (
            <li key={index}>
              <Link
                href={`/dashboard/organizations/${organization.name}`}
                className="group flex items-center rounded-lg p-2 text-indigo-200 hover:bg-indigo-700 dark:text-white dark:hover:bg-gray-700"
              >
                <div
                  className={`rounded-lg ${backgroundColorRotation(index)} flex size-6 items-center justify-center border-indigo-400 text-sm text-white`}
                >
                  <div className="p-3 text-center font-bold">
                    {organization.name.substring(0, 1).toUpperCase()}
                  </div>
                </div>

                <span className="ms-3">{organization.name}</span>
              </Link>
            </li>
          ))}
        </>
      )}
      {userMemberOrganizations.length > 0 && (
        <>
          <div className="p-2 text-xs uppercase text-indigo-200 dark:text-white">
            Your memberships
          </div>
          {userMemberOrganizations.map((organization, index) => (
            <li key={index}>
              <Link
                href={`/dashboard/organizations/${organization.name}`}
                className="group flex items-center rounded-lg p-2 text-indigo-200 hover:bg-indigo-700 dark:text-white dark:hover:bg-gray-700"
              >
                <div
                  className={`rounded-lg ${backgroundColorRotation(index)} flex size-6 items-center justify-center border-indigo-400 text-sm text-white`}
                >
                  <div className="p-3 text-center font-bold">
                    {organization.name.substring(0, 1).toUpperCase()}
                  </div>
                </div>
                <span className="ms-3">{organization.name}</span>
              </Link>
            </li>
          ))}
        </>
      )}
    </ul>
  );
}
