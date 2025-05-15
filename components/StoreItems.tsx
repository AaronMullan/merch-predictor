'use client';

import { useEffect, useState } from 'react';
import { fetchCatalogItems } from '@/lib/fetch-catalog-items';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CatalogItem } from './types';
import { Skeleton } from '@/components/ui/skeleton';

export function StoreItems() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadItems() {
      try {
        const data = await fetchCatalogItems();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load items');
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

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
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{item.itemData?.name}</span>
                    <Badge variant={item.isDeleted ? 'destructive' : 'default'}>
                      {item.isDeleted ? 'Deleted' : 'Active'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {item.itemData?.description && (
                    <p className="text-muted-foreground mb-4">{item.itemData.description}</p>
                  )}
                  {item.itemData?.variations && item.itemData.variations.length > 0 ? (
                    <div className="space-y-2">
                      <h4 className="font-medium">Variations:</h4>
                      {item.itemData.variations.map(variation => (
                        <div
                          key={variation.id}
                          className="flex items-center justify-between rounded-lg border p-2"
                        >
                          <div>
                            <p className="font-medium">{variation.itemVariationData?.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              $
                              {variation.itemVariationData?.priceMoney
                                ? (
                                    Number(variation.itemVariationData.priceMoney.amount) / 100
                                  ).toFixed(2)
                                : 'N/A'}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              Stock: {variation.itemVariationData?.inventory || '0'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No variations</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
