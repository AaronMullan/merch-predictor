import { Form } from '@/components/Form';
import { SalesForm } from '@/components/SalesForm';
import { StoreItems } from '@/components/StoreItems';

export default function SeedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
        <h1 className="text-3xl font-bold">Seed</h1>
        <div className="w-full space-y-8">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Add Items</h2>
            <Form />
          </div>
          <StoreItems />
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Generate Sales Data</h2>
            <SalesForm />
          </div>
        </div>
      </div>
    </div>
  );
}
