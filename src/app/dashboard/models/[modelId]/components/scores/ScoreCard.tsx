import {
  BinaryClassificationDto,
  MulticlassClassificationDto,
  RegressionScoreDto,
  ScoresDto,
} from '@/app/api.types';
import { ScoreTask } from '@/app/dashboard/models/[modelId]/components/scores/ModelScores';
import RegressionScoreCard from '@/app/dashboard/models/[modelId]/components/scores/RegressionScoreCard';
import BinaryClassificationScoreCard from '@/app/dashboard/models/[modelId]/components/scores/BinaryClassificationScoreCard';
import MulticlassClassificationScoreCard from '@/app/dashboard/models/[modelId]/components/scores/MulticlassClassificationScoreCard';

interface ScoreCardProps {
  scores: ScoresDto;
  task: ScoreTask;
}

export default function ScoreCard({ scores, task }: ScoreCardProps) {
  return (
    <>
      {task === 'regression' && <RegressionScoreCard score={scores[task]!} />}
      {task === 'binaryClassification' && (
        <BinaryClassificationScoreCard score={scores[task]!} />
      )}
      {task === 'multiclassClassification' && (
        <MulticlassClassificationScoreCard score={scores[task]!} />
      )}
    </>
  );
}
