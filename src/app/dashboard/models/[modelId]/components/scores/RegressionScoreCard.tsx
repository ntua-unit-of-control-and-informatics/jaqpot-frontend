import { RegressionScoreDto } from '@/app/api.types';
import { Card, CardHeader, CardBody, Image } from "@heroui/react";

interface RegressionScoreCardProps {
  score: RegressionScoreDto;
}

export default function RegressionScoreCard({
  score,
}: RegressionScoreCardProps) {
  return (
    <Card className="py-4">
      <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
        <p className="text-tiny font-bold uppercase">{score!.yName}</p>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <div className="my-2 text-sm">
          <b>
            R<sup>2</sup>
          </b>
          : {score!.r2}
        </div>
        <div className="my-2 text-sm">
          <b>MAE</b>: {score!.mae}
        </div>
        <div className="my-2 text-sm">
          <b>RMSE</b>: {score!.rmse}
        </div>
        {score!.folds && (
          <div className="my-2 text-sm">
            <b>Folds</b>: {score!.folds}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
