'use client';

import { OrganizationDto } from '@/app/api.types';
import React from 'react';
import { UserMinusIcon } from '@heroicons/react/24/solid';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { getAvatarFallbackImg } from '@/app/util/avatar';
import { Avatar } from "@heroui/avatar";
import { Link } from "@heroui/link";

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
          {(user) => (
            <TableRow key={user.id}>
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
                        <Avatar
                          src={
                            user.avatarUrl || getAvatarFallbackImg(user?.email)
                          }
                          alt="user avatar"
                          size="sm"
                        />
                        <Link
                          href={`/dashboard/user/${getKeyValue(user, columnKey)}`}
                          underline="hover"
                        >
                          {getKeyValue(user, columnKey)}
                        </Link>
                      </div>
                    </TableCell>
                  );
                } else {
                  return <TableCell>{getKeyValue(user, columnKey)}</TableCell>;
                }
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
