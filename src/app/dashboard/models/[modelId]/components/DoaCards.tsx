import { JAQPOT_METADATA_KEY } from '@/app/util/dataset';
import { Card, CardBody } from "@heroui/react";
import { CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import React from 'react';

interface DoaCardsProps {
  doaDetails: any;
}

export default function DoaCards({ doaDetails }: DoaCardsProps) {
  return (
    <>
      {doaDetails?.majorityVoting?.toString() && (
        <div className="mb-4">
          {' '}
          <strong>Majority voting: </strong>
          {doaDetails.majorityVoting.toString()}
        </div>
      )}
      <div className="flex flex-wrap gap-4">
        {Object.entries(doaDetails).map(([key, value]) => {
          if (key === 'majorityVoting') return null;
          return (
            <Card key={key} className="max-w-[400px] grow">
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
