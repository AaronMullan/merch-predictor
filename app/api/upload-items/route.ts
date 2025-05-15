import { createCatalogItems } from '@/lib/create-catalog-items';
import { NextResponse } from 'next/server';

interface CatalogItemData {
  name?: string;
  priceMoney?: {
    amount: bigint;
    currency: string;
  };
  variations?: Array<{
    type: string;
    id: string;
    itemVariationData: {
      name: string;
      sku: string;
      priceMoney: {
        amount: bigint;
        currency: string;
      };
    };
  }>;
}

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const results = await createCatalogItems(items);

    // Process the results to handle BigInt values
    const processedResults = results.map(result => ({
      errors: result.errors,
      objects: result.objects?.map(obj => {
        // Create a new object without the original BigInt values
        const processedObj = {
          type: obj.type,
          id: obj.id,
          updatedAt: obj.updatedAt,
          version: obj.version?.toString(),
          isDeleted: obj.isDeleted,
          presentAtAllLocations: obj.presentAtAllLocations,
          presentAtLocationIds: obj.presentAtLocationIds,
          absentAtLocationIds: obj.absentAtLocationIds,
        };

        // Handle itemData if it exists
        if (obj.type === 'ITEM' && 'itemData' in obj) {
          const itemData = obj.itemData as CatalogItemData;
          if (itemData) {
            (processedObj as any).itemData = {
              name: itemData.name || '',
              priceMoney: itemData.priceMoney
                ? {
                    amount: itemData.priceMoney.amount.toString(),
                    currency: itemData.priceMoney.currency || 'USD',
                  }
                : undefined,
              variations: itemData.variations
                ?.map((variation: any) => {
                  const variationData = variation.itemVariationData;
                  if (!variationData) return null;
                  return {
                    type: variation.type,
                    id: variation.id,
                    itemVariationData: {
                      name: variationData.name || '',
                      sku: variationData.sku || '',
                      priceMoney: {
                        amount: variationData.priceMoney.amount.toString(),
                        currency: variationData.priceMoney.currency || 'USD',
                      },
                    },
                  };
                })
                .filter(Boolean),
            };
          }
        }

        return processedObj;
      }),
    }));

    return NextResponse.json({ success: true, results: processedResults });
  } catch (error) {
    console.error('Error uploading items:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload items',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
