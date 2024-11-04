import { MulticlassClassificationDto } from '@/app/api.types';
import { Card, CardBody, CardHeader, Image } from '@nextui-org/react';
import ConfusionMatrix from '@/app/dashboard/models/[modelId]/components/scores/ConfusionMatrix';

interface MulticlassClassificationScoreCardProps {
  score: MulticlassClassificationDto;
  classNames: string[];
}

export default function MulticlassClassificationScoreCard({
  score,
  classNames,
}: MulticlassClassificationScoreCardProps) {
  return (
    <Card className="py-4">
      <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
        <p className="text-tiny font-bold uppercase">{score!.yName}</p>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <div className="my-2 text-sm">
          <b>accuracy</b>: {score!.accuracy}
        </div>
        <div className="my-2 text-sm">
          <b>balancedAccuracy</b>: {JSON.stringify(score!.balancedAccuracy)}
        </div>
        <div className="my-2 text-sm">
          <b>precision</b>: {JSON.stringify(score!.precision)}
        </div>
        <div className="my-2 text-sm">
          <b>recall</b>: {JSON.stringify(score!.recall)}
        </div>
        <div className="my-2 text-sm">
          <b>f1Score</b>: {JSON.stringify(score!.f1Score)}
        </div>
        <div className="my-2 text-sm">
          <b>jaccard</b>: {JSON.stringify(score!.jaccard)}
        </div>
        <div className="my-2 text-sm">
          <b>matthewsCorrCoef</b>: {score!.matthewsCorrCoef}
        </div>
        <div className="my-2 text-sm">
          <ConfusionMatrix
            matrix={score!.confusionMatrix}
            classNames={classNames}
          />
        </div>
      </CardBody>
    </Card>
  );
}
