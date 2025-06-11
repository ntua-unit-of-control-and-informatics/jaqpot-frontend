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

type PBPKPlot = {
  xUnit: string;
  yUnit: string;
  plotData: PBPKPlotData[];
};

type PBPKPlotData = {
  time: number;
} & {
  [key: string]: number;
};

function generatePlots(
  groupFeaturesByUnits: Partial<Record<string, FeatureDto[]>>,
  model: ModelDto,
  dataset: DatasetDto,
): PBPKPlot[] {
  const xUnit =
    model.dependentFeatures.find((feature) => feature.key === 'time')?.units ??
    'No Units';

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
      xUnit,
      yUnit: unit,
      plotData,
    };
  });
}

const lineColors = [
  '#3498db', // Bright Blue
  '#f1c40f', // Vibrant Yellow
  '#e74c3c', // Deep Red
  '#2ecc71', // Lime Green
  '#9b59b6', // Rich Plum
  '#1abc9c', // Seafoam Green
  '#16a085', // Forest Green
  '#27ae60', // Mint Green
  '#2980b9', // Navy Blue
  '#8e44ad', // Lavender
  '#d35400', // Burnt Orange
  '#c0392b', // Crimson Red
  '#7f8c8d', // Dark Gray
  '#2c3e50', // Charcoal Gray
  '#95a5a6', // Light Gray
  '#f7dc6f', // Golden Yellow
  '#66d9ef', // Sky Blue
  '#8bc34a', // Olive Green
  '#ff99cc', // Pastel Pink
];

export default function PBPKPlots({ model, dataset }: PBPKPlotsProps) {
  const groupFeaturesByUnits: Partial<Record<string, FeatureDto[]>> = useMemo(
    () =>
      Object.groupBy(
        model.dependentFeatures.filter((feature) => feature.key !== 'time'),
        (feature) => feature.units ?? 'No Units',
      ),
    [model.dependentFeatures],
  );

  if (!dataset.result || !groupFeaturesByUnits) {
    return null;
  }

  const plots: PBPKPlot[] = generatePlots(groupFeaturesByUnits, model, dataset);

  return (
    <div className="grid h-full min-h-[400px] w-full grid-cols-1 gap-2 sm:grid-cols-2">
      {plots.map((plot, index) => {
        const plotEntries = Object.entries(plot.plotData[0]);
        return (
          <>
            <div className="p-8">
              <ResponsiveContainer
                width="100%"
                height={Math.max(plotEntries.length * 15, 400)}
                minHeight={400}
              >
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
                  {...{
                    overflow: 'visible',
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    label={{
                      value: `${plot.xUnit ?? 'No units'}`,
                      position: 'right',
                      offset: 10,
                    }}
                  />
                  <YAxis
                    label={{
                      value: `${plot.yUnit}`,
                      position: 'top',
                      offset: 10,
                    }}
                  />
                  <Tooltip />
                  <Legend />

                  {plotEntries.map(([key, value], index) => {
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
        );
      })}
    </div>
  );
}
