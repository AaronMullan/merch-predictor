import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { CatalogItem } from './types';
import { useState } from 'react';
import { EditItemModal } from './EditItemModal';

interface StoreItemCardProps {
  item: CatalogItem;
  onUpdate?: (updatedItem: CatalogItem) => Promise<void>;
}

export function StoreItemCard({ item, onUpdate }: StoreItemCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleUpdate = async (updatedItem: CatalogItem) => {
    if (onUpdate) {
      await onUpdate(updatedItem);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{item.itemData?.name}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditModalOpen(true)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Badge variant={item.isDeleted ? 'destructive' : 'default'}>
                {item.isDeleted ? 'Deleted' : 'Active'}
              </Badge>
            </div>
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
                        ? (Number(variation.itemVariationData.priceMoney.amount) / 100).toFixed(2)
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
      <EditItemModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        item={item}
        onSave={handleUpdate}
      />
    </>
  );
}
