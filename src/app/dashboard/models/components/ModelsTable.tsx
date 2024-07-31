'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { Pagination } from '@nextui-org/pagination';
import {
  ModelDto,
  ModelsResponseDto,
  ModelSummaryDto,
  OrganizationDto,
} from '@/app/api.types';
import useSWR, { Fetcher } from 'swr';
import { Spinner } from '@nextui-org/spinner';
import { useRouter } from 'next/navigation';
import SWRClientFetchError from '@/app/components/SWRClientFetchError';
import { CustomError } from '@/app/types/CustomError';
import { ApiResponse } from '@/app/util/response';
import { SortDescriptor } from '@react-types/shared/src/collections';
import { convertSortDirection, SORT_DELIMITER } from '@/app/util/sort';
import JaqpotTimeAgo from '@/app/dashboard/models/[modelId]/components/JaqpotTimeAgo';
import { getKeyValue, Select, SelectItem } from '@nextui-org/react';

const fetcher: Fetcher<ApiResponse<ModelsResponseDto>, string> = async (
  url,
) => {
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

function useModelsPage(
  page: number,
  sort: string[],
  modelsEndpoint: string,
  filterByOrganization?: string,
) {
  const queryParams = new URLSearchParams({ page: page.toString() });
  sort.forEach((s) => queryParams.append('sort', s));

  if (
    filterByOrganization &&
    filterByOrganization.length > 0 &&
    filterByOrganization !== 'all'
  ) {
    queryParams.append('organizationId', filterByOrganization);
  }

  const {
    data: apiResponse,
    error,
    isLoading,
  } = useSWR(`${modelsEndpoint}?${queryParams.toString()}`, fetcher);

  let data;
  if (apiResponse?.success) {
    data = apiResponse?.data;
  }

  return {
    data,
    isLoading,
    error,
  };
}

interface ModelsTableProps {
  modelsEndpoint: string;
  showSharedOrganizations?: boolean;
  userOrganizations?: OrganizationDto[];
}

export default function ModelsTable({
  modelsEndpoint,
  showSharedOrganizations = false,
  userOrganizations = [],
}: ModelsTableProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  const [sort, setSort] = useState<string[]>([]);
  const [filterByOrganization, setFilterByOrganization] = useState('all');

  const { data, isLoading, error } = useModelsPage(
    page - 1,
    sort,
    modelsEndpoint,
    filterByOrganization,
  );

  const columns = [
    {
      key: 'name',
      label: 'Name',
      allowsSorting: true,
    },
    {
      key: 'type',
      label: 'Type',
      allowsSorting: true,
    },
    {
      key: 'description',
      label: 'Description',
    },
    {
      key: 'visibility',
      label: 'Visibility',
      allowsSorting: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      allowsSorting: true,
    },
  ];

  const userOrganizationIds = userOrganizations.map((org) => org.id);

  const rows = data?.content?.map((model: ModelSummaryDto) => {
    return {
      ...model,
      description: (
        <div className="max-h-28 max-w-52 overflow-hidden text-ellipsis whitespace-nowrap">
          {model.description}
        </div>
      ),
      createdAt: <JaqpotTimeAgo date={model.createdAt as any} />,
      sharedWithOrganizations: model.sharedWithOrganizations
        .filter((org) => userOrganizationIds.includes(org.id))
        .map((org) => org.name)
        .join(', '),
    };
  });

  if (showSharedOrganizations) {
    columns.push({
      key: 'sharedWithOrganizations',
      label: 'Shared with organizations',
    });
  }

  const loadingState = isLoading ? 'loading' : 'idle';

  function handleOrganizationFilterChange(e: React.ChangeEvent<any>) {
    setFilterByOrganization(e.target.value);
  }

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
      {showSharedOrganizations && (
        <Select
          items={[
            { key: 'all', label: 'All' },
            ...userOrganizations.map((org) => ({
              key: org.id!.toString(),
              label: org.name,
            })),
          ]}
          name="organizationId"
          label="Filter by organization"
          defaultSelectedKeys={['all']}
          selectedKeys={[filterByOrganization]}
          className="mb-4 max-w-xs"
          onChange={handleOrganizationFilterChange}
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>
      )}
      <Table
        aria-label="Models table"
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
        bottomContent={
          data?.totalPages ?? 0 > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={data?.totalPages ?? 0}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} allowsSorting={column.allowsSorting}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={rows}
          loadingContent={<Spinner />}
          loadingState={loadingState}
          emptyContent={'No rows to display.'}
        >
          {(item) => (
            <TableRow
              key={item?.id}
              className="cursor-pointer hover:bg-indigo-100"
              onClick={() => router.push(`/dashboard/models/${item.id}`)}
            >
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
