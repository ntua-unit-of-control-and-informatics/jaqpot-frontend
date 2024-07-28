'use client';

import { OrganizationDto, OrganizationInvitationDto } from '@/app/api.types';
import React from 'react';
import { ArrowPathIcon, EyeIcon, PlusIcon } from '@heroicons/react/24/solid';
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
import { getUserFriendlyDate } from '@/app/util/date';
import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';
import toast from 'react-hot-toast';

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
  {
    key: 'actions',
    label: 'Actions',
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
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useSWR(`/api/organizations/${organization.name}/invitations`, fetcher);

  if (error) return <SWRClientFetchError error={error} />;

  const tableRows =
    apiResponse?.data?.map((invitation, index) => {
      return {
        ...invitation,
        expirationDate: getUserFriendlyDate(
          new Date(invitation.expirationDate as unknown as string),
        ),
        key: index,
      };
    }) ?? [];

  async function resendEmail(item: any) {
    const res = await fetch(
      `/api/organizations/${organization.id}/invitations/${item.id}/resend`,
      {
        method: 'POST',
      },
    );

    const { success, data, message }: ApiResponse = await res.json();
    if (success) {
      toast.success(`Invitation email resent successfully`);
    } else {
      toast.error(`Error resending invitation email:  ${message}`);
    }
  }

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
              {(columnKey) => {
                if (columnKey === 'actions') {
                  return (
                    <TableCell>
                      <Tooltip content="Resend email" closeDelay={0}>
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() => resendEmail(item)}
                        >
                          <ArrowPathIcon className="size-6 text-gray-400" />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  );
                } else {
                  return <TableCell>{getKeyValue(item, columnKey)}</TableCell>;
                }
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
