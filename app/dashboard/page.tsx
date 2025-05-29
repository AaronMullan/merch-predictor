import { Form } from '@/components/Form';
import { StoreItems } from '@/components/StoreItems';

export default function DashboardPage() {
  return (
    <div className="py-8">
      <div className="mx-auto flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold">Manage Store</h1>
        <div className="w-full space-y-8">
          <StoreItems />
          <Form />
        </div>
      </div>
    </div>
  );
}
