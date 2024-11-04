import CustomizedTreemapContent from '@/app/dashboard/models/[modelId]/components/scores/CustomizedTreemapContent';

interface ConfusionMatrixProps {
  matrix: number[][][] | undefined;
  classNames: string[];
}

import React from 'react';
import { Treemap, ResponsiveContainer } from 'recharts';
import Heatmap from '@/app/dashboard/models/[modelId]/components/scores/Heatmap';

const data = [
  {
    name: '12',
    children: [{ name: 'Axes', size: 1 }],
  },
  {
    name: '1',
    children: [{ name: 'AnchorControl', size: 1 }],
  },
  {
    name: '13',
    children: [{ name: 'Data', size: 1 }],
  },
  {
    name: '0',
    children: [{ name: 'DataEvent', size: 1 }],
  },
];

const COLORS = [
  '#8889DD',
  '#9597E4',
  '#8DC77B',
  '#A5D297',
  '#E2CF45',
  '#F8C12D',
];

export default function ConfusionMatrix({
  matrix,
  classNames,
}: ConfusionMatrixProps) {
  if (!matrix) return null;

  const xLabels = ['0', '1'];
  const yLabels = ['0', '1'];

  const getCellColor = (value: number, x: number, y: number) => {
    if (x === y) {
      return {
        bgColor: '#ccffcc',
        color: 'black',
      };
    } else {
      return { bgColor: '#ffdddd', color: 'black' };
    }
  };
  return (
    <>
      <p className="mb-2">
        <b>Confusion matrix</b>
      </p>
      {classNames.map((className, index) => (
        <Heatmap
          key={index}
          legend={className}
          data={matrix[index]}
          xLabels={xLabels}
          yLabels={yLabels}
          getColor={getCellColor}
        />
      ))}
    </>
  );
}
