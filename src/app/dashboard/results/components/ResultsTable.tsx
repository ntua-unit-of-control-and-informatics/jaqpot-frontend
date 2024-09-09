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
import { DatasetDto, DatasetsResponseDto } from '@/app/api.types';
import useSWR, { Fetcher } from 'swr';
import { Spinner } from '@nextui-org/spinner';
import { useRouter } from 'next/navigation';
import SWRClientFetchError from '@/app/components/SWRClientFetchError';
import { CustomError } from '@/app/types/CustomError';
import { ApiResponse } from '@/app/util/response';
import { Link } from '@nextui-org/link';
import JaqpotTimeAgo from '@/app/dashboard/models/[modelId]/components/JaqpotTimeAgo';
import { getDatasetStatusNode } from '@/app/util/dataset';
import { SortDescriptor } from '@react-types/shared/src/collections';
import { convertSortDirection, SORT_DELIMITER } from '@/app/util/sort';

const fetcher: Fetcher<ApiResponse<DatasetsResponseDto>, string> = async (
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

function useDatasetsPage(page: number, sort: string[]) {
  const queryParams = new URLSearchParams({ page: page.toString() });
  sort.forEach((s) => queryParams.append('sort', s));
  const {
    data: apiResponse,
    error,
    isLoading,
  } = useSWR(`/api/user/datasets?${queryParams}`, fetcher);

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

export default function ResultsTable() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  const [sort, setSort] = useState<string[]>([]);

  const { data, isLoading, error } = useDatasetsPage(page - 1, sort);

  async function onSortChange({ column, direction }: SortDescriptor) {
    setSortDescriptor({ column, direction });
    setSort([
      `${column}${SORT_DELIMITER}${convertSortDirection(direction ?? '')}`,
    ]);
  }

  const loadingState = isLoading ? 'loading' : 'idle';

  if (error) return <SWRClientFetchError error={error} />;
  if (isLoading) return <Spinner />;
  return (
    <Table
      aria-label="Results table"
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
      <TableHeader>
        <TableColumn key="id" allowsSorting>
          ID
        </TableColumn>
        <TableColumn key="model" allowsSorting>
          Model
        </TableColumn>
        <TableColumn key="status" allowsSorting>
          Status
        </TableColumn>
        <TableColumn key="input">Input</TableColumn>
        <TableColumn key="executedAt" allowsSorting>
          Executed at
        </TableColumn>
      </TableHeader>
      <TableBody
        items={data?.content ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
        emptyContent={'No rows to display.'}
      >
        {(item: DatasetDto) => (
          <TableRow
            key={item?.id}
            className="cursor-pointer hover:bg-indigo-100"
          >
            <TableCell>
              <Link
                isExternal
                showAnchorIcon
                href={`/dashboard/models/${item.modelId}/results/${item.id}`}
              >
                {item.id}
              </Link>
            </TableCell>
            <TableCell>
              <Link
                isExternal
                showAnchorIcon
                href={`/dashboard/models/${item.modelId}`}
              >
                {item.modelName}
              </Link>
            </TableCell>
            <TableCell>{getDatasetStatusNode(item)}</TableCell>
            <TableCell>
              <div className="line-clamp-2">{JSON.stringify(item.input)}</div>
            </TableCell>
            <TableCell>
              {item.executedAt && (
                <JaqpotTimeAgo
                  date={new Date(item.executedAt as unknown as string)}
                />
              )}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
