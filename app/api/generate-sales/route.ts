import { createSalesData } from '@/lib/create-sales-data';
import { NextResponse } from 'next/server';
import { LineItem } from '@/components/types';

export async function POST(request: Request) {
  try {
    const salesData = await request.json();

    if (!salesData || !salesData.startDate || !salesData.endDate || !salesData.averageSalesPerDay) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const results = await createSalesData(salesData);

    // Process the results to handle BigInt values
    const processedResults = results.map(result => {
      if (result.error) {
        return { error: result.error };
      }

      return {
        order: {
          id: result.order.id,
          createdAt: result.order.createdAt,
          updatedAt: result.order.updatedAt,
          state: result.order.state,
          totalMoney: {
            amount: result.order.totalMoney.amount.toString(),
            currency: result.order.totalMoney.currency,
          },
          lineItems: result.order.lineItems.map((item: LineItem) => ({
            name: item.name,
            quantity: item.quantity,
            catalogObjectId: item.catalogObjectId,
            basePriceMoney: {
              amount: item.basePriceMoney.amount.toString(),
              currency: item.basePriceMoney.currency,
            },
          })),
        },
        payment: {
          id: result.payment.id,
          createdAt: result.payment.createdAt,
          updatedAt: result.payment.updatedAt,
          status: result.payment.status,
          amountMoney: {
            amount: result.payment.amountMoney.amount.toString(),
            currency: result.payment.amountMoney.currency,
          },
        },
      };
    });

    return NextResponse.json({ success: true, results: processedResults });
  } catch (error) {
    console.error('Error generating sales data:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate sales data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
