import DatasetsBreadcrumbs from '@/app/dashboard/datasets/components/DatasetsBreadcrumbs';
import DatasetsTable from '@/app/dashboard/models/components/DatasetsTable';

export default function DatasetsPage() {
  return (
    <>
      <DatasetsBreadcrumbs />
      <DatasetsTable />
    </>
  );
}
