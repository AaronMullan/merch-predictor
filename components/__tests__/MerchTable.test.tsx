import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MerchTable } from '../MerchTable';
import { merchandise, cities } from '@/data/data';

// Mock Clerk's authentication components
jest.mock('@clerk/nextjs', () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SignInButton: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('MerchTable', () => {
  it('renders the table with correct headers', () => {
    render(<MerchTable />);

    // Check if the main headers are rendered
    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getByText('Final Stock')).toBeInTheDocument();
    expect(screen.getByText('Missed Sales')).toBeInTheDocument();

    // Check if city headers are rendered
    cities.forEach(city => {
      expect(screen.getByText(city.name)).toBeInTheDocument();
    });
  });

  it('renders merchandise items with their details', () => {
    render(<MerchTable />);

    merchandise.forEach(item => {
      // Check if item name is rendered
      const itemCell = screen.getByText(item.name).closest('td');
      expect(itemCell).toBeInTheDocument();

      // Check if price is rendered within the same cell
      expect(itemCell).toHaveTextContent(`$${item.price}`);

      // Check if stock is rendered within the same cell
      expect(itemCell).toHaveTextContent(`Stock: ${item.stock}`);
    });
  });

  it('shows predicted sales for future dates', () => {
    render(<MerchTable />);

    // Find a future city (after 2025-05-01)
    const futureCity = cities.find(city => city.date > '2025-05-01');
    if (futureCity) {
      // Check if "Predicted Sales" label is shown for future cities
      const cityHeader = screen.getByText(futureCity.name).closest('th');
      expect(cityHeader).toHaveTextContent('Predicted Sales');
    }
  });

  it('shows actual sales for past dates', () => {
    render(<MerchTable />);

    // Find a past city (before 2025-05-01)
    const pastCity = cities.find(city => city.date < '2025-05-01');
    if (pastCity && pastCity.sales) {
      // Check if actual sales are shown for past cities
      Object.entries(pastCity.sales).forEach(([itemName, sales]) => {
        // Find the item row first
        const itemRow = screen.getByText(itemName).closest('tr');
        // Find the city header
        const cityHeader = screen.getByText(pastCity.name).closest('th');
        // Get the index of the city column
        const cityIndex = Array.from(cityHeader?.parentElement?.children || []).indexOf(
          cityHeader!
        );
        // Find the sales cell in that column
        const salesCell = itemRow?.children[cityIndex] as HTMLElement;
        expect(salesCell).toHaveTextContent(sales.toString());
      });
    }
  });

  it('calculates and displays final stock', () => {
    render(<MerchTable />);

    merchandise.forEach(item => {
      // Find the item row
      const itemRow = screen.getByText(item.name).closest('tr');
      // Find the final stock cell (second to last cell)
      const finalStockCell = itemRow?.children[itemRow.children.length - 2] as HTMLElement;
      expect(finalStockCell).toBeInTheDocument();
      // Check if it contains either a number (including negative) or a dash
      expect(finalStockCell).toHaveTextContent(/^-?\d+$|^-$/);
    });
  });

  it('calculates and displays missed sales revenue', () => {
    render(<MerchTable />);

    // Check if the total missed sales row is present
    expect(
      screen.getByText('Total Potential Revenue Lost Due to Lack of Stock:')
    ).toBeInTheDocument();

    // Check if the predicted revenue row is present
    expect(screen.getByText('Predicted Revenue:')).toBeInTheDocument();
  });
});
