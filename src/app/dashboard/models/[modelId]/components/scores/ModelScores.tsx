import {
  FeatureDto,
  ModelDto,
  ModelScoresDto,
  ScoresDto,
} from '@/app/api.types';
import { Divider } from "@heroui/divider";
import { useMemo } from 'react';
import ScoreCard from '@/app/dashboard/models/[modelId]/components/scores/ScoreCard';

interface ModelScoresProps {
  model: ModelDto;
}

function extractScoresTask(model: ModelDto): ScoreTask {
  if (model.task === 'REGRESSION') {
    return 'regression';
  } else if (model.task === 'BINARY_CLASSIFICATION') {
    return 'binaryClassification';
  } else if (model.task === 'MULTICLASS_CLASSIFICATION') {
    return 'multiclassClassification';
  }

  throw new Error('No compatible task found for this model metrics');
}

export type ScoreTask =
  | 'regression'
  | 'binaryClassification'
  | 'multiclassClassification';

function getScoresByTypeAndTask(
  scores: ModelScoresDto,
  scoreType: 'test' | 'train' | 'crossValidation',
  scoreTask: ScoreTask,
): ScoresDto[] | null {
  if (!scores || !scores[scoreType]) return null;
  if (scores[scoreType]!.length === 0) return null;

  return scores[scoreType]!.filter((score) => !!score[scoreTask]);
}

export default function ModelScores({ model }: ModelScoresProps) {
  const scores = model.scores;
  const scoreTask = extractScoresTask(model);

  const trainScores = useMemo(
    () => getScoresByTypeAndTask(scores, 'train', scoreTask),
    [model.scores],
  );
  const testScores = useMemo(
    () => getScoresByTypeAndTask(scores, 'test', scoreTask),
    [model.scores],
  );
  const crossValidationScores = useMemo(
    () => getScoresByTypeAndTask(scores, 'crossValidation', scoreTask),
    [model.scores],
  );

  return (
    <div className="flex flex-col gap-5">
      {trainScores && (
        <div>
          <div className="space-y-1">
            <h4 className="text-medium font-medium">Train scores</h4>
          </div>
          <Divider className="my-4" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {trainScores.map((score, index) => (
              <ScoreCard
                key={index}
                model={model}
                score={score}
                task={scoreTask}
              />
            ))}
          </div>
        </div>
      )}
      {testScores && (
        <div>
          <div className="space-y-1">
            <h4 className="text-medium font-medium">Test scores</h4>
          </div>
          <Divider className="my-4" />
          <div className="grid grid-cols-2 gap-5">
            {testScores.map((score, index) => (
              <ScoreCard
                key={index}
                model={model}
                score={score}
                task={scoreTask}
              />
            ))}
          </div>
        </div>
      )}

      {crossValidationScores && (
        <div>
          <div className="space-y-1">
            <h4 className="text-medium font-medium">Cross validation scores</h4>
          </div>
          <Divider className="my-4" />
          <div className="grid grid-cols-2 gap-5">
            {crossValidationScores.map((score, index) => (
              <ScoreCard
                key={index}
                model={model}
                score={score}
                task={scoreTask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
