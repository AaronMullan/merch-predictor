import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CatalogItem } from './types';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface DeleteItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: CatalogItem;
  onDelete: (item: CatalogItem) => Promise<void>;
}

export function DeleteItemModal({ open, onOpenChange, item, onDelete }: DeleteItemModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(item);
      toast({
        title: 'Success',
        description: 'Item deleted successfully',
        className: 'bg-green-50 border-green-200 text-green-800',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete item',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{item.itemData?.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
