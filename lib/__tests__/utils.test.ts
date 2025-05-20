import { calculateAverageSalesPerCapacity } from '../utils';
import { City } from '@/data/data';

describe('calculateAverageSalesPerCapacity', () => {
  // Clear any cached results before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calculates correct averages for items with sales data', () => {
    const cities: City[] = [
      {
        name: 'City 1',
        date: '2024-01-01',
        capacity: 1000,
        sales: {
          'T-shirt': 50,
          Poster: 100,
        },
      },
      {
        name: 'City 2',
        date: '2024-01-02',
        capacity: 2000,
        sales: {
          'T-shirt': 100,
          Poster: 200,
        },
      },
    ];

    const averages = calculateAverageSalesPerCapacity(cities);

    // T-shirt: (50 + 100) / (1000 + 2000) = 150/3000 = 0.05
    expect(averages['T-shirt']).toBeCloseTo(0.05);
    // Poster: (100 + 200) / (1000 + 2000) = 300/3000 = 0.1
    expect(averages['Poster']).toBeCloseTo(0.1);
  });

  it('handles cities without sales data', () => {
    const cities: City[] = [
      {
        name: 'City 1',
        date: '2024-01-01',
        capacity: 1000,
        sales: {
          'T-shirt': 70,
        },
      },
      {
        name: 'City 2',
        date: '2024-01-02',
        capacity: 2000,
        // No sales data
      },
    ];

    const averages = calculateAverageSalesPerCapacity(cities);

    // T-shirt: 70 / 1000 = 0.07
    expect(averages['T-shirt']).toBe(0.07); // Increased precision to 4 decimal places
  });

  it('returns empty object for cities with no sales data', () => {
    const cities: City[] = [
      {
        name: 'City 1',
        date: '2024-01-01',
        capacity: 1000,
      },
      {
        name: 'City 2',
        date: '2024-01-02',
        capacity: 2000,
      },
    ];

    const averages = calculateAverageSalesPerCapacity(cities);
    expect(averages).toEqual({});
  });

  it('handles empty cities array', () => {
    const cities: City[] = [];
    const averages = calculateAverageSalesPerCapacity(cities);
    expect(averages).toEqual({});
  });
});
