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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    setIsDialogOpen(false);
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
      console.log('Sales data generated:', result);
      setSalesData({
        startDate: '',
        endDate: '',
        averageSalesPerDay: 0,
      });
    } catch (error) {
      console.error('Error generating sales data:', error);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h2 className="text-2xl font-semibold">Generate Sales Data</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
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
          <div className="space-y-2">
            <Label htmlFor="averageSalesPerDay">Average Sales Per Day</Label>
            <Input
              id="averageSalesPerDay"
              type="number"
              min="0"
              step="1"
              value={salesData.averageSalesPerDay}
              onChange={e =>
                setSalesData({ ...salesData, averageSalesPerDay: parseInt(e.target.value) })
              }
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
            Generate Sales Data
          </Button>
        </div>
      </form>

      <SalesConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        salesData={salesData}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
