import DoaCards from '@/app/dashboard/models/[modelId]/components/DoaCards';
import React from 'react';

interface DoaModalProps {
  result: any;
}

export default function DoaModal({ result }: DoaModalProps) {
  return <DoaCards result={result} />;
}
