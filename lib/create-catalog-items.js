import { SquareClient, SquareEnvironment } from 'square';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

async function createCatalogItems(items) {
  const client = new SquareClient({
    environment: SquareEnvironment.Sandbox,
    token: process.env.SQUARE_ACCESS_TOKEN,
  });

  const batches = items.map(item => ({
    objects: [
      {
        type: 'ITEM',
        id: `#${uuidv4()}`,
        itemData: {
          name: item.name,
          priceMoney: {
            amount: BigInt(Math.round(item.basePrice * 100)),
            currency: 'USD',
          },
          trackInventory: true,
          variations:
            item.hasVariations && item.variations.length > 0
              ? item.variations.map(variation => ({
                  type: 'ITEM_VARIATION',
                  id: `#${uuidv4()}`,
                  presentAtAllLocations: true,
                  itemVariationData: {
                    name: variation.name,
                    sku: variation.sku || `SKU-${variation.name}`,
                    pricing_type: 'FIXED_PRICING',
                    priceMoney: {
                      amount: BigInt(Math.round(variation.price * 100)),
                      currency: 'USD',
                    },
                    trackInventory: true,
                  },
                }))
              : [
                  {
                    type: 'ITEM_VARIATION',
                    id: `#${uuidv4()}`,
                    presentAtAllLocations: true,
                    itemVariationData: {
                      name: 'Regular',
                      sku: `SKU-${item.name}-regular`,
                      pricing_type: 'FIXED_PRICING',
                      priceMoney: {
                        amount: BigInt(Math.round(item.basePrice * 100)),
                        currency: 'USD',
                      },
                      trackInventory: true,
                    },
                  },
                ],
        },
      },
    ],
  }));

  const results = [];
  for (const batch of batches) {
    // First, create the catalog items
    const result = await client.catalog.batchUpsert({
      idempotencyKey: uuidv4(),
      batches: [batch],
    });
    results.push(result);

    // Wait a moment for the catalog items to be fully created
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get the created catalog items to get their actual IDs
    const catalogResponse = await client.catalog.searchItems({
      enabledLocationIds: [process.env.SQUARE_LOCATION_ID],
      productTypes: ['REGULAR'],
      limit: 100,
      sortOrder: 'DESC', // Most recent first
    });

    if (!catalogResponse.items) {
      console.error('No items found in catalog response');
      continue;
    }

    // Find the item we just created
    const createdItem = catalogResponse.items.find(
      item => item.itemData.name === batch.objects[0].itemData.name
    );

    if (!createdItem) {
      console.error('Could not find created item in catalog');
      continue;
    }

    // Then, update inventory for each variation
    const variations = createdItem.itemData.variations;
    const originalItem = items.find(item => item.name === createdItem.itemData.name);

    if (!originalItem) {
      console.error('Could not find original item data');
      continue;
    }

    const inventoryChanges = variations.map(variation => {
      let inventoryCount;
      if (originalItem.hasVariations) {
        const matchingVariation = originalItem.variations.find(
          v => v.name === variation.itemVariationData.name
        );
        inventoryCount = matchingVariation?.inventory || 0;
      } else {
        inventoryCount = originalItem.baseInventory || 0;
      }

      return {
        type: 'PHYSICAL_COUNT',
        physicalCount: {
          referenceId: uuidv4(),
          catalogObjectId: variation.id,
          state: 'IN_STOCK',
          locationId: process.env.SQUARE_LOCATION_ID,
          quantity: inventoryCount.toString(),
          occurredAt: new Date().toISOString(),
        },
      };
    });

    if (inventoryChanges.length > 0) {
      try {
        const inventoryResult = await client.inventory.batchCreateChanges({
          idempotencyKey: uuidv4(),
          changes: inventoryChanges,
          ignoreUnchangedCounts: true,
        });
      } catch (error) {
        console.error('Failed to update inventory:', error);
        console.error('Error details:', {
          changes: inventoryChanges,
          error: error.message,
          response: error.response?.body,
        });
      }
    }
  }

  return results;
}

// Export the function for use in API routes
export { createCatalogItems };
