'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { CatalogItem, CatalogItemVariation } from './types';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface EditItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: CatalogItem;
  onUpdate: (item: CatalogItem) => Promise<void>;
}

export function EditItemModal({ open, onOpenChange, item, onUpdate }: EditItemModalProps) {
  const [editedItem, setEditedItem] = useState<CatalogItem>(item);
  const [hasVariations, setHasVariations] = useState((item.itemData?.variations?.length ?? 0) > 1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onUpdate(editedItem);
      toast({
        title: 'Success',
        description: 'Item updated successfully',
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update item',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addVariation = () => {
    if (!editedItem.itemData) return;

    const newVariation: CatalogItemVariation = {
      id: `#${Date.now()}`,
      type: 'ITEM_VARIATION',
      itemVariationData: {
        name: '',
        sku: '',
        inventory: 0,
        priceMoney: {
          amount: editedItem.itemData.variations?.[0]?.itemVariationData?.priceMoney?.amount || '0',
          currency: 'USD',
        },
      },
    };

    setEditedItem({
      ...editedItem,
      itemData: {
        ...editedItem.itemData,
        variations: [...(editedItem.itemData.variations || []), newVariation],
      },
    });
  };

  const removeVariation = (index: number) => {
    if (!editedItem.itemData?.variations) return;

    const newVariations = [...editedItem.itemData.variations];
    newVariations.splice(index, 1);

    setEditedItem({
      ...editedItem,
      itemData: {
        ...editedItem.itemData,
        variations: newVariations,
      },
    });
  };

  const updateVariation = (index: number, field: string, value: string) => {
    if (!editedItem.itemData?.variations) return;

    const newVariations = [...editedItem.itemData.variations];
    const variation = newVariations[index];

    if (variation.itemVariationData) {
      if (field === 'name') {
        variation.itemVariationData.name = value;
      } else if (field === 'sku') {
        variation.itemVariationData.sku = value;
      } else if (field === 'price') {
        variation.itemVariationData.priceMoney = {
          amount: (parseFloat(value) * 100).toString(),
          currency: 'USD',
        };
      } else if (field === 'inventory') {
        variation.itemVariationData.inventory = parseInt(value);
      }
    }

    setEditedItem({
      ...editedItem,
      itemData: {
        ...editedItem.itemData,
        variations: newVariations,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="edit-item-description">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        <div id="edit-item-description" className="sr-only">
          Form to edit item details including name, price, inventory, and variations
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={editedItem.itemData?.name || ''}
              onChange={e =>
                setEditedItem({
                  ...editedItem,
                  itemData: { ...editedItem.itemData!, name: e.target.value },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="basePrice">Base Price</Label>
            <Input
              id="basePrice"
              type="number"
              min="0"
              step="0.01"
              value={
                parseFloat(
                  editedItem.itemData?.variations?.[0]?.itemVariationData?.priceMoney?.amount || '0'
                ) / 100
              }
              onChange={e => {
                const price = e.target.value;
                if (!editedItem.itemData?.variations) return;

                const newVariations = editedItem.itemData.variations.map(variation => ({
                  ...variation,
                  itemVariationData: {
                    ...variation.itemVariationData!,
                    priceMoney: {
                      amount: (parseFloat(price) * 100).toString(),
                      currency: 'USD',
                    },
                  },
                }));

                setEditedItem({
                  ...editedItem,
                  itemData: {
                    ...editedItem.itemData,
                    variations: newVariations,
                  },
                });
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="baseInventory">Base Inventory</Label>
            <Input
              id="baseInventory"
              type="number"
              min="0"
              value={editedItem.itemData?.variations?.[0]?.itemVariationData?.inventory || 0}
              onChange={e => {
                const inventory = parseInt(e.target.value);
                if (!editedItem.itemData?.variations) return;

                const newVariations = editedItem.itemData.variations.map(variation => ({
                  ...variation,
                  itemVariationData: {
                    ...variation.itemVariationData!,
                    inventory,
                  },
                }));

                setEditedItem({
                  ...editedItem,
                  itemData: {
                    ...editedItem.itemData,
                    variations: newVariations,
                  },
                });
              }}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasVariations"
                checked={hasVariations}
                onCheckedChange={checked => {
                  const newHasVariations = checked as boolean;
                  setHasVariations(newHasVariations);
                  if (!newHasVariations && editedItem.itemData?.variations) {
                    // Keep only the first variation
                    setEditedItem({
                      ...editedItem,
                      itemData: {
                        ...editedItem.itemData,
                        variations: [editedItem.itemData.variations[0]],
                      },
                    });
                  }
                }}
              />
              <Label htmlFor="hasVariations">This item has variations</Label>
            </div>

            {hasVariations && editedItem.itemData?.variations && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-semibold">Variations</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVariation}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Variation
                  </Button>
                </div>
                <div className="space-y-4 rounded-lg border p-4">
                  {editedItem.itemData.variations.map((variation, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Variation {index + 1}</h4>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeVariation(index)}
                            className="h-8 w-8 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor={`name-${index}`}>Name</Label>
                          <Input
                            id={`name-${index}`}
                            value={variation.itemVariationData?.name || ''}
                            onChange={e => updateVariation(index, 'name', e.target.value)}
                            placeholder="e.g., Small, Red, etc."
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`price-${index}`}>Price</Label>
                          <Input
                            id={`price-${index}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                              parseFloat(variation.itemVariationData?.priceMoney?.amount || '0') /
                              100
                            }
                            onChange={e => updateVariation(index, 'price', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`sku-${index}`}>SKU</Label>
                          <Input
                            id={`sku-${index}`}
                            value={variation.itemVariationData?.sku || ''}
                            onChange={e => updateVariation(index, 'sku', e.target.value)}
                            placeholder="Optional SKU"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`inventory-${index}`}>Inventory</Label>
                          <Input
                            id={`inventory-${index}`}
                            type="number"
                            min="0"
                            value={variation.itemVariationData?.inventory || 0}
                            onChange={e => updateVariation(index, 'inventory', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
