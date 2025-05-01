import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { merchandise, cities, City } from './data';

// Calculate average sales per capacity for each item
const calculateAverageSalesPerCapacity = (cities: City[]) => {
  const totals: { [key: string]: { sales: number; capacity: number } } = {};

  cities.forEach(city => {
    if (city.sales) {
      Object.entries(city.sales).forEach(([item, sales]) => {
        if (!totals[item]) {
          totals[item] = { sales: 0, capacity: 0 };
        }
        totals[item].sales += sales;
        totals[item].capacity += city.capacity;
      });
    }
  });

  const averages: { [key: string]: number } = {};
  Object.entries(totals).forEach(([item, data]) => {
    averages[item] = data.sales / data.capacity;
  });

  return averages;
};

export default function Home() {
  const today = new Date().toISOString().split('T')[0];
  const citiesInThePast = cities.filter(city => city.date < today);
  const averages = calculateAverageSalesPerCapacity(citiesInThePast);

  // Calculate remaining stock after each city
  const calculateRemainingStock = (itemName: string) => {
    let remainingStock = merchandise.find(m => m.name === itemName)?.stock ?? 0;
    const stockByCity: { [cityName: string]: number } = {};

    // Sort cities by date to process in chronological order
    const sortedCities = [...cities].sort((a, b) => a.date.localeCompare(b.date));

    sortedCities.forEach(city => {
      if (city.date >= today) {
        // For future dates, check if we have enough stock for this city
        const predictedSales = Math.round(city.capacity * averages[itemName]);
        stockByCity[city.name] = remainingStock;
        remainingStock -= predictedSales;
      }
    });

    return { stockByCity, finalStock: remainingStock };
  };

  return (
    <div>
      <Table>
        <TableHeader className="py-4">
          <TableRow className="bg-black text-white">
            <TableHead>Item</TableHead>
            {cities.map(city => (
              <TableHead key={city.name} className="text-center">
                {city.name}
                <div className="text-sm font-normal">
                  {city.date}
                  <div className="text-xs">Capacity: {city.capacity.toLocaleString()}</div>
                  {city.date >= today && (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400">
                      Predicted Sales
                    </div>
                  )}
                </div>
              </TableHead>
            ))}
            <TableHead className="text-center">
              Final Stock
              <div className="text-muted-foreground text-xs">After All Sales</div>
            </TableHead>
            <TableHead className="text-center">
              Missed Sales
              <div className="text-muted-foreground text-xs">Potential Revenue Lost</div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {merchandise.map((item, index) => {
            const { stockByCity, finalStock } = calculateRemainingStock(item.name);
            const missedSales = finalStock < 0 ? Math.abs(finalStock) * item.price : 0;

            return (
              <TableRow
                key={item.name}
                className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : ''}
              >
                <TableCell className="font-medium">
                  {item.name}
                  <div className="text-muted-foreground text-sm">${item.price}</div>
                  <div className="text-muted-foreground text-xs">Stock: {item.stock}</div>
                </TableCell>
                {cities.map(city => {
                  const predictedSales =
                    city.date >= today ? Math.round(city.capacity * averages[item.name]) : 0;
                  const hasEnoughStock = stockByCity[city.name] >= predictedSales;

                  return (
                    <TableCell
                      key={city.name}
                      className={`text-center ${
                        city.date >= today
                          ? hasEnoughStock
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-red-600 dark:text-red-400'
                          : ''
                      }`}
                    >
                      {city.date >= today ? predictedSales : (city.sales?.[item.name] ?? 0)}
                    </TableCell>
                  );
                })}
                <TableCell
                  className={`text-center ${
                    finalStock >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {finalStock}
                </TableCell>
                <TableCell className="text-center text-red-600 dark:text-red-400">
                  {missedSales > 0 ? `$${missedSales.toLocaleString()}` : '-'}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow className="bg-gray-100 font-bold dark:bg-gray-800">
            <TableCell colSpan={cities.length + 2} className="text-right">
              Predicted Revenue:
            </TableCell>
            <TableCell className="text-center text-emerald-600 dark:text-emerald-400">
              $
              {merchandise
                .reduce((total, item) => {
                  const { stockByCity } = calculateRemainingStock(item.name);
                  return (
                    total +
                    cities.reduce((cityTotal, city) => {
                      if (city.date >= today) {
                        const predictedSales = Math.round(city.capacity * averages[item.name]);
                        const hasEnoughStock = stockByCity[city.name] >= predictedSales;
                        return cityTotal + (hasEnoughStock ? predictedSales * item.price : 0);
                      }
                      return cityTotal;
                    }, 0)
                  );
                }, 0)
                .toLocaleString()}
            </TableCell>
          </TableRow>
          <TableRow className="bg-gray-100 font-bold dark:bg-gray-800">
            <TableCell colSpan={cities.length + 2} className="text-right">
              Total Potential Revenue Lost Due to Lack of Stock:
            </TableCell>
            <TableCell className="text-center text-red-600 dark:text-red-400">
              $
              {merchandise
                .reduce((total, item) => {
                  const { finalStock } = calculateRemainingStock(item.name);
                  return total + (finalStock < 0 ? Math.abs(finalStock) * item.price : 0);
                }, 0)
                .toLocaleString()}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
