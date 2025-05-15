import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { CatalogItem } from './types';
import { useState } from 'react';
import { EditItemModal } from './EditItemModal';
import { DeleteItemModal } from './DeleteItemModal';

interface StoreItemCardProps {
  item: CatalogItem;
  onUpdate?: (updatedItem: CatalogItem) => Promise<void>;
  onDelete?: (item: CatalogItem) => Promise<void>;
}

export function StoreItemCard({ item, onUpdate, onDelete }: StoreItemCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleUpdate = async (updatedItem: CatalogItem) => {
    if (onUpdate) {
      await onUpdate(updatedItem);
    }
  };

  const handleDelete = async (itemToDelete: CatalogItem) => {
    if (onDelete) {
      await onDelete(itemToDelete);
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDeleteModalOpen(true)}
                className="h-8 w-8 hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
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
      <DeleteItemModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        item={item}
        onDelete={handleDelete}
      />
    </>
  );
}
