import { SquareClient, SquareEnvironment } from 'square';
import dotenv from 'dotenv';

dotenv.config();

const client = new SquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: SquareEnvironment.Sandbox,
});

export async function createSalesData(salesData) {
  const { startDate, endDate, averageSalesPerDay } = salesData;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const results = [];

  // Get all catalog items to randomly select from
  const catalogResponse = await client.catalogApi.searchCatalogItems({
    enabledLocationIds: [process.env.SQUARE_LOCATION_ID],
  });

  const catalogItems = catalogResponse.result.items || [];
  if (catalogItems.length === 0) {
    throw new Error('No catalog items found to generate sales for');
  }

  // Generate sales for each day
  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);

    // Generate random number of sales for this day (around averageSalesPerDay)
    const salesForDay = Math.floor(
      averageSalesPerDay * (0.5 + Math.random()) // Random variation between 50% and 150% of average
    );

    for (let j = 0; j < salesForDay; j++) {
      try {
        // Randomly select a catalog item
        const randomItem = catalogItems[Math.floor(Math.random() * catalogItems.length)];
        const randomQuantity = Math.floor(Math.random() * 3) + 1; // Random quantity between 1 and 3

        // Create an order
        const orderResponse = await client.ordersApi.createOrder({
          order: {
            locationId: process.env.SQUARE_LOCATION_ID,
            lineItems: [
              {
                name: randomItem.itemData.name,
                quantity: randomQuantity.toString(),
                catalogObjectId: randomItem.id,
              },
            ],
            fulfillments: [
              {
                type: 'PICKUP',
                pickupDetails: {
                  scheduledType: 'ASAP',
                },
              },
            ],
          },
        });

        // Create a payment for the order
        const paymentResponse = await client.paymentsApi.createPayment({
          sourceId: 'cnon:card-nonce-ok', // Using test card nonce
          idempotencyKey: `${currentDate.getTime()}-${j}`, // Unique key for each payment
          amountMoney: {
            amount: orderResponse.result.order.totalMoney.amount,
            currency: 'USD',
          },
          orderId: orderResponse.result.order.id,
        });

        results.push({
          order: orderResponse.result.order,
          payment: paymentResponse.result.payment,
        });
      } catch (error) {
        console.error('Error creating sale:', error);
        results.push({
          error: error.message,
        });
      }
    }
  }

  return results;
}
