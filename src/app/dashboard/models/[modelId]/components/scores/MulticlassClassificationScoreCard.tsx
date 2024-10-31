import { MulticlassClassificationDto } from '@/app/api.types';
import { Card, CardBody, CardHeader, Image } from '@nextui-org/react';

interface MulticlassClassificationScoreCardProps {
  score: MulticlassClassificationDto;
}

export default function MulticlassClassificationScoreCard({
  score,
}: MulticlassClassificationScoreCardProps) {
  return (
    <Card className="py-4">
      <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
        <p className="text-tiny font-bold uppercase">{score!.yName}</p>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        {Object.entries(score!).map(([key, value]) => (
          <div key={key} className="my-2 text-sm">
            <b>{key}</b>: {value}
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
