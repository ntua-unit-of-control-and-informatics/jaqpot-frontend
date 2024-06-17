'use client';

import {
  DataEntryDto,
  DatasetDto,
  OrganizationDto,
  OrganizationInvitationDto,
  PartiallyUpdateModelRequestDto,
} from '@/app/api.types';
import React, { useState } from 'react';
import { organizationVisibilitySelectValues } from '@/app/types/organization-select.types';
import { PlusIcon } from '@heroicons/react/24/solid';
import InviteUsersButton from '@/app/dashboard/organizations/[orgName]/components/tabs/InviteUsersButton';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from '@nextui-org/react';
import useSWR, { Fetcher } from 'swr';
import SWRClientFetchError from '@/app/components/SWRClientFetchError';
import { ApiResponse } from '@/app/util/response';
import { CustomError } from '@/app/types/CustomError';

interface OrganizationInvitationsTabProps {
  organization: OrganizationDto;
}

const columns = [
  {
    key: 'userEmail',
    label: 'User Email',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'expirationDate',
    label: 'Expiration date',
  },
];

const fetcher: Fetcher<
  ApiResponse<OrganizationInvitationDto[]>,
  string
> = async (url) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const message = (await res.json()).message;
    const status = res.status;
    // Attach extra info to the error object.
    throw new CustomError(message, status);
  }

  return res.json();
};

export default function OrganizationInvitationsTab({
  organization,
}: OrganizationInvitationsTabProps) {
  const { data, isLoading, error } = useSWR(
    `/api/organizations/${organization.name}/invitations`,
    fetcher,
  );

  const tableRows =
    data?.data?.map((invitation, index) => {
      return {
        ...invitation,
        expirationDate: new Date(
          invitation.expirationDate as unknown as string,
        ).toLocaleDateString(),
        key: index,
      };
    }) ?? [];

  if (error) return <SWRClientFetchError error={error} />;

  return (
    <div>
      <InviteUsersButton />
      <Table aria-label="Invitations table" className="mt-4">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={tableRows} emptyContent={'No rows to display.'}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
