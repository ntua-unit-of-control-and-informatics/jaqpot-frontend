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
import {
  DatasetDto,
  DatasetsResponseDto,
  ModelDto,
  ModelsResponseDto,
} from '@/app/api.types';
import useSWR, { Fetcher } from 'swr';
import { Spinner } from '@nextui-org/spinner';
import { useRouter } from 'next/navigation';
import SWRClientFetchError from '@/app/components/SWRClientFetchError';
import { CustomError } from '@/app/types/CustomError';
import { ApiResponse } from '@/app/util/response';
import { Link } from '@nextui-org/link';
import JaqpotTimeAgo from '@/app/dashboard/models/[modelId]/components/TimeAgo';

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

function useDatasetsPage(page: number) {
  const {
    data: apiResponse,
    error,
    isLoading,
  } = useSWR(`/api/user/datasets?page=${page}`, fetcher);

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

export default function DatasetsTable() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useDatasetsPage(page - 1);

  const loadingState = isLoading ? 'loading' : 'idle';

  if (error) return <SWRClientFetchError error={error} />;
  if (isLoading) return <Spinner />;
  return (
    <Table
      aria-label="Datasets table"
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
        <TableColumn key="id">ID</TableColumn>
        <TableColumn key="model">Model</TableColumn>
        <TableColumn key="input">Input</TableColumn>
        <TableColumn key="executedAt">Executed at</TableColumn>
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
              <Link showAnchorIcon href={`/datasets/${item.id}`}>
                {item.id}
              </Link>
            </TableCell>
            <TableCell>
              <Link showAnchorIcon href={`/models/${item.modelId}`}>
                {item.modelId}
              </Link>
            </TableCell>
            <TableCell>
              <div className="max-h-28 max-w-52 overflow-hidden text-ellipsis whitespace-nowrap">
                {JSON.stringify(item.input)}
              </div>
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
