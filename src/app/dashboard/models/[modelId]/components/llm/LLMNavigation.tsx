import { Tab, Tabs } from '@nextui-org/tabs';
import { LLMForm } from '@/app/dashboard/models/[modelId]/components/llm/LLMForm';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { DatasetDto, ModelDto, ModelsResponseDto } from '@/app/api.types';
import useSWR from 'swr';
import React, { useState } from 'react';
import { ApiResponse } from '@/app/util/response';
import { logger } from '@/logger';
import { Spinner } from '@nextui-org/spinner';
import SWRClientFetchError from '@/app/components/SWRClientFetchError';
import { Pagination } from '@nextui-org/pagination';
import { Card } from '@nextui-org/react';
import { Link } from '@nextui-org/link';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { Button } from '@nextui-org/button';

interface LLMTabsProps {
  model: ModelDto;
  datasetId?: string;
}

const log = logger.child({ module: 'LLMNavigation' });

const fetchDatasets = async (modelId: string, page: number) => {
  const res = await fetch(
    `/api/user/models/${modelId}/datasets?${new URLSearchParams({ page: page.toString() })}`,
  );

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(
        'You are not logged in. Please log in to access this page.',
      );
    } else if (res.status === 403) {
      throw new Error('You do not have permission to access this page.');
    } else {
      throw new Error('Unknown error occurred.');
    }
  }

  return res.json();
};

export default function LLMNavigation({ model }: LLMTabsProps) {
  const params = useParams<{ datasetId: string }>();
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    params.datasetId ? new Set([params.datasetId]) : new Set<string>(),
  );

  const router = useRouter();
  const pathname = usePathname();
  const pathnameWithoutDatasetId =
    pathname.substring(0, pathname.lastIndexOf('/chat')) + '/chat';
  const [page, setPage] = useState(1);
  const {
    data: apiResponse,
    error,
    isLoading,
  } = useSWR(
    [model.id!.toString(), page],
    ([modelId, page]) => fetchDatasets(modelId, page - 1),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  if (error) return <SWRClientFetchError error={error} />;
  if (isLoading) return <Spinner />;

  const data = apiResponse?.data;
  const rows = data.content?.map((dataset: DatasetDto) => ({
    key: dataset.id,
    name: dataset.name ?? dataset.id,
  }));

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-[auto_1fr]">
      <div className="order-last flex w-full flex-col gap-3 sm:order-first sm:w-48">
        <Button
          color="primary"
          onPress={async () => {
            router.push(`${pathnameWithoutDatasetId}/new`);
          }}
        >
          Start new chat
        </Button>
        <Table
          aria-label="Example table with dynamic content"
          selectedKeys={selectedKeys}
          onSelectionChange={(keys) => {
            router.push(`${pathnameWithoutDatasetId}/${[...keys][0]}`);
          }}
          selectionMode="single"
          align="center"
          bottomContent={
            data?.totalPages ?? 0 > 0 ? (
              <>
                <Pagination
                  isCompact
                  showShadow
                  siblings={1}
                  boundaries={1}
                  color="primary"
                  page={page}
                  total={data.totalPages ?? 0}
                  onChange={(page) => setPage(page)}
                />
                <div className="flex justify-center gap-2">
                  <Button
                    color="secondary"
                    size="sm"
                    variant="flat"
                    isDisabled={page === 1}
                    onPress={() =>
                      setPage((prev) => (prev > 1 ? prev - 1 : prev))
                    }
                  >
                    Previous
                  </Button>
                  <Button
                    color="secondary"
                    size="sm"
                    variant="flat"
                    isDisabled={page >= data.totalPages}
                    onPress={() =>
                      setPage((prev) => (prev < 10 ? prev + 1 : prev))
                    }
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn>Older chats</TableColumn>
          </TableHeader>
          <TableBody items={rows}>
            {(item: any) => (
              <TableRow key={item.key} className={'cursor-pointer'}>
                {(columnKey) => (
                  <TableCell>
                    <div className="line-clamp-2">{item.name}</div>
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="order-first sm:order-last">
        <LLMForm model={model} datasetId={params.datasetId} />
      </div>
    </div>
  );
}
