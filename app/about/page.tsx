import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">About Merch Predictor</h1>

        <div className="prose dark:prose-invert">
          <p className="mb-4">
            Merch Predictor is a powerful tool designed to help touring artists and merchandise
            managers optimize their inventory and maximize revenue during tours.
          </p>

          <h2 className="mt-8 mb-4 text-2xl font-semibold">How It Works</h2>
          <p className="mb-4">
            The application uses historical sales data and venue capacities to predict future
            merchandise sales across different tour locations. Here's what it can do:
          </p>

          <ul className="mb-6 list-disc space-y-2 pl-6">
            <li>Calculate average sales per capacity based on past performances</li>
            <li>Predict future sales for upcoming shows</li>
            <li>Track inventory levels across multiple tour dates</li>
            <li>Identify potential stock shortages before they occur</li>
            <li>Calculate potential revenue loss due to insufficient stock</li>
          </ul>

          <h2 className="mt-8 mb-4 text-2xl font-semibold">Features</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-semibold">Sales Prediction</h3>
              <p>
                Uses venue capacity and historical data to forecast sales for each item at upcoming
                shows.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-semibold">Stock Management</h3>
              <p>
                Tracks inventory levels across multiple tour dates and identifies potential
                shortages.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-semibold">Revenue Analysis</h3>
              <p>
                Calculates potential revenue loss due to stock shortages and helps optimize
                inventory decisions.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-semibold">Visual Indicators</h3>
              <p>Color-coded predictions help quickly identify items that may run out of stock.</p>
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <Link href="/" className="text-primary inline-flex items-center hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
