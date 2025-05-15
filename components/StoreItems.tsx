'use client';

import { useEffect, useState } from 'react';
import { fetchCatalogItems } from '@/lib/fetch-catalog-items';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CatalogItem {
  id: string;
  type: string;
  updatedAt: string;
  version?: string;
  isDeleted: boolean;
  itemData?: {
    name: string;
    description?: string;
    variations?: Array<{
      id: string;
      type: string;
      itemVariationData?: {
        name: string;
        sku?: string;
        priceMoney?: {
          amount: string;
          currency: string;
        };
      };
    }>;
  };
}

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Current Store Items</h2>
      {items.length === 0 ? (
        <p>No items found in the catalog.</p>
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
                          {variation.itemVariationData?.sku && (
                            <p className="text-muted-foreground text-sm">
                              SKU: {variation.itemVariationData.sku}
                            </p>
                          )}
                        </div>
                        <p className="font-medium">
                          $
                          {variation.itemVariationData?.priceMoney
                            ? (Number(variation.itemVariationData.priceMoney.amount) / 100).toFixed(
                                2
                              )
                            : 'N/A'}
                        </p>
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
  );
}
