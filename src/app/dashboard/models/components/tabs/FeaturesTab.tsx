import { ModelDto } from '@/app/api.types';
import { Card, CardBody } from '@nextui-org/card';

interface FeaturesTabProps {
  model: ModelDto;
}

export default function FeaturesTab({ model }: FeaturesTabProps) {
  return (
    <div className="flex divide-dashed divide-x">
      <div className="p-4">
        <h2 className="font-semibold mb-4">Independent Features</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {model.independentFeatures.map((independentFeature, index) => (
            <Card
              className="p-5 text-sm min-h-36 max-w-72"
              shadow="sm"
              key={index}
            >
              <CardBody className="overflow-visible p-0">
                <p>Name: {independentFeature.name}</p>
                <p>Type: {independentFeature.featureType}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
      <div className="p-4">
        <h2 className="mb-4 font-semibold ">Dependent Features</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {model.dependentFeatures.map((dependentFeature, index) => (
            <Card
              className="p-5 text-sm  min-h-36 max-w-72"
              shadow="sm"
              key={index}
            >
              <CardBody className="overflow-visible p-0">
                <p>Name: {dependentFeature.name}</p>
                <p>Type: {dependentFeature.featureType}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
