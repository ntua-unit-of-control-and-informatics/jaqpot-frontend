'use client';

import { DatasetDto, FeatureDto, ModelDto } from '@/app/api.types';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiResponse } from '@/app/util/response';
import useSWR, { Fetcher } from 'swr';
import { CustomError } from '@/app/types/CustomError';
import SWRClientFetchError from '@/app/components/SWRClientFetchError';
import { Skeleton } from '@nextui-org/skeleton';
import { Link } from '@nextui-org/link';
import {
  getDatasetStatusNode,
  generateResultTableData,
  ResultTableRow,
  datasetFetcher,
  ResultTableData,
} from '@/app/util/dataset';
import { Button } from '@nextui-org/button';
import {
  ArrowDownTrayIcon,
  BugAntIcon,
  EyeIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { logger } from '@/logger';
import {
  getKeyValue,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react';
import DoaTableCell from '@/app/dashboard/models/[modelId]/components/DoaTableCell';
import FeatureEditModal from '@/app/dashboard/models/[modelId]/components/FeatureEditModal';
import DoaModal from '@/app/dashboard/models/[modelId]/components/DoaModal';
import { Tab, Tabs } from '@nextui-org/tabs';
import PBPKPlots from '@/app/dashboard/models/[modelId]/components/PBPKPlots';
import { Pagination } from '@nextui-org/pagination';
import { Input } from '@nextui-org/input';

const log = logger.child({ module: 'dataset' });

interface PredictionResultProps {
  datasetId: string;
  model: ModelDto;
}

function downloadResultsCSV(model: ModelDto, dataset: DatasetDto) {
  fetch(`/api/datasets/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      independentFeatures: model.independentFeatures,
      dependentFeatures: model.dependentFeatures,
      dataset,
    }),
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `result-${dataset!.id}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch((error) => log.error('Error:', error));
}

export default function DatasetResults({
  datasetId,
  model,
}: PredictionResultProps) {
  // how often to refresh to check if the dataset is ready, setting to 0 will disable the interval
  const [refreshInterval, setRefreshInterval] = useState(1000);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useSWR(`/api/datasets/${datasetId}`, datasetFetcher, { refreshInterval });

  const {
    isOpen: isDoaModalOpen,
    onOpen: onDoaModalOpen,
    onOpenChange: onDoaModalChange,
  } = useDisclosure();
  const [selectedRow, setSelectedRow] = useState<any | undefined>();

  useEffect(() => {
    if (!isDoaModalOpen) {
      setSelectedRow(undefined);
    }
  }, [isDoaModalOpen]);

  const dataset = apiResponse?.data;
  useEffect(() => {
    if (dataset?.status === 'SUCCESS' || dataset?.status === 'FAILURE') {
      setRefreshInterval(0);
    } else if (dataset?.status === 'EXECUTING') {
      setRefreshInterval(1000);
    }
  }, [dataset]);

  const isLoaded =
    !isLoading &&
    dataset?.status !== 'CREATED' &&
    dataset?.status !== 'EXECUTING';
  const loadingState = isLoading ? 'loading' : 'idle';

  const resultTableData = useMemo(
    () =>
      generateResultTableData(
        model.independentFeatures,
        model.dependentFeatures,
        dataset,
      ),
    [model, dataset],
  );

  const onRowsPerPageChange = useCallback((e: React.ChangeEvent<any>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {resultTableData.rows.length} result
            {resultTableData.rows.length === 1 ? '' : 's'}
          </span>

          <Select
            label="Rows per page"
            className="max-w-xs"
            onChange={onRowsPerPageChange}
            selectedKeys={[rowsPerPage.toString()]}
          >
            <SelectItem key="10">10</SelectItem>
            <SelectItem key="25">25</SelectItem>
            <SelectItem key="50">50</SelectItem>
            <SelectItem key="100">100</SelectItem>
          </Select>
        </div>
      </div>
    );
  }, [resultTableData, rowsPerPage]);

  const pages = Math.ceil(resultTableData.rows.length / rowsPerPage);

  const rows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return resultTableData.rows.slice(start, end);
  }, [page, resultTableData, rowsPerPage]);

  if (error) return <SWRClientFetchError error={error} />;

  return (
    <div className="mb-20 mt-5">
      <Tabs>
        <Tab key="result" title="Result">
          <div className="flex flex-col gap-4">
            {dataset?.status === 'FAILURE' && model.isAdmin && (
              <div className="max-w-xl">
                <Accordion>
                  <AccordionItem
                    key="1"
                    aria-label="Accordion 1"
                    subtitle="You can only see this if you are a nerd"
                    title="Data for nerds"
                    startContent={<BugAntIcon className="size-6" />}
                  >
                    <p className="text-sm">
                      legacy prediction service: {model.legacyPredictionService}
                    </p>
                    <p className="text-sm">
                      Failure reason: {dataset?.failureReason}
                    </p>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
            <div>
              <Link
                href={`/dashboard/models/${model.id}/results/${datasetId}`}
                isExternal
                showAnchorIcon
                className="mr-2"
              >
                ID {datasetId}
              </Link>
              {getDatasetStatusNode(dataset)}
            </div>
            {!isLoaded && (
              <div className="flex w-full flex-col gap-2">
                <Skeleton className="h-3 w-3/5 rounded-lg" />
                <Skeleton className="h-3 w-4/5 rounded-lg" />
                <Skeleton className="h-3 w-2/5 rounded-lg" />
                <Skeleton className="w-5/5 h-3 rounded-lg" />
              </div>
            )}
            {isLoaded && dataset?.status === 'SUCCESS' && (
              <>
                <div>
                  <Button
                    color="primary"
                    startContent={<ArrowDownTrayIcon className="size-6" />}
                    className="my-2"
                    onPress={() => downloadResultsCSV(model, dataset)}
                  >
                    Export CSV
                  </Button>
                </div>
                <Table
                  aria-label="Prediction table"
                  className="mb-6"
                  topContent={topContent}
                  bottomContent={
                    <div className="flex w-full justify-center">
                      <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                      />
                    </div>
                  }
                >
                  <TableHeader columns={resultTableData?.headers}>
                    {(column) => (
                      <TableColumn key={column.key}>{column.label}</TableColumn>
                    )}
                  </TableHeader>

                  <TableBody
                    items={rows}
                    loadingState={loadingState}
                    emptyContent={'No results to display.'}
                  >
                    {(item) => (
                      <TableRow key={item.key}>
                        {(columnKey) => {
                          if (columnKey === 'doa') {
                            return (
                              <TableCell>
                                <DoaTableCell
                                  value={getKeyValue(item, columnKey)}
                                  onPress={() => {
                                    setSelectedRow(item);
                                    onDoaModalOpen();
                                  }}
                                />
                              </TableCell>
                            );
                          }
                          return (
                            <TableCell>
                              {getKeyValue(item, columnKey)}
                            </TableCell>
                          );
                        }}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </>
            )}

            {selectedRow && (
              <DoaModal
                doaDetails={selectedRow.doaDetails}
                isOpen={isDoaModalOpen}
                onOpenChange={onDoaModalChange}
              />
            )}
          </div>
        </Tab>
        {model.type === 'R_PBPK' && dataset && dataset.status === 'SUCCESS' && (
          <Tab key="plots" title="Plots">
            <PBPKPlots model={model} dataset={dataset} />
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
