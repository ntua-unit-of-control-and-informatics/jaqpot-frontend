import { RegressionScoreDto } from '@/app/api.types';
import { Card, CardHeader, CardBody, Image } from '@nextui-org/react';

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
        <div className="my-2 text-sm">
          <b>
            R<sup>2</sup> diff R=0
          </b>
          : {score!.rSquaredDiffRZero}
        </div>
        <div className="my-2 text-sm">
          <b>
            R<sup>2</sup> diff R=0 Hat
          </b>
          : {score!.rSquaredDiffRZeroHat}
        </div>
        <div className="my-2 text-sm">
          <b>Abs diff R=0 Hat</b>: {score!.absDiffRZeroHat}
        </div>
        <div className="my-2 text-sm">
          <b>K</b>: {score!.k}
        </div>
        <div className="my-2 text-sm">
          <b>K Hat</b>: {score!.kHat}
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
