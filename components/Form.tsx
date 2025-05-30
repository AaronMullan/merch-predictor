'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmationDialog } from './ConfirmationDialog';
import { X, Plus, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface Variation {
  name: string;
  price: number;
  sku: string;
  inventory: number;
}

interface FormItem {
  name: string;
  basePrice: number;
  hasVariations: boolean;
  variations: Variation[];
  baseInventory: number;
}

export function Form() {
  const [items, setItems] = useState<FormItem[]>([]);
  const [currentItem, setCurrentItem] = useState<FormItem>({
    name: '',
    basePrice: 0,
    hasVariations: false,
    variations: [],
    baseInventory: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setItems([...items, currentItem]);
    setCurrentItem({
      name: '',
      basePrice: 0,
      hasVariations: false,
      variations: [],
      baseInventory: 0,
    });
  };

  const handleConfirm = async () => {
    setIsDialogOpen(false);
    try {
      const response = await fetch('/api/upload-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload items');
      }

      const result = await response.json();
      setItems([]);
    } catch (error) {
      console.error('Error uploading items:', error);
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const addVariation = () => {
    setCurrentItem({
      ...currentItem,
      variations: [
        ...currentItem.variations,
        {
          name: '',
          price: currentItem.basePrice,
          sku: '',
          inventory: currentItem.baseInventory,
        },
      ],
    });
  };

  const removeVariation = (index: number) => {
    setCurrentItem({
      ...currentItem,
      variations: currentItem.variations.filter((_, i) => i !== index),
    });
  };

  const updateVariation = (index: number, field: keyof Variation, value: string | number) => {
    const newVariations = [...currentItem.variations];
    newVariations[index] = { ...newVariations[index], [field]: value };
    setCurrentItem({ ...currentItem, variations: newVariations });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h2 className="text-2xl font-semibold">Add Items to Square</h2>
      <div className="space-y-4">
        <form onSubmit={handleItemSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Add New Item</h2>
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                value={currentItem.name}
                onChange={e => setCurrentItem({ ...currentItem, name: e.target.value })}
                placeholder="Enter item name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price</Label>
              <Input
                id="basePrice"
                type="number"
                min="0"
                step="0.01"
                value={currentItem.basePrice}
                onChange={e =>
                  setCurrentItem({ ...currentItem, basePrice: parseFloat(e.target.value) })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="baseInventory">Base Inventory</Label>
              <Input
                id="baseInventory"
                type="number"
                min="0"
                value={currentItem.baseInventory}
                onChange={e =>
                  setCurrentItem({ ...currentItem, baseInventory: parseInt(e.target.value) })
                }
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasVariations"
                  checked={currentItem.hasVariations}
                  onCheckedChange={checked => {
                    const newHasVariations = checked as boolean;
                    setCurrentItem({
                      ...currentItem,
                      hasVariations: newHasVariations,
                      variations: newHasVariations
                        ? [
                            {
                              name: '',
                              price: currentItem.basePrice,
                              sku: '',
                              inventory: currentItem.baseInventory,
                            },
                          ]
                        : [],
                    });
                  }}
                />
                <Label htmlFor="hasVariations">This item has variations</Label>
              </div>

              {currentItem.hasVariations && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-semibold">Variations</h3>
                  </div>
                  <div className="space-y-4 rounded-lg border p-4">
                    {currentItem.variations.map((variation, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Variation {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeVariation(index)}
                            className="h-8 w-8 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label htmlFor={`name-${index}`}>Name</Label>
                            <Input
                              id={`name-${index}`}
                              value={variation.name}
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
                              value={variation.price}
                              onChange={e =>
                                updateVariation(index, 'price', parseFloat(e.target.value))
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`sku-${index}`}>SKU</Label>
                            <Input
                              id={`sku-${index}`}
                              value={variation.sku}
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
                              value={variation.inventory}
                              onChange={e =>
                                updateVariation(index, 'inventory', parseInt(e.target.value))
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end">
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
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </form>

        {items.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Current Items</h2>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        Base Price: ${item.basePrice}
                        {!item.hasVariations &&
                          ` (No variations, Inventory: ${item.baseInventory})`}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="h-8 w-8 hover:bg-red-500 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {item.hasVariations && item.variations.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      {item.variations.map((variation, vIndex) => (
                        <div key={vIndex} className="flex justify-between">
                          <span>{variation.name}:</span>
                          <span>
                            ${variation.price} (Inventory: {variation.inventory})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Review and Upload ({items.length} items)
            </Button>
          </div>
        )}
      </div>

      <ConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        items={items}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
