import { SquareClient, SquareEnvironment } from 'square';
import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config();

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: SquareEnvironment.Sandbox,
});

interface CatalogItemVariation {
  id: string;
  type: string;
  itemVariationData?: {
    name?: string;
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
  updatedAt?: string;
  version?: bigint;
  isDeleted?: boolean;
  itemData?: {
    name?: string;
    description?: string;
    variations?: CatalogItemVariation[];
  };
}

export async function GET() {
  try {
    const response = await client.catalog.list({
      types: 'ITEM',
    });

    const items = response.data || [];

    // Process the results to handle BigInt values
    const processedItems = items.map((item: any) => ({
      id: item.id,
      type: item.type,
      updatedAt: item.updatedAt || '',
      version: item.version?.toString(),
      isDeleted: item.isDeleted || false,
      itemData: item.itemData
        ? {
            name: item.itemData.name || '',
            description: item.itemData.description,
            variations: item.itemData.variations?.map((variation: any) => ({
              id: variation.id,
              type: variation.type,
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
                  }
                : undefined,
            })),
          }
        : undefined,
    }));

    return NextResponse.json({ items: processedItems });
  } catch (error) {
    console.error('Error fetching catalog items:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch catalog items',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
