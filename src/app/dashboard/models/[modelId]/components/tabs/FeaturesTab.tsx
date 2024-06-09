import { ModelDto } from '@/app/api.types';
import { Card, CardBody } from '@nextui-org/card';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';

interface FeaturesTabProps {
  model: ModelDto;
}

export default function FeaturesTab({ model }: FeaturesTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 divide-dashed divide-x">
      <div className="p-4">
        <h2 className="font-semibold mb-4">Independent Features</h2>

        <Table aria-label="Independent features table">
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Description</TableColumn>
            <TableColumn>Type</TableColumn>
          </TableHeader>
          <TableBody>
            {model.independentFeatures.map((independentFeature, index) => (
              <TableRow key={index}>
                <TableCell>{independentFeature.name}</TableCell>
                <TableCell>{independentFeature.description}</TableCell>
                <TableCell>{independentFeature.featureType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="p-4">
        <h2 className="mb-4 font-semibold ">Dependent Features</h2>
        <Table aria-label="Dependent features table">
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Description</TableColumn>
            <TableColumn>Type</TableColumn>
          </TableHeader>
          <TableBody>
            {model.dependentFeatures.map((dependentFeature, index) => (
              <TableRow key={index}>
                <TableCell>{dependentFeature.name}</TableCell>
                <TableCell>{dependentFeature.description}</TableCell>
                <TableCell>{dependentFeature.featureType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
