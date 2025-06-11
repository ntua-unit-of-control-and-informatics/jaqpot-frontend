import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { CardHeader } from '@nextui-org/card';

interface HeatmapProps {
  data: number[][];
  xLabels: string[];
  yLabels: string[];
  getColor?: (value: number, x: number, y: number) => HeatmapCellColor;
}

interface HeatmapCellColor {
  bgColor: string;
  color: string;
}

export default function Heatmap({
  data,
  xLabels,
  yLabels,
  getColor,
}: HeatmapProps) {
  // Get min/max for color scaling
  const allValues = data.flat();
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);

  // Color interpolation function
  const defaultGetColor: (
    value: number,
    x: number,
    y: number,
  ) => HeatmapCellColor = (value: number, x: number, y: number) => {
    const ratio = (value - min) / (max - min);
    return {
      bgColor: `rgb(${255 - Math.floor(ratio * 255)}, ${255 - Math.floor(ratio * 255)}, 255)`,
      color: value > (max - min) / 2 ? 'white' : 'black',
    };
  };

  const getColorFn = getColor || defaultGetColor;

  return (
    <Card className="w-full" shadow="none">
      <CardHeader></CardHeader>
      <CardBody>
        <div className="flex">
          {/* Y-axis labels */}
          <div className="flex flex-col justify-around py-4 pr-2">
            {yLabels.map((label) => (
              <div key={label} className="text-right text-sm">
                {label}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex-1">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${xLabels.length}, 1fr)`,
                gap: '1px',
              }}
            >
              {data.map((row, i) =>
                row.map((value, j) => {
                  const heatmapCellColor = getColorFn(value, i, j);
                  return (
                    <div
                      key={`${i}-${j}`}
                      className="flex aspect-square items-center justify-center text-sm transition-colors"
                      style={{
                        backgroundColor: heatmapCellColor.bgColor,
                        color: heatmapCellColor.color,
                      }}
                    >
                      <b>{value}</b>
                    </div>
                  );
                }),
              )}
            </div>

            {/* X-axis labels */}
            <div
              className="mt-2 grid"
              style={{
                gridTemplateColumns: `repeat(${xLabels.length}, 1fr)`,
              }}
            >
              {xLabels.map((label) => (
                <div key={label} className="text-center text-sm">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
