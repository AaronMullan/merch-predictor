'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SalesData } from './types';

interface SalesConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salesData: SalesData;
  onConfirm: () => void;
}

export function SalesConfirmationDialog({
  open,
  onOpenChange,
  salesData,
  onConfirm,
}: SalesConfirmationDialogProps) {
  const startDate = new Date(salesData.startDate);
  const endDate = new Date(salesData.endDate);
  const totalDays =
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const totalSales = totalDays * salesData.averageSales;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Sales Data Generation</DialogTitle>
          <DialogDescription>
            Please review the sales data parameters before generating:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Start Date</p>
              <p className="text-muted-foreground text-sm">{salesData.startDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium">End Date</p>
              <p className="text-muted-foreground text-sm">{salesData.endDate}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Total Days</p>
            <p className="text-muted-foreground text-sm">{totalDays} days</p>
          </div>
          <div>
            <p className="text-sm font-medium">Average Sales Per Day</p>
            <p className="text-muted-foreground text-sm">${salesData.averageSales.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Total Sales</p>
            <p className="text-muted-foreground text-sm">${totalSales.toFixed(2)}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Generate Sales Data</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
