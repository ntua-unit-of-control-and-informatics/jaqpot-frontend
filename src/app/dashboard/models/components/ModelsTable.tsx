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
import { ModelDto, ModelsResponseDto } from '@/app/api.types';
import useSWR, { Fetcher } from 'swr';
import { Spinner } from '@nextui-org/spinner';
import { useRouter } from 'next/navigation';
import SWRClientFetchError from '@/app/components/SWRClientFetchError';
import { CustomError } from '@/app/types/CustomError';
import { ApiResponse } from '@/app/util/response';

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

function useModelsPage(page: number, modelsEndpoint: string) {
  const {
    data: apiResponse,
    error,
    isLoading,
  } = useSWR(`${modelsEndpoint}?page=${page}`, fetcher);

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
}

export default function ModelsTable({ modelsEndpoint }: ModelsTableProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useModelsPage(page - 1, modelsEndpoint);

  const loadingState = isLoading ? 'loading' : 'idle';

  if (error) return <SWRClientFetchError error={error} />;
  if (isLoading) return <Spinner />;
  return (
    <Table
      aria-label="Models table"
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
        <TableColumn key="name">Name</TableColumn>
        <TableColumn key="type">Type</TableColumn>
        <TableColumn key="description">Description</TableColumn>
        <TableColumn key="independentLength">
          Independent Features length
        </TableColumn>
        <TableColumn key="dependentLength">
          Dependent Features length
        </TableColumn>

        <TableColumn key="visibility">Visibility</TableColumn>
      </TableHeader>
      <TableBody
        items={data?.content ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
        emptyContent={'No rows to display.'}
      >
        {(item: ModelDto) => (
          <TableRow
            key={item?.id}
            className="cursor-pointer hover:bg-indigo-100"
            onClick={() => router.push(`/dashboard/models/${item.id}`)}
          >
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>{item.independentFeatures.length}</TableCell>
            <TableCell>{item.dependentFeatures.length}</TableCell>
            <TableCell>{item.visibility}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
