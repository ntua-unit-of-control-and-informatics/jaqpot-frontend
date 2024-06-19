'use client';

import {
  DataEntryDto,
  DatasetDto,
  FeatureDto,
  ModelDto,
  ModelsResponseDto,
} from '@/app/api.types';
import { Spinner } from '@nextui-org/spinner';
import Alert from '@/app/components/Alert';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ApiResponse } from '@/app/util/response';
import useSWR, { Fetcher } from 'swr';
import { CustomError } from '@/app/types/CustomError';
import SWRClientFetchError from '@/app/components/SWRClientFetchError';
import { Skeleton } from '@nextui-org/skeleton';
import { Link } from '@nextui-org/link';
import { Chip } from '@nextui-org/chip';

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
  console.log(refreshInterval);
  const allFeatures: FeatureDto[] = [
    ...model.independentFeatures,
    ...model.dependentFeatures,
  ];
  const { data, isLoading, error } = useSWR(
    `/api/datasets/${datasetId}`,
    fetcher,
    { refreshInterval },
  );

  const dataset = data?.data;
  const isLoaded =
    !isLoading &&
    dataset?.status !== 'CREATED' &&
    dataset?.status !== 'EXECUTING';
  const loadingState = isLoading ? 'loading' : 'idle';

  useEffect(() => {
    if (dataset?.status === 'SUCCESS' || dataset?.status === 'FAILURE') {
      setRefreshInterval(0);
    } else if (dataset?.status === 'EXECUTING') {
      setRefreshInterval(1000);
    }
  }, [dataset]);

  const tableHeaders = allFeatures.map((feature, index) => (
    <TableColumn key={index}>{feature.name}</TableColumn>
  ));

  function generateTableRows() {
    if (!dataset?.results) {
      return [];
    }

    return dataset?.results?.map(
      (result: DataEntryDto, resultsIndex: number) => {
        const independentFeatureCellValues = model.independentFeatures.map(
          (feature, independentFeatureIndex) => {
            const cellValue = dataset.input[resultsIndex].values[
              independentFeatureIndex
            ] as string;
            return cellValue;
          },
        );

        const dependentFeatureCellValues = model.dependentFeatures.map(
          (feature, index) => {
            const cellValue = (result.values[resultsIndex] as any)[
              feature.name
            ] as string;
            return cellValue;
          },
        );
        return (
          <TableRow key={resultsIndex}>
            {[
              ...independentFeatureCellValues,
              ...dependentFeatureCellValues,
            ].map((value, index) => (
              <TableCell key={index}>{value}</TableCell>
            ))}
          </TableRow>
        );
      },
    );
  }

  function showDatasetStatus() {
    if (!dataset) {
      return <></>;
    } else if (dataset?.status === 'SUCCESS') {
      return (
        <Chip color="success" variant="flat">
          Success
        </Chip>
      );
    } else if (dataset?.status === 'FAILURE') {
      return (
        <Chip color="danger" variant="flat">
          Failed
        </Chip>
      );
    } else {
      return <Chip color="primary">In progress</Chip>;
    }
  }

  const tableRows = generateTableRows();

  if (error) return <SWRClientFetchError error={error} />;

  return (
    <div className="mt-5 flex flex-col gap-4">
      <h2 className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
        Result
      </h2>
      <div>
        <Link
          href={`/dashboard/models/${model.id}/datasets/${datasetId}`}
          isExternal
          showAnchorIcon
          className="mr-2"
        >
          ID {datasetId}
        </Link>
        {showDatasetStatus()}
      </div>
      {!isLoaded && (
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-3 w-3/5 rounded-lg" />
          <Skeleton className="h-3 w-4/5 rounded-lg" />
          <Skeleton className="h-3 w-2/5 rounded-lg" />
          <Skeleton className="h-3 w-5/5 rounded-lg" />
        </div>
      )}
      {isLoaded && dataset?.status === 'SUCCESS' && (
        <Table aria-label="Prediction table">
          <TableHeader>{tableHeaders}</TableHeader>
          <TableBody loadingState={loadingState}>{tableRows}</TableBody>
        </Table>
      )}
    </div>
  );
}
