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

interface SalesConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salesData: {
    startDate: string;
    endDate: string;
    averageSalesPerDay: number;
  };
  onConfirm: () => void;
}

export function SalesConfirmationDialog({
  open,
  onOpenChange,
  salesData,
  onConfirm,
}: SalesConfirmationDialogProps) {
  const startDate = new Date(salesData.startDate).toLocaleDateString();
  const endDate = new Date(salesData.endDate).toLocaleDateString();
  const totalDays = Math.ceil(
    (new Date(salesData.endDate).getTime() - new Date(salesData.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const totalSales = totalDays * salesData.averageSalesPerDay;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Sales Data Generation</DialogTitle>
          <DialogDescription>
            This will generate sales data for your items with the following parameters:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Date Range</p>
              <p className="text-muted-foreground text-sm">
                {startDate} to {endDate}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Days</p>
              <p className="text-muted-foreground text-sm">{totalDays} days</p>
            </div>
            <div>
              <p className="text-sm font-medium">Average Sales Per Day</p>
              <p className="text-muted-foreground text-sm">{salesData.averageSalesPerDay} sales</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Sales</p>
              <p className="text-muted-foreground text-sm">{totalSales} sales</p>
            </div>
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
