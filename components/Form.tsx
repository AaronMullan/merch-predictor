'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmationDialog } from './ConfirmationDailog';
import { X } from 'lucide-react';

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

export function Form() {
  const [shirtsBySize, setShirtsBySize] = useState<ShirtSizes>({
    s: 60,
    m: 144,
    l: 144,
    xl: 60,
    '2x': 24,
    '3x': 12,
  });

  const [items, setItems] = useState<FormData[]>([]);
  const [currentItem, setCurrentItem] = useState<FormData>({
    item: '',
    quantity: 1,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setItems([...items, currentItem]);
    setCurrentItem({
      item: '',
      quantity: 1,
    });
  };

  const handleConfirm = () => {
    setIsDialogOpen(false);
    // Here you can handle the confirmed items array
    console.log('Confirmed items:', items);
  };

  const clearShirtSizes = () => {
    setShirtsBySize({
      s: 0,
      m: 0,
      l: 0,
      xl: 0,
      '2x': 0,
      '3x': 0,
    });
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div className="max-w-md space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Shirt Sizes</h2>
            <Button
              type="button"
              variant="secondary"
              className="hover:bg-primary cursor-pointer hover:text-white"
              onClick={clearShirtSizes}
            >
              Clear Values
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="s">S</Label>
              <Input
                id="s"
                type="number"
                min="0"
                value={shirtsBySize.s}
                onChange={e => setShirtsBySize({ ...shirtsBySize, s: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="m">M</Label>
              <Input
                id="m"
                type="number"
                min="0"
                value={shirtsBySize.m}
                onChange={e => setShirtsBySize({ ...shirtsBySize, m: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="l">L</Label>
              <Input
                id="l"
                type="number"
                min="0"
                value={shirtsBySize.l}
                onChange={e => setShirtsBySize({ ...shirtsBySize, l: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="xl">XL</Label>
              <Input
                id="xl"
                type="number"
                min="0"
                value={shirtsBySize.xl}
                onChange={e => setShirtsBySize({ ...shirtsBySize, xl: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="2x">2X</Label>
              <Input
                id="2x"
                type="number"
                min="0"
                value={shirtsBySize['2x']}
                onChange={e => setShirtsBySize({ ...shirtsBySize, '2x': parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="3x">3X</Label>
              <Input
                id="3x"
                type="number"
                min="0"
                value={shirtsBySize['3x']}
                onChange={e => setShirtsBySize({ ...shirtsBySize, '3x': parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleItemSubmit} className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Additional Items</h2>
            <Label htmlFor="item">Item Name</Label>
            <Input
              id="item"
              value={currentItem.item}
              onChange={e => setCurrentItem({ ...currentItem, item: e.target.value })}
              placeholder="Enter item name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={currentItem.quantity}
              onChange={e => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) })}
              required
            />
          </div>
          <div className="flex w-full justify-end space-x-2">
            <Button
              type="submit"
              variant="secondary"
              className="hover:bg-primary cursor-pointer hover:text-white"
            >
              Add Item
            </Button>
          </div>
        </form>

        {items.length > 0 && (
          <div className="max-w-md">
            <h2 className="mb-2 text-lg font-semibold">Current Items</h2>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="bg-muted flex items-center justify-between rounded-md p-2"
                >
                  <div className="flex items-center gap-2">
                    <span>{item.item}</span>
                    <span className="text-muted-foreground">Qty: {item.quantity}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="h-8 w-8 cursor-pointer hover:bg-red-500 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex w-full justify-end space-x-2">
          <Button
            type="button"
            className="hover:text-primary cursor-pointer hover:bg-white"
            onClick={() => setIsDialogOpen(true)}
          >
            Review Items ({`Shirts + ${items.length}`})
          </Button>
        </div>
      </div>

      <ConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        items={items}
        shirtsBySize={shirtsBySize}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
