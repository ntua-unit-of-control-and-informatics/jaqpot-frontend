'use client';

import {
  DataEntryDto,
  DatasetDto,
  FeatureDto,
  ModelDto,
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
import React from 'react';

interface PredictionResultProps {
  loading: boolean;
  dataset?: DatasetDto;
  model: ModelDto;
}

export default function PredictionResult({
  loading,
  dataset,
  model,
}: PredictionResultProps) {
  const allFeatures: FeatureDto[] = [
    ...model.independentFeatures,
    ...model.dependentFeatures,
  ];
  const tableHeaders = allFeatures.map((feature, index) => (
    <TableColumn key={index}>{feature.name}</TableColumn>
  ));

  function generateTableRows() {
    if (!dataset?.results) {
      return [];
    }

    return dataset.results.map((result: DataEntryDto, resultsIndex: number) => {
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
          {[...independentFeatureCellValues, ...dependentFeatureCellValues].map(
            (value, index) => (
              <TableCell key={index}>{value}</TableCell>
            ),
          )}
        </TableRow>
      );
    });
  }

  const tableRows = generateTableRows();
  return (
    <div className="mt-5">
      {loading && (
        <div className="flex justify-center">
          {' '}
          <Spinner label="Loading the prediction results..." />
        </div>
      )}
      {!loading && dataset?.status === 'SUCCESS' && (
        <div className="max-w-xl">
          <Alert
            title="Prediction request successful"
            description="Your prediction has been processed successfully. Please find the results below."
            type="success"
          />
        </div>
      )}
      {!loading && dataset?.status === 'FAILURE' && (
        <div className="max-w-xl">
          <Alert
            title="Prediction failed"
            description="We're sorry, but it seems that something went wrong while running the prediction. Please try again later or contact our support team if the issue persists. Thank you for your understanding and patience."
            type="danger"
          />
        </div>
      )}

      {!loading && dataset && (
        <div>
          <Table aria-label="Prediction table">
            <TableHeader>{tableHeaders}</TableHeader>
            <TableBody>
              {tableRows}
              {/*<TableRow key="1">*/}
              {/*  <TableCell>Tony Reichert</TableCell>*/}
              {/*  <TableCell>CEO</TableCell>*/}
              {/*  <TableCell>Active</TableCell>*/}
              {/*</TableRow>*/}
              {/*<TableRow key="2">*/}
              {/*  <TableCell>Zoey Lang</TableCell>*/}
              {/*  <TableCell>Technical Lead</TableCell>*/}
              {/*  <TableCell>Paused</TableCell>*/}
              {/*</TableRow>*/}
              {/*<TableRow key="3">*/}
              {/*  <TableCell>Jane Fisher</TableCell>*/}
              {/*  <TableCell>Senior Developer</TableCell>*/}
              {/*  <TableCell>Active</TableCell>*/}
              {/*</TableRow>*/}
              {/*<TableRow key="4">*/}
              {/*  <TableCell>William Howard</TableCell>*/}
              {/*  <TableCell>Community Manager</TableCell>*/}
              {/*  <TableCell>Vacation</TableCell>*/}
              {/*</TableRow>*/}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
