import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from '@nextui-org/react';

interface ConfusionMatrixProps {
  matrix: number[][][] | undefined;
  classNames: string[];
}

const rows = [
  {
    key: '1',
    name: 'Tony Reichert',
    role: 'CEO',
    status: 'Active',
  },
  {
    key: '2',
    name: 'Zoey Lang',
    role: 'Technical Lead',
    status: 'Paused',
  },
  {
    key: '3',
    name: 'Jane Fisher',
    role: 'Senior Developer',
    status: 'Active',
  },
  {
    key: '4',
    name: 'William Howard',
    role: 'Community Manager',
    status: 'Vacation',
  },
];

const columns = [
  {
    key: 'name',
    label: 'NAME',
  },
  {
    key: 'role',
    label: 'ROLE',
  },
  {
    key: 'status',
    label: 'STATUS',
  },
];

export default function ConfusionMatrix({
  matrix,
  classNames,
}: ConfusionMatrixProps) {
  if (!matrix) return null;

  return (
    <>
      <p className="mb-2">
        <b>Confusion matrix</b>
      </p>
      {JSON.stringify(matrix)}
      {/*<Table aria-label="Example table with dynamic content">*/}
      {/*  <TableHeader columns={columns}>*/}
      {/*    {(column) => (*/}
      {/*      <TableColumn key={column.key}>{column.label}</TableColumn>*/}
      {/*    )}*/}
      {/*  </TableHeader>*/}
      {/*  <TableBody items={rows}>*/}
      {/*    {(item) => (*/}
      {/*      <TableRow key={item.key}>*/}
      {/*        {(columnKey) => (*/}
      {/*          <TableCell>{getKeyValue(item, columnKey)}</TableCell>*/}
      {/*        )}*/}
      {/*      </TableRow>*/}
      {/*    )}*/}
      {/*  </TableBody>*/}
      {/*</Table>*/}
    </>
  );
}
