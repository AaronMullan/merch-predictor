'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ShirtSizes {
  s: number;
  m: number;
  l: number;
  xl: number;
  '2x': number;
  '3x': number;
}

interface FormData {
  item: string;
  quantity: number;
  sizes?: ShirtSizes;
}

interface ConfirmationDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  items?: FormData[];
  onConfirm?: () => void;
  shirtsBySize?: ShirtSizes;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  items,
  shirtsBySize,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background max-w-xl">
        <DialogTitle>Confirm Items</DialogTitle>
        {shirtsBySize && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <span className="font-medium">Shirts by Size</span>
            </div>
            <div className="bg-muted grid grid-cols-3 gap-2 rounded-md p-4 text-sm">
              <div className="flex w-16 justify-between">
                <span className="mr-4 w-4 font-bold">S</span> {shirtsBySize.s}
              </div>
              <div className="flex w-16 justify-between">
                <span className="mr-4 w-4 font-bold">M</span> {shirtsBySize.m}
              </div>
              <div className="flex w-16 justify-between">
                <span className="mr-4 w-4 font-bold">L</span> {shirtsBySize.l}
              </div>
              <div className="flex w-16 justify-between">
                <span className="mr-4 w-4 font-bold">XL</span> {shirtsBySize.xl}
              </div>
              <div className="flex w-16 justify-between">
                <span className="mr-4 w-4 font-bold">2X</span> {shirtsBySize['2x']}
              </div>
              <div className="flex w-16 justify-between">
                <span className="mr-4 w-4 font-bold">3X</span> {shirtsBySize['3x']}
              </div>
            </div>
          </div>
        )}
        {items && items.length > 0 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="bg-muted flex flex-col gap-2 rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.item}</span>
                    <span className="text-muted-foreground">Total Qty: {item.quantity}</span>
                  </div>
                  {item.sizes && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {item.sizes.s ? <div>S: {item.sizes.s}</div> : null}
                      {item.sizes.m ? <div>M: {item.sizes.m}</div> : null}
                      {item.sizes.l ? <div>L: {item.sizes.l}</div> : null}
                      {item.sizes.xl ? <div>XL: {item.sizes.xl}</div> : null}
                      {item.sizes['2x'] ? <div>2X: {item.sizes['2x']}</div> : null}
                      {item.sizes['3x'] ? <div>3X: {item.sizes['3x']}</div> : null}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange?.(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onConfirm?.();
                  onOpenChange?.(false);
                }}
              >
                Confirm All Items
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
