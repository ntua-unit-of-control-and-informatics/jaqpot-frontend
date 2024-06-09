'use client';

import { useMemo, useState } from 'react';
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
import { auth } from '@/auth';
import toast from 'react-hot-toast';
import { getKeyValue } from '@nextui-org/react';
import useSWR from 'swr';
import { Spinner } from '@nextui-org/spinner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function useModelsPage(page: number) {
  const { data, error, isLoading } = useSWR(
    `/api/models?page=${page}`,
    fetcher,
  );

  return {
    data,
    isLoading,
    isError: error,
  };
}

export default function ModelsTable() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useModelsPage(page - 1);

  const loadingState =
    isLoading || data?.content.length === 0 ? 'loading' : 'idle';

  return (
    <Table
      aria-label="Example table with client async pagination"
      bottomContent={
        data?.totalPages > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={data?.totalPages}
              onChange={(page) => setPage(page)}
            />
          </div>
        ) : null
      }
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
