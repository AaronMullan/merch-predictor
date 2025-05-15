// Catalog Item Types
export interface CatalogItemVariation {
  id: string;
  type: string;
  version?: string;
  itemVariationData?: {
    name: string;
    sku?: string;
    inventory?: number;
    priceMoney?: {
      amount: string;
      currency: string;
    };
  };
}

export interface CatalogItem {
  id: string;
  type: string;
  updatedAt: string;
  version?: string;
  isDeleted: boolean;
  itemData?: {
    name: string;
    description?: string;
    variations?: CatalogItemVariation[];
  };
}

// Form Types
export interface FormVariation {
  name: string;
  price: number;
  sku: string;
  inventory: number;
}

export interface FormItem {
  name: string;
  basePrice: number;
  hasVariations: boolean;
  variations: FormVariation[];
  baseInventory: number;
}

// Dialog Types
export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: FormItem[];
  onConfirm: () => void;
}

// Sales Types
export interface SalesData {
  startDate: string;
  endDate: string;
  averageSales: number;
}
