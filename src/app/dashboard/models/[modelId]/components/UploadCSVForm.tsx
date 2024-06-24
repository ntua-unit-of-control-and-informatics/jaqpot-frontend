import { Button } from '@nextui-org/button';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import React, { ChangeEvent, useState } from 'react';
import { ModelDto } from '@/app/api.types';
import { Input } from '@nextui-org/input';
import { Tooltip } from '@nextui-org/tooltip';

interface UploadCSVFormProps {
  onSubmit: (formData: any) => Promise<void>;
  model?: ModelDto;
}

function downloadSampleFile(model: ModelDto) {
  fetch(`/api/models/${model.id}/predict/sample-csv`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      independentFeatures: model.independentFeatures,
      dependentFeatures: model.dependentFeatures,
    }),
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sample-input-${model.id}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch((error) => console.error('Error:', error));
}

export default function UploadCSVForm({ onSubmit, model }: UploadCSVFormProps) {
  const [csvFile, setCsvFile] = useState<File | undefined>();

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('file', csvFile!);
    await onSubmit(formData);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file) {
      setCsvFile(file);
    }
  };

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <div className="flex gap-5">
          <div className="flex flex-col gap-2 ">
            <p className="text-tiny">Upload the input CSV</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              required
            />
          </div>
        </div>
        <div className="mt-10 flex gap-5">
          <div>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </div>
          <div>
            <Tooltip content="Download a sample CSV with the header columns prefilled for you">
              <Button
                color="default"
                className="max-w-fit"
                startContent={<ArrowDownTrayIcon className="size-6" />}
                onPress={() => downloadSampleFile(model!)}
              >
                Download sample CSV
              </Button>
            </Tooltip>
          </div>
        </div>
      </form>
    </>
  );
}
