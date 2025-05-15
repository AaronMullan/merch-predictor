import { SquareClient, SquareEnvironment } from 'square';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

async function createCatalogItems(items) {
  const client = new SquareClient({
    environment: SquareEnvironment.Sandbox,
    token: process.env.SQUARE_ACCESS_TOKEN,
  });

  console.log('Received items:', JSON.stringify(items, null, 2));

  // Validate items before processing
  const validItems = items.filter(item => {
    console.log('Validating item:', JSON.stringify(item, null, 2));
    if (!item.name) {
      console.error('Invalid item: missing name property');
      return false;
    }
    if (typeof item.name !== 'string') {
      console.error('Invalid item: name is not a string');
      return false;
    }
    if (item.name.trim() === '') {
      console.error('Invalid item: name is empty after trimming');
      return false;
    }
    return true;
  });

  console.log('Valid items after filtering:', JSON.stringify(validItems, null, 2));

  if (validItems.length === 0) {
    throw new Error('No valid items to process');
  }

  const results = [];
  for (const item of validItems) {
    if (item.isDeleted) {
      // If the item is marked for deletion, use the DeleteCatalogObject endpoint
      try {
        const result = await client.catalog.object.delete({
          objectId: item.id,
        });
        results.push(result);
        continue;
      } catch (error) {
        console.error('Error deleting catalog object:', error);
        results.push({ error });
        continue;
      }
    }

    // For non-deleted items, proceed with create/update
    const basePrice = parseFloat(item.basePrice) || 0;
    const baseInventory = parseInt(item.baseInventory) || 0;

    const batch = {
      objects: [
        {
          type: 'ITEM',
          id: item.id || `#${uuidv4()}`,
          version: item.version ? BigInt(item.version) : undefined,
          itemData: {
            name: item.name.trim(),
            priceMoney: {
              amount: BigInt(Math.round(basePrice * 100)),
              currency: 'USD',
            },
            trackInventory: true,
            variations:
              item.hasVariations && item.variations?.length > 0
                ? item.variations
                    .map(variation => {
                      if (
                        !variation.name ||
                        typeof variation.name !== 'string' ||
                        variation.name.trim() === ''
                      ) {
                        console.error(`Invalid variation name for item ${item.name}`);
                        return null;
                      }
                      const price = parseFloat(variation.price) || basePrice;
                      const inventory = parseInt(variation.inventory) || baseInventory;
                      return {
                        type: 'ITEM_VARIATION',
                        id: variation.id || `#${uuidv4()}`,
                        version: variation.version ? BigInt(variation.version) : undefined,
                        presentAtAllLocations: true,
                        itemVariationData: {
                          name: variation.name.trim(),
                          sku: variation.sku || `SKU-${variation.name.trim()}`,
                          pricing_type: 'FIXED_PRICING',
                          priceMoney: {
                            amount: BigInt(Math.round(price * 100)),
                            currency: 'USD',
                          },
                          trackInventory: true,
                        },
                      };
                    })
                    .filter(Boolean)
                : [
                    {
                      type: 'ITEM_VARIATION',
                      id: `#${uuidv4()}`,
                      presentAtAllLocations: true,
                      itemVariationData: {
                        name: 'Regular',
                        sku: `SKU-${item.name.trim()}-regular`,
                        pricing_type: 'FIXED_PRICING',
                        priceMoney: {
                          amount: BigInt(Math.round(basePrice * 100)),
                          currency: 'USD',
                        },
                        trackInventory: true,
                      },
                    },
                  ],
          },
        },
      ],
    };

    // Create or update the catalog item
    const result = await client.catalog.batchUpsert({
      idempotencyKey: uuidv4(),
      batches: [batch],
    });
    results.push(result);

    // Wait a moment for the catalog items to be fully created/updated
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get the created/updated catalog items to get their actual IDs
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

    // Find the item we just created/updated
    const createdItem = catalogResponse.items.find(
      item => item.itemData.name === batch.objects[0].itemData.name
    );

    if (!createdItem) {
      console.error('Could not find created/updated item in catalog');
      continue;
    }

    // Then, update inventory for each variation
    const variations = createdItem.itemData.variations;
    const originalItem = validItems.find(item => item.name === createdItem.itemData.name);

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
        inventoryCount = parseInt(matchingVariation?.inventory) || 0;
      } else {
        inventoryCount = parseInt(originalItem.baseInventory) || 0;
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
