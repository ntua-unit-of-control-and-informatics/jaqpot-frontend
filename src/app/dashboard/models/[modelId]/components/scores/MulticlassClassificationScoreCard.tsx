import { MulticlassClassificationDto } from '@/app/api.types';
import { Card, CardBody, CardHeader, Image } from '@nextui-org/react';
import ConfusionMatrix from '@/app/dashboard/models/[modelId]/components/scores/ConfusionMatrix';

interface MulticlassClassificationScoreCardProps {
  score: MulticlassClassificationDto;
}

export default function MulticlassClassificationScoreCard({
  score,
}: MulticlassClassificationScoreCardProps) {
  return (
    <>
      <Card className="py-4">
        <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
          <p className="text-tiny font-bold uppercase">{score!.yName}</p>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <div className="my-2 text-sm">
            <b>Accuracy</b>: {score!.accuracy}
          </div>
          <div className="my-2 text-sm">
            <b>Balanced accuracy</b>: {JSON.stringify(score!.balancedAccuracy)}
          </div>
          <div className="my-2 text-sm">
            <b>Precision</b>: {JSON.stringify(score!.precision)}
          </div>
          <div className="my-2 text-sm">
            <b>Recall</b>: {JSON.stringify(score!.recall)}
          </div>
          <div className="my-2 text-sm">
            <b>F1 score</b>: {JSON.stringify(score!.f1Score)}
          </div>
          <div className="my-2 text-sm">
            <b>Jaccard</b>: {JSON.stringify(score!.jaccard)}
          </div>
          <div className="my-2 text-sm">
            <b>Matthews correlation coefficient</b>: {score!.matthewsCorrCoef}
          </div>
          {score!.folds && (
            <div className="my-2 text-sm">
              <b>Folds</b>: {score!.folds}
            </div>
          )}
          <div className="my-2 text-sm">
            <ConfusionMatrix
              matrix={score!.confusionMatrix}
              classNames={score!.labels}
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
}
