import { JAQPOT_METADATA_KEY } from '@/app/util/dataset';
import { Card, CardBody } from '@nextui-org/react';
import { CardHeader } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import React from 'react';

interface DoaCardsProps {
  result: any;
}

export default function DoaCards({ result }: DoaCardsProps) {
  return (
    <>
      {result[JAQPOT_METADATA_KEY]?.doa?.majorityVoting?.toString() && (
        <div className="mb-4">
          {' '}
          <strong>Majority voting: </strong>
          {result[JAQPOT_METADATA_KEY]?.doa?.majorityVoting.toString()}
        </div>
      )}
      <div className="flex flex-wrap gap-4">
        {Object.entries(result[JAQPOT_METADATA_KEY].doa).map(([key, value]) => {
          if (key === 'majorityVoting') return null;
          return (
            <Card key={key} className="max-w-[400px] flex-grow">
              <CardHeader>
                Method: <strong className="ml-1">{key}</strong>
              </CardHeader>
              <Divider />
              <CardBody>
                <ul>
                  {Object.entries(value as any).map(([key, value]) => {
                    return (
                      <li key={key}>
                        <strong>{key}</strong>: {JSON.stringify(value)}
                      </li>
                    );
                  })}
                </ul>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </>
  );
}
