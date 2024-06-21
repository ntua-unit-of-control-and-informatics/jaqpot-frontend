'use client';

import Link from 'next/link';
import useSWR, { Fetcher } from 'swr';
import { ApiResponse } from '@/app/util/response';
import { DatasetDto, OrganizationDto } from '@/app/api.types';
import { CustomError } from '@/app/types/CustomError';
import SWRClientFetchError from '@/app/components/SWRClientFetchError';
import React from 'react';
import { Spinner } from '@nextui-org/spinner';
import { BeakerIcon } from '@heroicons/react/24/solid';

const fetcher: Fetcher<ApiResponse<OrganizationDto[]>, string> = async (
  url,
) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const message = (await res.json()).message;
    const status = res.status;
    console.error(message);
    // Attach extra info to the error object.
    throw new CustomError(message, status);
  }

  return res.json();
};

const backgroundColors = ['bg-emerald-400', 'bg-amber-400', 'bg-fuchsia-400'];

function backgroundColorRotation(index: number) {
  return backgroundColors[index % backgroundColors.length];
}

export default function UserOrganizations() {
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useSWR(`/api/organizations/user`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  let userOrganizations;
  if (apiResponse?.success) {
    userOrganizations = apiResponse.data;
  } else {
    return;
  }

  if (error) return;
  if (isLoading) return <Spinner />;

  return (
    userOrganizations &&
    userOrganizations.length > 0 && (
      <ul className="space-y-2 font-medium">
        <div className="text-xs p-2 uppercase text-indigo-200 dark:text-white">
          Your organizations
        </div>
        {userOrganizations.map((organization, index) => (
          <li key={index}>
            <Link
              href={`/dashboard/organizations/${organization.name}`}
              className="flex items-center p-2 text-indigo-200 rounded-lg dark:text-white hover:bg-indigo-700 dark:hover:bg-gray-700 group"
            >
              <span
                className={`rounded-lg ${backgroundColorRotation(index)} border-indigo-400 size-6 flex justify-center items-center text-white`}
              >
                {organization.name.substring(0, 1).toUpperCase()}
              </span>
              <span className="ms-3">{organization.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    )
  );
}
