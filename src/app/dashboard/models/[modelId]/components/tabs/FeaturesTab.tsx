import { FeatureDto, ModelDto } from '@/app/api.types';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table';
import { Tooltip } from '@nextui-org/tooltip';
import { EditIcon } from '@nextui-org/shared-icons';
import { EyeIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { Button } from '@nextui-org/button';
import FeatureEditModal from '@/app/dashboard/models/[modelId]/components/FeatureEditModal';
import { useDisclosure } from '@nextui-org/react';
import { useEffect, useState } from 'react';

interface FeaturesTabProps {
  model: ModelDto;
}

function FeatureRowActions(props: {
  onViewPress: () => void;
  canEdit: boolean | undefined;
  onEditPress: () => void;
}) {
  return (
    <>
      <Tooltip content="View" closeDelay={0}>
        <Button isIconOnly variant="light" onPress={props.onViewPress}>
          <EyeIcon className="size-6 text-gray-400" />
        </Button>
      </Tooltip>
      {props.canEdit && (
        <Tooltip content="Edit" closeDelay={0}>
          <Button isIconOnly variant="light" onPress={props.onEditPress}>
            <PencilSquareIcon className="size-6 text-gray-400" />
          </Button>
        </Tooltip>
      )}
    </>
  );
}

export default function FeaturesTab({ model }: FeaturesTabProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedFeature, setSelectedFeature] = useState<
    FeatureDto | undefined
  >();
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFeature(undefined);
    }
  }, [isOpen]);

  return (
    <div className="grid grid-cols-1 sm:divide-x sm:divide-dashed lg:grid-cols-2">
      <div className="pr-4">
        <h2 className="mb-4 font-semibold">Independent Features</h2>

        <Table aria-label="Independent features table">
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Units</TableColumn>
            <TableColumn>Description</TableColumn>
            <TableColumn>Type</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {model.independentFeatures.map((independentFeature, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Tooltip content={independentFeature.name}>
                    <div className="line-clamp-2">
                      {independentFeature.name}
                    </div>
                  </Tooltip>
                </TableCell>
                <TableCell>{independentFeature.units}</TableCell>
                <TableCell>
                  <Tooltip content={independentFeature.description}>
                    <div className="line-clamp-2">
                      {independentFeature.description}
                    </div>
                  </Tooltip>
                </TableCell>
                <TableCell>{independentFeature.featureType}</TableCell>
                <TableCell>
                  <FeatureRowActions
                    onViewPress={() => {
                      setSelectedFeature(independentFeature);
                      setIsEdit(false);
                      onOpen();
                    }}
                    canEdit={model.canEdit}
                    onEditPress={() => {
                      setSelectedFeature(independentFeature);
                      setIsEdit(true);
                      onOpen();
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="pl-4">
        <h2 className="mb-4 font-semibold">Dependent Features</h2>
        <Table aria-label="Dependent features table">
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Units</TableColumn>
            <TableColumn>Description</TableColumn>
            <TableColumn>Type</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {model.dependentFeatures.map((dependentFeature, index) => (
              <TableRow key={index}>
                <TableCell>{dependentFeature.name}</TableCell>
                <TableCell>{dependentFeature.units}</TableCell>
                <TableCell>{dependentFeature.description}</TableCell>
                <TableCell>{dependentFeature.featureType}</TableCell>
                <TableCell>
                  <FeatureRowActions
                    onViewPress={() => {
                      setSelectedFeature(dependentFeature);
                      setIsEdit(false);
                      onOpen();
                    }}
                    canEdit={model.canEdit}
                    onEditPress={() => {
                      setSelectedFeature(dependentFeature);
                      setIsEdit(true);
                      onOpen();
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedFeature && (
        <FeatureEditModal
          model={model}
          feature={selectedFeature}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isEdit={isEdit}
        />
      )}
    </div>
  );
}
