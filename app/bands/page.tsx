'use client';

import { CreateOrganizationDialog } from '@/components/create-organization-dialog';

export default function BandsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-4 text-2xl font-bold">Bands</h1>
      <CreateOrganizationDialog />
    </div>
  );
}
