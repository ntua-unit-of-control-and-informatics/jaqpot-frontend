'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { SearchIcon } from '@nextui-org/shared-icons';
import { useEffect, useState } from 'react';
import { ModelDto, ModelsResponseDto } from '@/app/api.types';
import useDebouncedState from '@/app/util/debounce';
import useSWR, { Fetcher } from 'swr';
import toast from 'react-hot-toast';
import { ApiResponse, handleApiResponse } from '@/app/util/response';
import { CustomError } from '@/app/types/CustomError';
import { useRouter } from 'next/navigation';
import { Key } from '@react-types/shared';
import { KeyboardEvent } from '@react-types/shared/src/events';
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
    throw new CustomError(message, status);
  }

  return res.json();
};

// TODO update when https://github.com/nextui-org/nextui/issues/2962 is fixed
export default function SearchBar() {
  const router = useRouter();
  const [query, debouncedQuery, setQuery] = useDebouncedState<string>('', 1000);
  const [page, setPage] = useState(1);

  const {
    data: apiResponse,
    error,
    isLoading,
  } = useSWR(
    [`/api/models/search`, debouncedQuery, page - 1],
    ([url, query, page]) => fetchWithQueryParams(url, query, page),
  );

  useEffect(() => {
    if (apiResponse?.data?.content?.length === 0) {
      toast('No results found', { duration: 2000 });
    }
  }, [apiResponse]);

  function onSelectionChange(modelId: Key | null) {
    if (modelId !== null) {
      router.push(`/dashboard/models/${modelId}`);
    }
  }

  function onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      router.push(
        `/dashboard/models/search?${new URLSearchParams({ query, page: '1' })}`,
      );
    }
  }

  if (error) return;

  return (
    <div className="flex flex-1 flex-row items-center">
      <Autocomplete
        aria-label="Search models"
        items={apiResponse?.data?.content || []}
        isLoading={isLoading}
        placeholder="Search models"
        labelPlacement="outside"
        selectorIcon={isLoading && <></>}
        className="max-w-xl flex-1"
        disableSelectorIconRotation
        onKeyDown={onKeyDown}
        onInputChange={setQuery}
        onSelectionChange={onSelectionChange}
        allowsCustomValue={true}
        isClearable={false}
        inputProps={{
          classNames: {
            input: 'ml-1',
            inputWrapper:
              'bg-transparent p-0 shadow-none text-gray-400 hover:bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent',
          },
        }}
        listboxProps={{
          bottomContent: (
            <Button
              color="primary"
              className="max-w-1/2"
              onPress={() =>
                router.push(
                  `/dashboard/models/search?${new URLSearchParams({ query, page: '1' })}`,
                )
              }
            >
              Advanced search...
            </Button>
          ),
        }}
        popoverProps={{
          classNames: {
            content: 'min-w-72',
          },
        }}
        startContent={
          <MagnifyingGlassIcon className="size-6 min-w-5 text-gray-400" />
        }
      >
        {(item) => (
          <AutocompleteItem key={item.id!.toString()}>
            {item.name}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}
