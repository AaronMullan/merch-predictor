import { SquareClient, SquareEnvironment } from 'square';
import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config();

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: SquareEnvironment.Sandbox,
});

interface CatalogVariation {
  id: string;
  type: string;
  version?: string;
  itemVariationData?: {
    name: string;
    sku?: string;
    priceMoney?: {
      amount: bigint;
      currency: string;
    };
  };
}

interface CatalogItem {
  id: string;
  type: string;
  updatedAt: string;
  version?: string;
  isDeleted: boolean;
  itemData?: {
    name: string;
    description?: string;
    variations?: CatalogVariation[];
  };
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const response = await client.catalog.list({
      types: 'ITEM',
      cursor: undefined,
    });

    const item = response.data?.find(obj => obj.id === params.id) as CatalogItem | undefined;

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Get inventory counts for variations
    const variations = item.itemData?.variations || [];
    const variationIds = variations.map((variation: CatalogVariation) => variation.id);

    const inventoryResponse = await client.inventory.batchGetCounts({
      catalogObjectIds: variationIds,
    });

    // Create a map of variation IDs to their inventory counts
    const inventoryCounts = new Map<string, string>();
    if (inventoryResponse.data) {
      for (const count of inventoryResponse.data) {
        const catalogObjectId = count.catalogObjectId;
        if (
          typeof catalogObjectId === 'string' &&
          count.quantity !== null &&
          count.quantity !== undefined
        ) {
          inventoryCounts.set(catalogObjectId, count.quantity);
        }
      }
    }

    // Process the result to handle BigInt values
    const processedItem = {
      id: item.id,
      type: item.type,
      updatedAt: item.updatedAt || '',
      version: item.version?.toString(),
      isDeleted: item.isDeleted || false,
      itemData: item.itemData
        ? {
            name: item.itemData.name || '',
            description: item.itemData.description,
            variations: item.itemData.variations?.map((variation: CatalogVariation) => ({
              id: variation.id,
              type: variation.type,
              version: variation.version?.toString(),
              itemVariationData: variation.itemVariationData
                ? {
                    name: variation.itemVariationData.name || '',
                    sku: variation.itemVariationData.sku,
                    priceMoney: variation.itemVariationData.priceMoney
                      ? {
                          amount: variation.itemVariationData.priceMoney.amount.toString() || '0',
                          currency: variation.itemVariationData.priceMoney.currency || 'USD',
                        }
                      : undefined,
                    inventory: inventoryCounts.get(variation.id) || '0',
                  }
                : undefined,
            })),
          }
        : undefined,
    };

    return NextResponse.json(processedItem);
  } catch (error) {
    console.error('Error fetching catalog item:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch catalog item',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
