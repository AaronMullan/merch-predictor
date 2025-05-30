'use client';

import { useEffect, useState } from 'react';
import { fetchCatalogItems } from '@/lib/fetch-catalog-items';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CatalogItem } from './types';
import { StoreItemCard } from './StoreItemCard';

export function StoreItems() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = async () => {
    try {
      const data = await fetchCatalogItems();
      // Filter out deleted items
      console.log('data', data);
      setItems(data.filter((item: CatalogItem) => !item.isDeleted));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleUpdate = async (updatedItem: CatalogItem) => {
    try {
      // Transform the item data into the format expected by createCatalogItems
      const transformedItem = {
        id: updatedItem.id,
        version: updatedItem.version,
        name: updatedItem.itemData?.name || '',
        basePrice:
          parseFloat(
            updatedItem.itemData?.variations?.[0]?.itemVariationData?.priceMoney?.amount?.toString() ||
              '0'
          ) / 100,
        baseInventory: parseInt(
          updatedItem.itemData?.variations?.[0]?.itemVariationData?.inventory?.toString() || '0'
        ),
        hasVariations: (updatedItem.itemData?.variations?.length || 0) > 1,
        variations:
          updatedItem.itemData?.variations?.map(variation => ({
            id: variation.id,
            version: variation.version,
            name: variation.itemVariationData?.name || '',
            price:
              parseFloat(variation.itemVariationData?.priceMoney?.amount?.toString() || '0') / 100,
            sku: variation.itemVariationData?.sku || '',
            inventory: parseInt(variation.itemVariationData?.inventory?.toString() || '0'),
          })) || [],
      };

      const response = await fetch('/api/upload-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: [transformedItem] }),
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      // Refresh the items list
      await loadItems();
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  };

  const handleDelete = async (itemToDelete: CatalogItem) => {
    try {
      // Transform the item data into the format expected by createCatalogItems
      const transformedItem = {
        id: itemToDelete.id,
        version: itemToDelete.version,
        name: itemToDelete.itemData?.name || '',
        basePrice:
          parseFloat(
            itemToDelete.itemData?.variations?.[0]?.itemVariationData?.priceMoney?.amount?.toString() ||
              '0'
          ) / 100,
        baseInventory: parseInt(
          itemToDelete.itemData?.variations?.[0]?.itemVariationData?.inventory?.toString() || '0'
        ),
        hasVariations: (itemToDelete.itemData?.variations?.length || 0) > 1,
        variations:
          itemToDelete.itemData?.variations?.map(variation => ({
            id: variation.id,
            version: variation.version,
            name: variation.itemVariationData?.name || '',
            price:
              parseFloat(variation.itemVariationData?.priceMoney?.amount?.toString() || '0') / 100,
            sku: variation.itemVariationData?.sku || '',
            inventory: parseInt(variation.itemVariationData?.inventory?.toString() || '0'),
          })) || [],
        isDeleted: true,
      };

      const response = await fetch('/api/upload-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: [transformedItem] }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Refresh the items list
      await loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  };

  useEffect(() => {
    console.log(items);
  }, [items]);

  if (error) {
    return (
      <div className="bg-muted-foreground">
        <div className="mx-auto max-w-3xl space-y-4 py-8">
          <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-muted-foreground">
      <div className="mx-auto max-w-3xl space-y-4 py-8">
        <h2 className="text-2xl font-semibold text-white">Current Square Store Items</h2>
        <Card>
          <CardHeader>
            <CardTitle>Store Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map(item => (
                <StoreItemCard
                  key={item.id}
                  item={item}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
