'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';
import { Pagination } from '@heroui/pagination';
import { AdminDatasetsResponseDto, DatasetDto } from '@/app/api.types';
import useSWR, { Fetcher } from 'swr';
import { Spinner } from '@heroui/spinner';
import SWRClientFetchError from '@/app/components/SWRClientFetchError';
import { JaqpotCustomError } from '@/app/types/jaqpot-custom-error';
import { ApiResponse } from '@/app/util/response';
import { SortDescriptor } from '@react-types/shared/src/collections';
import { convertSortDirection, SORT_DELIMITER } from '@/app/util/sort';
import { getKeyValue } from '@heroui/react';
import { Link } from '@heroui/link';
import { format } from 'date-fns';
import JaqpotTimeAgo from '@/app/dashboard/models/[modelId]/components/JaqpotTimeAgo';
import { getDatasetStatusNode } from '@/app/util/dataset';

interface DatasetsTableProps {
  datasetsEndpoint: string;
}

const fetcher: Fetcher<ApiResponse<AdminDatasetsResponseDto>, string> = async (
  url,
) => {
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

function useDatasetsPage(
  page: number,
  sort: string[],
  datasetsEndpoint: string,
): {
  data: AdminDatasetsResponseDto | null | undefined;
  isLoading: boolean;
  error: JaqpotCustomError | undefined;
} {
  const sortQuery = sort.length > 0 ? `&sort=${sort.join('&sort=')}` : '';
  const { data, error, isLoading } = useSWR(
    `${datasetsEndpoint}?page=${page}&size=10${sortQuery}`,
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

function formatDateTime(value?: string | null) {
  if (!value) return <div className="text-sm text-gray-500">-</div>;
  return (
    <div className="text-sm">{format(new Date(value), 'MMM dd, yyyy HH:mm')}</div>
  );
}

export default function DatasetsTable({ datasetsEndpoint }: DatasetsTableProps) {
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  const [sort, setSort] = useState<string[]>(['createdAt|desc']); // Default sort by newest request

  const { data, isLoading, error } = useDatasetsPage(
    page - 1,
    sort,
    datasetsEndpoint,
  );

  const columns = [
    {
      key: 'id',
      label: 'ID',
      allowsSorting: true,
    },
    {
      key: 'modelName',
      label: 'Model',
    },
    {
      key: 'userId',
      label: 'User ID',
    },
    {
      key: 'type',
      label: 'Type',
      allowsSorting: true,
    },
    {
      key: 'status',
      label: 'Status',
      allowsSorting: true,
    },
    {
      key: 'createdAt',
      label: 'Requested',
      allowsSorting: true,
    },
    {
      key: 'executedAt',
      label: 'Executed',
      allowsSorting: true,
    },
  ];

  const rows = data?.content?.map((dataset: DatasetDto) => {
    return {
      ...dataset,
      key: dataset.id,
      id: (
        <Link
          isExternal
          showAnchorIcon
          href={`/dashboard/models/${dataset.modelId}/results/${dataset.id}`}
        >
          {dataset.id}
        </Link>
      ),
      modelName: (
        <Link
          isExternal
          showAnchorIcon
          href={`/dashboard/models/${dataset.modelId}`}
        >
          {dataset.modelName ?? dataset.modelId}
        </Link>
      ),
      userId: (
        <div className="max-w-56 truncate font-mono text-xs" title={dataset.userId}>
          {dataset.userId}
        </div>
      ),
      type: <div className="text-sm">{dataset.type}</div>,
      status: getDatasetStatusNode(dataset),
      createdAt: dataset.createdAt ? (
        <JaqpotTimeAgo date={new Date(dataset.createdAt as unknown as string)} />
      ) : (
        <div className="text-sm text-gray-500">-</div>
      ),
      executedAt: formatDateTime(
        dataset.executedAt as unknown as string | null,
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
        aria-label="Datasets table"
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
        topContent={
          data ? (
            <div className="flex items-center justify-between">
              <span className="text-small text-default-400">
                Total {data.totalElements ?? 0} dataset
                {data.totalElements === 1 ? '' : 's'}
              </span>
            </div>
          ) : null
        }
        bottomContent={
          data && (data.totalPages ?? 0) > 1 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={data.totalPages ?? 0}
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
          emptyContent={'No rows to display.'}
        >
          {(item) => (
            <TableRow key={(item as { key: number }).key}>
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
