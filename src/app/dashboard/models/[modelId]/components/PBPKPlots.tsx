import { DatasetDto, FeatureDto, ModelDto } from '@/app/api.types';
import React, { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface PBPKPlotsProps {
  model: ModelDto;
  dataset: DatasetDto;
}

const groupByUnits = (
  dependentFeatures: FeatureDto[],
): Partial<Record<string, FeatureDto[]>> => {
  return Object.groupBy(
    dependentFeatures,
    (feature) => feature.units ?? 'No Units',
  );
};

type PBPKPlot = {
  unit: string;
  plotData: PBPKPlotData[];
};

type PBPKPlotData = {
  time: number;
} & {
  [key: string]: number;
};

function generatePlots(
  groupFeaturesByUnits: Partial<Record<string, FeatureDto[]>>,
  dataset: DatasetDto,
): PBPKPlot[] {
  return Object.entries(groupFeaturesByUnits).map(([unit, features]) => {
    const plotData = dataset.result!.map((resultRow: any) => {
      const time = parseFloat(resultRow.time);
      const featureValues: Record<string, number> = {};
      features!.forEach((feature: FeatureDto) => {
        return (featureValues[feature.key] = parseFloat(
          resultRow[feature.key],
        ));
      });

      return {
        time,
        ...featureValues,
      };
    });

    return {
      unit,
      plotData,
    };
  });
}

const lineColors = [
  '#8884d8', // Purple
  '#82ca9d', // Green
  '#ff7300', // Orange
  '#0088fe', // Blue
  '#ff8042', // Coral
  '#00c49f', // Teal
  '#ffbb28', // Yellow
  '#ff3366', // Pink
  '#a4de6c', // Light Green
  '#8dd1e1', // Light Blue
];

export default function PBPKPlots({ model, dataset }: PBPKPlotsProps) {
  const groupFeaturesByUnits: Partial<Record<string, FeatureDto[]>> = useMemo(
    () =>
      Object.groupBy(
        model.dependentFeatures,
        (feature) => feature.units ?? 'No Units',
      ),
    [model.dependentFeatures],
  );

  if (!dataset.result || !groupFeaturesByUnits) {
    return null;
  }

  const plots: PBPKPlot[] = generatePlots(groupFeaturesByUnits, dataset);

  return (
    <div className="grid h-full min-h-[400px] w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
      {plots.map((plot, index) => (
        <>
          <div>
            <ResponsiveContainer width="100%" height="100%" minHeight={400}>
              <LineChart
                width={500}
                height={300}
                data={plot.plotData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis
                  label={{
                    value: `(${plot.unit})`,
                    position: 'insideBottomRight',
                    offset: 10,
                  }}
                />
                <Tooltip />
                <Legend />

                {Object.entries(plot.plotData[0]).map(([key, value], index) => {
                  if (key === 'time') return null;
                  return (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={lineColors[index % lineColors.length]}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ))}
    </div>
  );
}
