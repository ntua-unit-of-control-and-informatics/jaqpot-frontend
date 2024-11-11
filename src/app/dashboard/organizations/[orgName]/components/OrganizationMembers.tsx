'use client';

import {
  OrganizationDto,
  OrganizationInvitationDto,
  OrganizationUserDto,
} from '@/app/api.types';
import React from 'react';
import {
  ArrowPathIcon,
  EyeIcon,
  PlusIcon,
  UserMinusIcon,
} from '@heroicons/react/24/solid';
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
import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';
import Image from 'next/image';

interface OrganizationMembersProps {
  organization: OrganizationDto;
}

const columns = [
  {
    key: 'username',
    label: 'Username',
  },
  {
    key: 'actions',
    label: 'Actions',
  },
];

export default function OrganizationMembers({
  organization,
}: OrganizationMembersProps) {
  return (
    <div className="my-3">
      <Table aria-label="Members table" className="mt-4">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={organization.organizationMembers}
          emptyContent={'No rows to display.'}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => {
                if (columnKey === 'actions') {
                  if (organization.canEdit) {
                    return (
                      <TableCell>
                        <Tooltip content="Remove user" closeDelay={0}>
                          <Button
                            isDisabled
                            isIconOnly
                            variant="light"
                            onPress={() => {}}
                          >
                            <UserMinusIcon className="size-6 text-gray-400" />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    );
                  } else {
                    return <TableCell>-</TableCell>;
                  }
                } else if (columnKey === 'username') {
                  return (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Image
                          src={`https://api.dicebear.com/9.x/bottts/svg?seed=${item.email?.replace(
                            ' ',
                            '',
                          )}`}
                          alt="user avatar"
                          unoptimized
                          width={32}
                          height={32}
                        />
                        {getKeyValue(item, columnKey)}
                      </div>
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
