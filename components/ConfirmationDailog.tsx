'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Variation {
  name: string;
  price: number;
  sku: string;
}

interface FormItem {
  name: string;
  basePrice: number;
  hasVariations: boolean;
  variations: Variation[];
}

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: FormItem[];
  onConfirm: () => void;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  items,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background max-w-xl">
        <DialogTitle>Confirm Items</DialogTitle>
        {items && items.length > 0 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="bg-muted flex flex-col gap-2 rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">Base Price: ${item.basePrice}</span>
                  </div>
                  {item.hasVariations && item.variations.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <div className="text-sm font-medium">Variations:</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {item.variations.map((variation, vIndex) => (
                          <div key={vIndex} className="flex justify-between">
                            <span>{variation.name}</span>
                            <span>${variation.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onConfirm();
                  onOpenChange(false);
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
