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
import { ModelDto, ModelsResponseDto, ModelSummaryDto } from '@/app/api.types';
import useSWR, { Fetcher } from 'swr';
import { Spinner } from '@nextui-org/spinner';
import { useRouter } from 'next/navigation';
import SWRClientFetchError from '@/app/components/SWRClientFetchError';
import { CustomError } from '@/app/types/CustomError';
import { ApiResponse } from '@/app/util/response';
import { SortDescriptor } from '@react-types/shared/src/collections';
import { convertSortDirection, SORT_DELIMITER } from '@/app/util/sort';
import JaqpotTimeAgo from '@/app/dashboard/models/[modelId]/components/JaqpotTimeAgo';

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

function useModelsPage(page: number, sort: string[], modelsEndpoint: string) {
  const queryParams = new URLSearchParams({ page: page.toString() });
  sort.forEach((s) => queryParams.append('sort', s));

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
}

export default function ModelsTable({ modelsEndpoint }: ModelsTableProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  const [sort, setSort] = useState<string[]>([]);

  const { data, isLoading, error } = useModelsPage(
    page - 1,
    sort,
    modelsEndpoint,
  );

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
      <TableHeader>
        <TableColumn key="name" allowsSorting>
          Name
        </TableColumn>
        <TableColumn key="type" allowsSorting>
          Type
        </TableColumn>
        <TableColumn key="description">Description</TableColumn>
        <TableColumn key="independentLength">
          Independent Features length
        </TableColumn>
        <TableColumn key="dependentLength">
          Dependent Features length
        </TableColumn>
        <TableColumn key="visibility" allowsSorting>
          Visibility
        </TableColumn>
        <TableColumn key="createdAt" allowsSorting>
          Created at
        </TableColumn>
      </TableHeader>
      <TableBody
        items={data?.content ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
        emptyContent={'No rows to display.'}
      >
        {(item: ModelSummaryDto) => (
          <TableRow
            key={item?.id}
            className="cursor-pointer hover:bg-indigo-100"
            onClick={() => router.push(`/dashboard/models/${item.id}`)}
          >
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>
              <div className="max-h-28 max-w-52 overflow-hidden text-ellipsis whitespace-nowrap">
                {item.description}
              </div>
            </TableCell>
            <TableCell>{item.independentFeaturesLength}</TableCell>
            <TableCell>{item.dependentFeaturesLength}</TableCell>
            <TableCell>{item.visibility}</TableCell>
            <TableCell>
              <JaqpotTimeAgo
                date={new Date(item.createdAt as unknown as string)}
              />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
