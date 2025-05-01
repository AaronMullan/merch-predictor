export type MerchandiseItem = {
  name: string;
  price: number;
  stock: number;
};

export type SalesData = {
  [key: string]: number;
};

export type City = {
  name: string;
  date: string;
  capacity: number;
  sales?: SalesData;
};

export const merchandise: MerchandiseItem[] = [
  { name: 'Green T-shirt Small', price: 25, stock: 50 },
  { name: 'Green T-shirt Large', price: 25, stock: 200 },
  { name: 'Black T-shirt Small', price: 25, stock: 200 },
  { name: 'Black T-shirt Large', price: 25, stock: 200 },
  { name: 'Tour Poster', price: 15, stock: 200 },
  { name: 'CD', price: 10, stock: 200 },
  { name: 'Vinyl', price: 30, stock: 50 },
];

export const cities: City[] = [
  {
    name: 'New York',
    date: '2024-04-29',
    capacity: 20000,
    sales: {
      'Green T-shirt Small': 45,
      'Green T-shirt Large': 38,
      'Black T-shirt Small': 52,
      'Black T-shirt Large': 47,
      'Tour Poster': 100,
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
  },
  {
    name: 'Houston',
    date: '2025-05-02',
    capacity: 12000,
  },
];
