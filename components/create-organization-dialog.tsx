'use client';

import { useState } from 'react';
import { CreateOrganization } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function CreateOrganizationDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Organization</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogTitle>Create Organization</DialogTitle>
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  );
}
