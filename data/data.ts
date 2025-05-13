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
  { name: 'Green T-shirt Small', price: 25, stock: 33 },
  { name: 'Green T-shirt Large', price: 25, stock: 48 },
  { name: 'Black T-shirt Small', price: 25, stock: 4 },
  { name: 'Black T-shirt Large', price: 25, stock: 9 },
  { name: 'Tour Poster', price: 15, stock: 351 },
  { name: 'CD', price: 10, stock: 200 },
  { name: 'Vinyl', price: 30, stock: 50 },
];

export const cities: City[] = [
  {
    name: 'New York',
    date: '2025-01-15',
    capacity: 1000,
    sales: {
      'Green T-shirt Small': 4,
      'Green T-shirt Large': 15,
      'Black T-shirt Small': 4,
      'Black T-shirt Large': 6,
      'Tour Poster': 72,
      CD: 60,
      Vinyl: 37,
    },
  },
  {
    name: 'Los Angeles',
    date: '2025-02-20',
    capacity: 800,
    sales: {
      'Green T-shirt Small': 3,
      'Green T-shirt Large': 12,
      'Black T-shirt Small': 3,
      'Black T-shirt Large': 5,
      'Tour Poster': 58,
      CD: 48,
      Vinyl: 29,
    },
  },
  {
    name: 'Chicago',
    date: '2025-03-10',
    capacity: 500,
    sales: {
      'Green T-shirt Small': 2,
      'Green T-shirt Large': 8,
      'Black T-shirt Small': 2,
      'Black T-shirt Large': 3,
      'Tour Poster': 36,
      CD: 30,
      Vinyl: 18,
    },
  },
  {
    name: 'Houston',
    date: '2025-06-15',
    capacity: 600,
  },
  {
    name: 'Miami',
    date: '2025-07-20',
    capacity: 400,
  },
  {
    name: 'Seattle',
    date: '2025-08-10',
    capacity: 800,
  },
  {
    name: 'Boston',
    date: '2024-12-01',
    capacity: 700,
    sales: {
      'Green T-shirt Small': 3,
      'Green T-shirt Large': 10,
      'Black T-shirt Small': 3,
      'Black T-shirt Large': 4,
      'Tour Poster': 50,
      CD: 42,
      Vinyl: 26,
    },
  },
  {
    name: 'Philadelphia',
    date: '2024-12-15',
    capacity: 500,
    sales: {
      'Green T-shirt Small': 2,
      'Green T-shirt Large': 7,
      'Black T-shirt Small': 2,
      'Black T-shirt Large': 3,
      'Tour Poster': 36,
      CD: 30,
      Vinyl: 18,
    },
  },
  {
    name: 'San Francisco',
    date: '2024-12-30',
    capacity: 650,
    sales: {
      'Green T-shirt Small': 3,
      'Green T-shirt Large': 10,
      'Black T-shirt Small': 3,
      'Black T-shirt Large': 4,
      'Tour Poster': 46,
      CD: 39,
      Vinyl: 24,
    },
  },
  {
    name: 'Denver',
    date: '2025-09-05',
    capacity: 300,
  },
  {
    name: 'Austin',
    date: '2025-09-20',
    capacity: 400,
  },
  {
    name: 'Portland',
    date: '2025-10-10',
    capacity: 200,
  },
];
