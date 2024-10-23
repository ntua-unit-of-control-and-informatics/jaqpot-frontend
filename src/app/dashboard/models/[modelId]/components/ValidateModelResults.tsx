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
import React, { useEffect, useMemo, useState } from 'react';
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
import { getKeyValue, useDisclosure } from '@nextui-org/react';
import DoaTableCell from '@/app/dashboard/models/[modelId]/components/DoaTableCell';
import FeatureEditModal from '@/app/dashboard/models/[modelId]/components/FeatureEditModal';
import DoaModal from '@/app/dashboard/models/[modelId]/components/DoaModal';

const log = logger.child({ module: 'dataset' });

interface ValidateModelResultsProps {
  datasetId: string;
  model: ModelDto;
}

export default function ValidateModelResults({
  datasetId,
  model,
}: ValidateModelResultsProps) {
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
  } = useSWR(`/api/datasets/${datasetId}`, datasetFetcher, { refreshInterval });

  const dataset = apiResponse?.data;
  useEffect(() => {
    if (dataset?.status === 'SUCCESS' || dataset?.status === 'FAILURE') {
      setRefreshInterval(0);
    } else if (dataset?.status === 'EXECUTING') {
      setRefreshInterval(1000);
    }
  }, [dataset]);

  if (error) return <SWRClientFetchError error={error} />;

  const isLoaded =
    !isLoading &&
    dataset?.status !== 'CREATED' &&
    dataset?.status !== 'EXECUTING';

  return (
    <div className="mb-20 mt-5 flex flex-col gap-4">
      <h2 className="text-2xl font-bold leading-7 sm:text-3xl sm:tracking-tight">
        Validation Results
      </h2>

      {isLoaded && dataset?.status === 'SUCCESS' && (
        <>{JSON.stringify(dataset.result)}</>
      )}
    </div>
  );
}
