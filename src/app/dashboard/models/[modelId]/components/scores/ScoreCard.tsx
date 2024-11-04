import { ModelDto, ScoresDto } from '@/app/api.types';
import { ScoreTask } from '@/app/dashboard/models/[modelId]/components/scores/ModelScores';
import RegressionScoreCard from '@/app/dashboard/models/[modelId]/components/scores/RegressionScoreCard';
import BinaryClassificationScoreCard from '@/app/dashboard/models/[modelId]/components/scores/BinaryClassificationScoreCard';
import MulticlassClassificationScoreCard from '@/app/dashboard/models/[modelId]/components/scores/MulticlassClassificationScoreCard';

interface ScoreCardProps {
  score: ScoresDto;
  task: ScoreTask;
  model: ModelDto;
}

export default function ScoreCard({ score, task, model }: ScoreCardProps) {
  return (
    <>
      {task === 'regression' && <RegressionScoreCard score={score[task]!} />}
      {task === 'binaryClassification' && (
        <BinaryClassificationScoreCard score={score[task]!} />
      )}
      {task === 'multiclassClassification' && (
        <MulticlassClassificationScoreCard score={score[task]!} />
      )}
    </>
  );
}
