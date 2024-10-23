import { DatasetDto, ModelDto } from '@/app/api.types';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import React from 'react';
import { JAQPOT_METADATA_KEY, JAQPOT_ROW_ID_KEY } from '@/app/util/dataset';

interface ValidationChartProps {
  model: ModelDto;
  dataset: DatasetDto;
}

export default function ValidationChart({
  model,
  dataset,
}: ValidationChartProps) {
  const dependentFeature = model.dependentFeatures[0];

  const data =
    dataset.result?.map((resultRow: any) => {
      const resultRowId = resultRow[JAQPOT_METADATA_KEY][JAQPOT_ROW_ID_KEY];
      const matchingInputRow = dataset.input.find(
        (inputRow: any) =>
          inputRow[JAQPOT_ROW_ID_KEY]?.toString() === resultRowId?.toString(),
      ) as any;

      if (!matchingInputRow) {
        return null;
      }

      return {
        x: resultRow[dependentFeature.name],
        y: matchingInputRow[dependentFeature.name],
      };
    }) ?? [];

  console.log(data);

  return (
    <div className="container mt-2">
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="x"
            name="real value"
            unit={dependentFeature.units}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="predicted value"
            unit={dependentFeature.units}
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="A school" data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
