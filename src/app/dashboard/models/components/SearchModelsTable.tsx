'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { Pagination } from '@nextui-org/pagination';
import { ModelsResponseDto, ModelSummaryDto } from '@/app/api.types';
import useSWR from 'swr';
import { Spinner } from '@nextui-org/spinner';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SWRClientFetchError from '@/app/components/SWRClientFetchError';
import { JaqpotCustomError } from '@/app/types/jaqpot-custom-error';
import { ApiResponse } from '@/app/util/response';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';

const fetchWithQueryParams = async (
  url: string,
  query: string | null,
  page: number,
): Promise<ApiResponse<ModelsResponseDto>> => {
  if (!query) {
    return { success: true, data: {} };
  }

  const res = await fetch(
    `${url}?${new URLSearchParams({ query, page: page.toString() })}`,
  );

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const message = (await res.json()).message;
    const status = res.status;
    // Attach extra info to the error object.
    throw new JaqpotCustomError(message, status);
  }

  return res.json();
};

interface ModelsTableProps {
  modelsEndpoint: string;
}

export default function SearchModelsTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState<string | null>(
    searchParams.get('query') || '',
  );
  const [inputValue, setInputValue] = useState<string>(
    searchParams.get('query') || '',
  );
  const [page, setPage] = useState(
    (searchParams.get('page') && parseInt(searchParams.get('page')!)) || 1,
  );

  const {
    data: apiResponse,
    error,
    isLoading,
  } = useSWR([`/api/models/search`, query, page], ([url, query, page]) =>
    fetchWithQueryParams(url, query, page - 1),
  );

  const createQueryString = useCallback(
    (queryParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(queryParams).forEach(([key, value]) => {
        params.set(key, value);
      });

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    setQuery(searchParams.get('query'));
    setPage(
      (searchParams.get('page') && parseInt(searchParams.get('page')!)) || 1,
    );
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(
      pathname + '?' + createQueryString({ query: inputValue, page: '1' }),
    );
  };

  let data;
  if (apiResponse?.success) {
    data = apiResponse?.data;
  }

  const loadingState = isLoading ? 'loading' : 'idle';

  if (error) return <SWRClientFetchError error={error} />;
  if (isLoading) return <Spinner />;
  return (
    <>
      <form
        className="mb-10 flex flex-row items-center gap-5"
        onSubmit={handleSubmit}
      >
        <Input
          label="Search term"
          defaultValue={query || ''}
          value={inputValue}
          onValueChange={setInputValue}
          className="max-w-sm"
        ></Input>
        <Button color="primary" type="submit" isLoading={isLoading}>
          Search
        </Button>
      </form>

      <Table
        aria-label="Models search table"
        topContent={
          data ? (
            <div className="flex justify-between items-center">
              <span className="text-small text-default-400">
                Total {data.totalElements} model{data.totalElements === 1 ? '' : 's'}
              </span>
            </div>
          ) : null
        }
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
                onChange={(page) =>
                  router.push(
                    pathname +
                      '?' +
                      createQueryString({
                        query: inputValue,
                        page: page.toString(),
                      }),
                  )
                }
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
          <TableColumn key="creator">Creator</TableColumn>
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
              <TableCell>
                <div className="sm:min-w-80">{item.name}</div>
              </TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>
                <div className="line-clamp-2">{item.description}</div>
              </TableCell>
              <TableCell>{item.independentFeaturesLength}</TableCell>
              <TableCell>{item.dependentFeaturesLength}</TableCell>
              <TableCell>{item.visibility}</TableCell>
              <TableCell>{item.creator?.username}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
