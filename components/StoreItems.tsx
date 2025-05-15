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
      setItems(data);
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
      const response = await fetch(`/api/catalog-items/${updatedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
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

  return (
    <div className="bg-muted-foreground">
      <div className="mx-auto max-w-3xl space-y-4 py-8">
        <h2 className="text-2xl font-semibold text-white">Current Store Items</h2>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <div className="space-y-2">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-white">No items found in the catalog.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(item => (
              <StoreItemCard key={item.id} item={item} onUpdate={handleUpdate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
