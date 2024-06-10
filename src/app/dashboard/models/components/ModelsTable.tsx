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
import ClientFetchError from '@/app/components/ClientFetchError';
import { CustomError } from '@/app/types/CustomError';

const fetcher: Fetcher<ModelsResponseDto, string> = async (url) => {
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

function useModelsPage(page: number) {
  const { data, error, isLoading } = useSWR(
    `/api/models?page=${page}`,
    fetcher,
  );

  return {
    data,
    isLoading,
    error,
  };
}

export default function ModelsTable() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useModelsPage(page - 1);

  const loadingState = isLoading ? 'loading' : 'idle';

  if (error) return <ClientFetchError error={error} />;
  if (isLoading) return <Spinner />;
  return (
    <Table
      aria-label="Example table with client async pagination"
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
      className="max-w-3xl mx-auto"
    >
      <TableHeader>
        <TableColumn key="name">Name</TableColumn>
        <TableColumn key="type">Type</TableColumn>
        <TableColumn key="visibility">Visibility</TableColumn>
      </TableHeader>
      <TableBody
        items={data?.content ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
      >
        {(item: ModelDto) => (
          <TableRow
            key={item?.name}
            className="cursor-pointer hover:bg-indigo-100"
            onClick={() => router.push(`/dashboard/models/${item.id}`)}
          >
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.visibility}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
