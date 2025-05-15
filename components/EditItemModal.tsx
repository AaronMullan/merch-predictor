import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CatalogItem } from './types';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface EditItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: CatalogItem;
  onSave: (updatedItem: CatalogItem) => Promise<void>;
}

export function EditItemModal({ open, onOpenChange, item, onSave }: EditItemModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [editedItem, setEditedItem] = useState<CatalogItem>(item);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(editedItem);
      toast({
        title: 'Success',
        description: 'Item updated successfully',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update item',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={editedItem.itemData?.name || ''}
              onChange={e =>
                setEditedItem({
                  ...editedItem,
                  itemData: {
                    name: e.target.value || editedItem.itemData?.name || '',
                    variations: editedItem.itemData?.variations,
                  },
                })
              }
            />
          </div>
          {editedItem.itemData?.variations?.map((variation, index) => (
            <div key={variation.id} className="space-y-2 rounded-lg border p-4">
              <h4 className="font-medium">Variation {index + 1}</h4>
              <div className="grid gap-2">
                <Label htmlFor={`variation-name-${index}`}>Name</Label>
                <Input
                  id={`variation-name-${index}`}
                  value={variation.itemVariationData?.name || ''}
                  onChange={e => {
                    const newVariations = [...(editedItem.itemData?.variations || [])];
                    newVariations[index] = {
                      ...newVariations[index],
                      itemVariationData: {
                        name: e.target.value || variation.itemVariationData?.name || '',
                        sku: variation.itemVariationData?.sku,
                        priceMoney: variation.itemVariationData?.priceMoney,
                        inventory: variation.itemVariationData?.inventory,
                      },
                    };
                    setEditedItem({
                      ...editedItem,
                      itemData: {
                        name: editedItem.itemData?.name || '',
                        variations: newVariations,
                      },
                    });
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`variation-price-${index}`}>Price</Label>
                <Input
                  id={`variation-price-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    variation.itemVariationData?.priceMoney
                      ? Number(variation.itemVariationData.priceMoney.amount) / 100
                      : 0
                  }
                  onChange={e => {
                    const newVariations = [...(editedItem.itemData?.variations || [])];
                    newVariations[index] = {
                      ...newVariations[index],
                      itemVariationData: {
                        name: variation.itemVariationData?.name || '',
                        sku: variation.itemVariationData?.sku,
                        priceMoney: {
                          amount: String(Math.round(parseFloat(e.target.value) * 100)),
                          currency: 'USD',
                        },
                        inventory: variation.itemVariationData?.inventory,
                      },
                    };
                    setEditedItem({
                      ...editedItem,
                      itemData: {
                        name: editedItem.itemData?.name || '',
                        variations: newVariations,
                      },
                    });
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`variation-inventory-${index}`}>Inventory</Label>
                <Input
                  id={`variation-inventory-${index}`}
                  type="number"
                  min="0"
                  value={variation.itemVariationData?.inventory || 0}
                  onChange={e => {
                    const newVariations = [...(editedItem.itemData?.variations || [])];
                    newVariations[index] = {
                      ...newVariations[index],
                      itemVariationData: {
                        name: variation.itemVariationData?.name || '',
                        sku: variation.itemVariationData?.sku,
                        priceMoney: variation.itemVariationData?.priceMoney,
                        inventory: parseInt(e.target.value),
                      },
                    };
                    setEditedItem({
                      ...editedItem,
                      itemData: {
                        name: editedItem.itemData?.name || '',
                        variations: newVariations,
                      },
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
