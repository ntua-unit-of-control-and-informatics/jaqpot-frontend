'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { Pagination } from '@nextui-org/pagination';
import { UserDto } from '@/app/api.types';
import useSWR, { Fetcher } from 'swr';
import { Spinner } from '@nextui-org/spinner';
import SWRClientFetchError from '@/app/components/SWRClientFetchError';
import { JaqpotCustomError } from '@/app/types/jaqpot-custom-error';
import { ApiResponse } from '@/app/util/response';
import { SortDescriptor } from '@react-types/shared/src/collections';
import { convertSortDirection, SORT_DELIMITER } from '@/app/util/sort';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Chip, getKeyValue } from '@nextui-org/react';
import { format } from 'date-fns';

interface UsersResponseDto {
  content: UserDto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

interface UsersTableProps {
  usersEndpoint: string;
}

const fetcher: Fetcher<ApiResponse<UsersResponseDto>, string> = async (url) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new JaqpotCustomError(
      'An error occurred while fetching the data.',
      res.status,
    );
    throw error;
  }

  return res.json();
};

function useUsersPage(
  page: number,
  sort: string[],
  usersEndpoint: string,
): {
  data: UsersResponseDto | null | undefined;
  isLoading: boolean;
  error: JaqpotCustomError | undefined;
} {
  const sortQuery = sort.length > 0 ? `&sort=${sort.join('&sort=')}` : '';
  const { data, error, isLoading } = useSWR(
    `${usersEndpoint}?page=${page}&size=10${sortQuery}`,
    fetcher,
  );

  if (error) {
    return {
      data: undefined,
      isLoading: false,
      error,
    };
  }

  return {
    data: data?.data,
    isLoading,
    error: undefined,
  };
}

export default function UsersTable({ usersEndpoint }: UsersTableProps) {
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  const [sort, setSort] = useState<string[]>(['createdAt|desc']); // Default sort by signup date

  const { data, isLoading, error } = useUsersPage(
    page - 1,
    sort,
    usersEndpoint,
  );

  const columns = [
    {
      key: 'email',
      label: 'Email',
      allowsSorting: true,
    },
    {
      key: 'username',
      label: 'Username',
      allowsSorting: true,
    },
    {
      key: 'firstName',
      label: 'First Name',
      allowsSorting: true,
    },
    {
      key: 'lastName',
      label: 'Last Name',
      allowsSorting: true,
    },
    {
      key: 'emailVerified',
      label: 'Email Verified',
    },
    {
      key: 'createdAt',
      label: 'Signup Date',
      allowsSorting: true,
    },
  ];

  const rows = data?.content?.map((user: UserDto & { createdAt?: string }) => {
    return {
      ...user,
      email: <div className="sm:min-w-56">{user.email}</div>,
      username: <div className="font-medium">{user.username}</div>,
      firstName: <div>{user.firstName || '-'}</div>,
      lastName: <div>{user.lastName || '-'}</div>,
      emailVerified: (
        <Chip
          color={user.emailVerified ? 'success' : 'warning'}
          variant="flat"
          size="sm"
          startContent={
            user.emailVerified ? (
              <CheckIcon className="h-3 w-3" />
            ) : (
              <XMarkIcon className="h-3 w-3" />
            )
          }
        >
          {user.emailVerified ? 'Verified' : 'Unverified'}
        </Chip>
      ),
      createdAt: user.createdAt ? (
        <div className="text-sm">
          {format(new Date(user.createdAt), 'MMM dd, yyyy HH:mm')}
        </div>
      ) : (
        <div className="text-sm text-gray-500">-</div>
      ),
    };
  });

  const loadingState = isLoading ? 'loading' : 'idle';

  async function onSortChange({ column, direction }: SortDescriptor) {
    setSortDescriptor({ column, direction });
    setSort([
      `${column}${SORT_DELIMITER}${convertSortDirection(direction ?? '')}`,
    ]);
  }

  if (error) return <SWRClientFetchError error={error} />;
  if (isLoading) return <Spinner />;

  return (
    <>
      <Table
        aria-label="Users table"
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
        topContent={
          data ? (
            <div className="flex justify-between items-center">
              <span className="text-small text-default-400">
                Total {data.totalElements} user{data.totalElements === 1 ? '' : 's'}
              </span>
            </div>
          ) : null
        }
        bottomContent={
          data && data.totalPages > 1 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={data.totalPages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              allowsSorting={column.allowsSorting}
              className="text-left"
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={rows || []}
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
