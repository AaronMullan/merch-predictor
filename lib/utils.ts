import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { City } from '@/data/data';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate average sales per capacity for each item
export const calculateAverageSalesPerCapacity = (cities: City[]) => {
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

// Calculate remaining stock after each city
export const calculateRemainingStock = (
  itemName: string,
  cities: City[],
  today: string,
  averages: { [key: string]: number },
  initialStock: number
) => {
  let remainingStock = initialStock;
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
