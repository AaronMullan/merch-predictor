import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import AboutPage from '../about/page';

describe('AboutPage', () => {
  it('renders the main heading', () => {
    render(<AboutPage />);
    expect(screen.getByText('About Merch Predictor')).toBeInTheDocument();
  });

  it('renders the introduction paragraph', () => {
    render(<AboutPage />);
    expect(
      screen.getByText(
        'Merch Predictor is a powerful tool designed to help touring artists and merchandise managers optimize their inventory and maximize revenue during tours.'
      )
    ).toBeInTheDocument();
  });

  it('renders the "How It Works" section with all list items', () => {
    render(<AboutPage />);

    // Check section heading
    expect(screen.getByText('How It Works')).toBeInTheDocument();

    // Check all list items
    const expectedListItems = [
      'Calculate average sales per capacity based on past performances',
      'Predict future sales for upcoming shows',
      'Track inventory levels across multiple tour dates',
      'Identify potential stock shortages before they occur',
      'Calculate potential revenue loss due to insufficient stock',
    ];

    expectedListItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('renders all feature cards with correct content', () => {
    render(<AboutPage />);

    // Check section heading
    expect(screen.getByText('Features')).toBeInTheDocument();

    // Check all feature cards
    const features = [
      {
        title: 'Sales Prediction',
        description:
          'Uses venue capacity and historical data to forecast sales for each item at upcoming shows.',
      },
      {
        title: 'Stock Management',
        description:
          'Tracks inventory levels across multiple tour dates and identifies potential shortages.',
      },
      {
        title: 'Revenue Analysis',
        description:
          'Calculates potential revenue loss due to stock shortages and helps optimize inventory decisions.',
      },
      {
        title: 'Visual Indicators',
        description:
          'Color-coded predictions help quickly identify items that may run out of stock.',
      },
    ];

    features.forEach(feature => {
      expect(screen.getByText(feature.title)).toBeInTheDocument();
      expect(screen.getByText(feature.description)).toBeInTheDocument();
    });
  });

  it('renders the back to dashboard link', () => {
    render(<AboutPage />);
    const backLink = screen.getByText('← Back to Dashboard');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/');
  });
});
