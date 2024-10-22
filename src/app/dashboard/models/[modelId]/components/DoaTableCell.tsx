import { ResultTableRow } from '@/app/util/dataset';
import { TableCell } from '@nextui-org/table';
import { getKeyValue } from '@nextui-org/react';
import { Button } from '@nextui-org/button';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';

export default function DoaTableCell(props: {
  value: string;
  onPress: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {props.value}{' '}
      <Button isIconOnly size={'sm'} variant="light" onPress={props.onPress}>
        <InformationCircleIcon className="size-4 text-gray-400" />
      </Button>{' '}
    </div>
  );
}
