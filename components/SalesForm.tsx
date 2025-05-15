'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SalesConfirmationDialog } from './SalesConfirmationDialog';

interface SalesData {
  startDate: string;
  endDate: string;
  averageSalesPerDay: number;
}

export function SalesForm() {
  const [salesData, setSalesData] = useState<SalesData>({
    startDate: '',
    endDate: '',
    averageSalesPerDay: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    setIsDialogOpen(false);
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salesData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate sales data');
      }

      const result = await response.json();
      console.log('Sales data generated successfully:', result);

      // Reset form
      setSalesData({
        startDate: '',
        endDate: '',
        averageSalesPerDay: 0,
      });
    } catch (error) {
      console.error('Error generating sales data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl min-w-[80vw] space-y-4 lg:min-w-[40vw]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Generate Sales Data</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={salesData.startDate}
                  onChange={e => setSalesData({ ...salesData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={salesData.endDate}
                  onChange={e => setSalesData({ ...salesData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="averageSales">Average Sales Per Day</Label>
              <Input
                id="averageSales"
                type="number"
                min="0"
                value={salesData.averageSalesPerDay}
                onChange={e =>
                  setSalesData({ ...salesData, averageSalesPerDay: parseInt(e.target.value) })
                }
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Sales Data'}
            </Button>
          </div>
        </form>
      </div>

      <SalesConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        salesData={salesData}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
