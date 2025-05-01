import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type MerchandiseItem = {
  name: string;
  price: number;
};

type SalesData = {
  [key: string]: number;
};

type City = {
  name: string;
  date: string;
  capacity: number;
  sales: SalesData;
};

const merchandise: MerchandiseItem[] = [
  { name: 'Green T-shirt Small', price: 25 },
  { name: 'Green T-shirt Large', price: 25 },
  { name: 'Black T-shirt Small', price: 25 },
  { name: 'Black T-shirt Large', price: 25 },
  { name: 'Tour Poster', price: 15 },
  { name: 'CD', price: 10 },
  { name: 'Vinyl', price: 30 },
];

const cities: City[] = [
  {
    name: 'New York',
    date: '2024-04-29',
    capacity: 20000,
    sales: {
      'Green T-shirt Small': 45,
      'Green T-shirt Large': 38,
      'Black T-shirt Small': 52,
      'Black T-shirt Large': 47,
      'Tour Poster': 120,
      CD: 85,
      Vinyl: 65,
    },
  },
  {
    name: 'Los Angeles',
    date: '2025-04-30',
    capacity: 18000,
    sales: {
      'Green T-shirt Small': 38,
      'Green T-shirt Large': 42,
      'Black T-shirt Small': 45,
      'Black T-shirt Large': 40,
      'Tour Poster': 95,
      CD: 70,
      Vinyl: 55,
    },
  },
  {
    name: 'Chicago',
    date: '2025-05-01',
    capacity: 15000,
    sales: {
      'Green T-shirt Small': 32,
      'Green T-shirt Large': 35,
      'Black T-shirt Small': 38,
      'Black T-shirt Large': 33,
      'Tour Poster': 85,
      CD: 60,
      Vinyl: 45,
    },
  },
  {
    name: 'Houston',
    date: '2025-05-02',
    capacity: 12000,
    sales: {
      'Green T-shirt Small': 28,
      'Green T-shirt Large': 30,
      'Black T-shirt Small': 35,
      'Black T-shirt Large': 32,
      'Tour Poster': 75,
      CD: 55,
      Vinyl: 40,
    },
  },
];

// Calculate average sales per capacity for each item
const calculateAverageSalesPerCapacity = (cities: City[]) => {
  const totals: { [key: string]: { sales: number; capacity: number } } = {};

  cities.forEach(city => {
    Object.entries(city.sales).forEach(([item, sales]) => {
      if (!totals[item]) {
        totals[item] = { sales: 0, capacity: 0 };
      }
      totals[item].sales += sales;
      totals[item].capacity += city.capacity;
    });
  });

  const averages: { [key: string]: number } = {};
  Object.entries(totals).forEach(([item, data]) => {
    averages[item] = data.sales / data.capacity;
  });

  return averages;
};

// Predict sales based on capacity and historical averages
const predictSales = (capacity: number, averages: { [key: string]: number }) => {
  const predictions: SalesData = {};
  Object.entries(averages).forEach(([item, rate]) => {
    predictions[item] = Math.round(capacity * rate);
  });
  return predictions;
};

export default function Home() {
  const today = new Date().toISOString().split('T')[0];
  const averages = calculateAverageSalesPerCapacity(cities);

  return (
    <div>
      <Table>
        <TableHeader>
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {merchandise.map(item => (
            <TableRow key={item.name}>
              <TableCell className="font-medium">
                {item.name}
                <div className="text-muted-foreground text-sm">${item.price}</div>
              </TableCell>
              {cities.map(city => (
                <TableCell
                  key={city.name}
                  className={`text-center ${city.date >= today ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
                >
                  {city.date >= today
                    ? Math.round(city.capacity * averages[item.name])
                    : city.sales[item.name]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
