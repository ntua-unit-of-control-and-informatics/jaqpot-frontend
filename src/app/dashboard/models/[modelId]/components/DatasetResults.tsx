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
  generateResultTableRow,
  JAQPOT_METADATA_KEY,
  JAQPOT_ROW_LABEL_KEY,
} from '@/app/util/dataset';
import { Button } from '@nextui-org/button';
import { ArrowDownTrayIcon, BugAntIcon } from '@heroicons/react/24/solid';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { logger } from '@/logger';
import { Tab, Tabs } from '@nextui-org/tabs';
import DoaCards from '@/app/dashboard/models/[modelId]/components/DoaCards';

const log = logger.child({ module: 'dataset' });

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
      .catch((error) => log.error('Error:', error));
  }

  const hasProbabilities = useMemo(() => {
    return (
      dataset?.result?.some((resultRow) => {
        const jaqpotInternalMetadata = (resultRow as any)[JAQPOT_METADATA_KEY];
        return !!jaqpotInternalMetadata?.probabilities;
      }) ?? false
    );
  }, [dataset]);

  if (error) return <SWRClientFetchError error={error} />;

  const isLoaded =
    !isLoading &&
    dataset?.status !== 'CREATED' &&
    dataset?.status !== 'EXECUTING';
  const loadingState = isLoading ? 'loading' : 'idle';

  const tableHeaders = allFeatures.map((feature, index) => (
    <TableColumn key={index}>{feature.name}</TableColumn>
  ));

  if (hasProbabilities) {
    tableHeaders.push(
      <TableColumn key="probabilities">Probabilities</TableColumn>,
    );
  }

  if (
    dataset?.input.find(
      (inputRow) => (inputRow as any)[JAQPOT_ROW_LABEL_KEY] !== undefined,
    )
  ) {
    tableHeaders.push(
      <TableColumn key="jaqpotRowLabel">Jaqpot Row Label</TableColumn>,
    );
  }

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
    <Tabs className="mb-2 mt-10">
      <Tab key={'result'} title="Result">
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
                  onPress={() => downloadResultsCSV(model)}
                >
                  Export CSV
                </Button>
              </div>
              <Table aria-label="Prediction table" className="mb-6">
                <TableHeader>{tableHeaders}</TableHeader>
                <TableBody
                  loadingState={loadingState}
                  emptyContent={'No results to display.'}
                >
                  {tableRows}
                </TableBody>
              </Table>
            </>
          )}
        </div>
      </Tab>
      <Tab
        key={'doa'}
        title="Domain of Applicability"
        disabled={dataset?.status !== 'SUCCESS'}
      >
        {dataset?.result?.flatMap((result: any, resultIndex: number) => {
          return <DoaCards result={result} />;
        })}
      </Tab>
    </Tabs>
  );
}
