interface ConfusionMatrixProps {
  matrix: number[][] | undefined;
  classNames?: string[];
}

import React from 'react';
import { HeatMapGrid } from 'react-grid-heatmap';

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
    <div className="w-full">
      <p className="mb-2">
        <b>Confusion matrix</b>
      </p>
      {matrix && (
        <div className="flex flex-row items-baseline">
          <div>
            <b>
              True
              <br />
              Class
            </b>
          </div>
          <div className="flex flex-col items-center">
            <HeatMapGrid
              data={matrix}
              xLabels={classNames}
              yLabels={classNames}
              // Render cell with tooltip
              cellRender={(x, y, value) => (
                <div
                  title={`Pos(${x}, ${y}) = ${value}`}
                  className="flex aspect-square items-center justify-center text-sm transition-colors"
                >
                  {value}
                </div>
              )}
              cellHeight="5rem"
              xLabelsPos="bottom"
              yLabelsPos="left"
              square
            />
            <div>
              <b>Predicted Label</b>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
