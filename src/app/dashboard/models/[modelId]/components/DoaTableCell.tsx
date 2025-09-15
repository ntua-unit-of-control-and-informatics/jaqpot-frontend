import { ResultTableRow } from '@/app/util/dataset';
import { TableCell } from "@heroui/table";
import { getKeyValue } from "@heroui/react";
import { Button } from "@heroui/button";
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';

export default function DoaTableCell(props: {
  value: string;
  onPress: () => void;
}) {
  return (
    <div className="flex items-center">
      {props.value}{' '}
      <Button isIconOnly size={'sm'} variant="light" onPress={props.onPress}>
        <InformationCircleIcon className="size-4 text-gray-400" />
      </Button>{' '}
    </div>
  );
}
