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
import React, { useEffect, useState } from 'react';
import { ApiResponse } from '@/app/util/response';
import useSWR, { Fetcher } from 'swr';
import { CustomError } from '@/app/types/CustomError';
import SWRClientFetchError from '@/app/components/SWRClientFetchError';
import { Skeleton } from '@nextui-org/skeleton';
import { Link } from '@nextui-org/link';
import { Chip } from '@nextui-org/chip';
import {
  getDatasetStatusNode,
  generateResultTableRow,
} from '@/app/util/dataset';
import { Button } from '@nextui-org/button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';

interface PredictionResultProps {
  datasetId: string;
  model: ModelDto;
}

const fetcher: Fetcher<ApiResponse<DatasetDto>, string> = async (url) => {
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

export default function DatasetResults({
  datasetId,
  model,
}: PredictionResultProps) {
  // how often to refresh to check if the dataset is ready, setting to 0 will disable the interval
  const [refreshInterval, setRefreshInterval] = useState(1000);
  const allFeatures: FeatureDto[] = [
    ...model.independentFeatures,
    ...model.dependentFeatures,
  ];
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useSWR(`/api/datasets/${datasetId}`, fetcher, { refreshInterval });

  const dataset = apiResponse?.data;
  useEffect(() => {
    if (dataset?.status === 'SUCCESS' || dataset?.status === 'FAILURE') {
      setRefreshInterval(0);
    } else if (dataset?.status === 'EXECUTING') {
      setRefreshInterval(1000);
    }
  }, [dataset]);

  function downloadResultsCSV(model: ModelDto) {
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
      .catch((error) => console.error('Error:', error));
  }

  if (error) return <SWRClientFetchError error={error} />;

  const isLoaded =
    !isLoading &&
    dataset?.status !== 'CREATED' &&
    dataset?.status !== 'EXECUTING';
  const loadingState = isLoading ? 'loading' : 'idle';

  const tableHeaders = allFeatures.map((feature, index) => (
    <TableColumn key={index}>{feature.name}</TableColumn>
  ));

  function generateTableRows() {
    if (!dataset?.result) {
      return [];
    }

    return dataset?.result.map((result: any, resultIndex: number) => {
      const resultTableData = generateResultTableRow(
        model.independentFeatures,
        model.dependentFeatures,
        dataset,
        resultIndex,
        result,
      );
      return (
        <TableRow key={resultIndex}>
          {resultTableData.map((value, index) => (
            <TableCell key={index}>{value}</TableCell>
          ))}
        </TableRow>
      );
    });
  }

  const tableRows = generateTableRows();

  return (
    <div className="mt-5 flex flex-col gap-4">
      <h2 className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
        Result
      </h2>
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
              className="mb-2"
              onPress={() => downloadResultsCSV(model)}
            >
              Export CSV
            </Button>
          </div>
          <Table aria-label="Prediction table" className="mb-6">
            <TableHeader>{tableHeaders}</TableHeader>
            <TableBody loadingState={loadingState}>{tableRows}</TableBody>
          </Table>
        </>
      )}
    </div>
  );
}
