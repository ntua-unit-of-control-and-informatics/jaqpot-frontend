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
    const message = (await res.json()).message;
    const status = res.status;
    if (status >= 500) {
      log.error(message);
    }
  } else {
    return res.json();
  }
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
  } = useSWR([model.id!.toString(), page], ([modelId, page]) =>
    fetchDatasets(modelId, page - 1),
  );

  if (error) return <SWRClientFetchError error={error} />;
  if (isLoading) return <Spinner />;

  const data = apiResponse.data;
  const rows = data.content?.map((dataset: DatasetDto) => ({
    key: dataset.id,
    name: dataset.name ?? dataset.id,
  }));

  return (
    <div className="flex flex-row gap-5">
      <div className="flex max-w-48 flex-col gap-3">
        <Button
          color="primary"
          onPress={async () => {
            const datasetDto: DatasetDto = {
              type: 'CHAT',
              input: [],
              entryType: 'ARRAY',
            };
            const res = await fetch(`/api/user/models/${model.id}/datasets`, {
              method: 'POST',
              body: JSON.stringify(datasetDto),
            });
            const { data } = await res.json();
            router.push(`${pathnameWithoutDatasetId}/${data.id}`);
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
          className="flex-shrink"
          align="center"
          bottomContent={
            data?.totalPages ?? 0 > 0 ? (
              <Pagination
                isCompact
                showShadow
                showControls
                siblings={1}
                boundaries={1}
                color="primary"
                page={page}
                total={data.totalPages ?? 0}
                onChange={(page) => setPage(page)}
              />
            ) : null
          }
        >
          <TableHeader>
            <TableColumn>Older chats</TableColumn>
          </TableHeader>
          <TableBody items={rows}>
            {(item: any) => (
              <TableRow key={item.key} className={'cursor-pointer'}>
                {(columnKey) => <TableCell>{item.name}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <LLMForm model={model} datasetId={params.datasetId} />
    </div>
  );
}
