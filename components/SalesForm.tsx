'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SalesConfirmationDialog } from './SalesConfirmationDialog';
import { SalesData } from './types';

export function SalesForm() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [averageSales, setAverageSales] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          averageSales: Number(averageSales),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate sales data');
      }

      const data = await response.json();
      console.log('Sales data generated:', data);
      // Reset form
      setStartDate('');
      setEndDate('');
      setAverageSales('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  const salesData: SalesData = {
    startDate,
    endDate,
    averageSales: Number(averageSales),
  };

  return (
    <div>
      <div className="mx-auto max-w-3xl space-y-4 py-8">
        <h2 className="text-2xl font-semibold">Generate Sales Data</h2>
        <Card>
          <CardHeader>
            <CardTitle>Generate Sales Data</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
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
                  step="0.01"
                  value={averageSales}
                  onChange={e => setAverageSales(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Sales Data'}
              </Button>
            </form>
          </CardContent>
          <SalesConfirmationDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            salesData={salesData}
            onConfirm={handleConfirm}
          />
        </Card>
      </div>
    </div>
  );
}
