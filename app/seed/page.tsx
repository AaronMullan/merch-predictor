import Link from 'next/link';
import { ConfirmationDialog } from '@/components/ConfirmationDailog';
import { Form } from '@/components/Form';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
        <h1 className="mb-6 text-3xl font-bold">Seed</h1>
        <Form />
        <ConfirmationDialog />
      </div>
    </div>
  );
}
