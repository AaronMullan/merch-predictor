import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { EditItemModal } from '../EditItemModal';
import { CatalogItem } from '../types';

// Mock the toast hook
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('EditItemModal', () => {
  const mockItem: CatalogItem = {
    id: 'test-item-1',
    type: 'ITEM',
    updatedAt: '2024-03-20T00:00:00Z',
    isDeleted: false,
    itemData: {
      name: 'Test Item',
      variations: [
        {
          id: 'var-1',
          type: 'ITEM_VARIATION',
          itemVariationData: {
            name: 'Default',
            sku: 'TEST-1',
            inventory: 10,
            priceMoney: {
              amount: '1000',
              currency: 'USD',
            },
          },
        },
      ],
    },
  };

  const mockOnUpdate = jest.fn();
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal with initial item data', () => {
    render(
      <EditItemModal
        open={true}
        onOpenChange={mockOnOpenChange}
        item={mockItem}
        onUpdate={mockOnUpdate}
      />
    );

    // Check if the modal title is rendered
    expect(screen.getByText('Edit Item')).toBeInTheDocument();

    // Check if the description is present
    expect(
      screen.getByText('Form to edit item details including name, price, inventory, and variations')
    ).toBeInTheDocument();

    // Check if the initial item data is displayed correctly
    expect(screen.getByLabelText('Item Name')).toHaveValue('Test Item');
    expect(screen.getByLabelText('Base Price')).toHaveValue(10);
    expect(screen.getByLabelText('Base Inventory')).toHaveValue(10);

    // Check if the variations checkbox is not checked initially
    expect(screen.getByLabelText('This item has variations')).not.toBeChecked();
  });
});
