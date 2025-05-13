import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { merchandise, cities } from '@/data/data';
import { calculateAverageSalesPerCapacity, calculateRemainingStock } from '@/lib/utils';
import { Container } from './Container';

export function MerchTable() {
  const fakeToday = '2025-05-01'; // Fixed date of May 1st, 2025
  const citiesInThePast = cities.filter(city => city.date < fakeToday);
  const averages = calculateAverageSalesPerCapacity(citiesInThePast);

  // Sort cities by date
  const sortedCities = [...cities].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Container className="py-8">
      <SignedIn>
        <Table>
          <TableHeader className="py-4">
            <TableRow className="bg-black text-white">
              <TableHead>Item</TableHead>
              {sortedCities.map(city => (
                <TableHead key={city.name} className="text-center">
                  {city.name}
                  <div className="text-sm font-normal">
                    {city.date}
                    <div className="text-xs">Capacity: {city.capacity.toLocaleString()}</div>
                    {city.date >= fakeToday && (
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
              const { stockByCity, finalStock } = calculateRemainingStock(
                item.name,
                sortedCities,
                fakeToday,
                averages,
                item.stock
              );
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
                  {sortedCities.map(city => {
                    const predictedSales =
                      city.date >= fakeToday ? Math.round(city.capacity * averages[item.name]) : 0;
                    const hasEnoughStock = stockByCity[city.name] >= predictedSales;

                    return (
                      <TableCell
                        key={city.name}
                        className={`text-center ${
                          city.date >= fakeToday
                            ? hasEnoughStock
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                            : ''
                        }`}
                      >
                        {city.date >= fakeToday ? predictedSales : (city.sales?.[item.name] ?? 0)}
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
              <TableCell colSpan={sortedCities.length + 2} className="text-right">
                Predicted Revenue:
              </TableCell>
              <TableCell className="text-center text-emerald-600 dark:text-emerald-400">
                $
                {merchandise
                  .reduce((total, item) => {
                    const { stockByCity } = calculateRemainingStock(
                      item.name,
                      sortedCities,
                      fakeToday,
                      averages,
                      item.stock
                    );
                    return (
                      total +
                      sortedCities.reduce((cityTotal, city) => {
                        if (city.date >= fakeToday) {
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
              <TableCell colSpan={sortedCities.length + 2} className="text-right">
                Total Potential Revenue Lost Due to Lack of Stock:
              </TableCell>
              <TableCell className="text-center text-red-600 dark:text-red-400">
                $
                {merchandise
                  .reduce((total, item) => {
                    const { finalStock } = calculateRemainingStock(
                      item.name,
                      sortedCities,
                      fakeToday,
                      averages,
                      item.stock
                    );
                    return total + (finalStock < 0 ? Math.abs(finalStock) * item.price : 0);
                  }, 0)
                  .toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </SignedIn>
      <SignedOut>
        <div className="w-full text-center text-sm">
          Please{' '}
          <SignInButton>
            <button className="text-blue-500 underline hover:cursor-pointer">Sign In</button>
          </SignInButton>{' '}
          in to view the merch table
        </div>
      </SignedOut>
    </Container>
  );
}
