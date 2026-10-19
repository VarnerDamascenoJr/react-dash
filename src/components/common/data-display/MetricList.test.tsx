import { render, screen, within } from '@testing-library/react';
import MetricList from './MetricList';

test('replaces the empty state with prepared metric labels and values when data arrives', () => {
  const { rerender } = render(<MetricList items={[]} emptyText="No metrics available" />);
  expect(screen.getByText('No metrics available')).toBeVisible();
  expect(screen.queryByRole('list')).not.toBeInTheDocument();

  rerender(<MetricList
    items={[
      { id: 'conversion', label: 'Created -> Paid', value: '75%' },
      { id: 'duration', label: 'Payment time', value: '12 s' },
    ]}
    emptyText="No metrics available"
  />);

  expect(screen.queryByText('No metrics available')).not.toBeInTheDocument();
  const items = screen.getAllByRole('listitem');
  expect(items).toHaveLength(2);
  expect(within(items[0]).getByText('Created -> Paid')).toBeVisible();
  expect(within(items[0]).getByText('75%')).toBeVisible();
  expect(within(items[1]).getByText('Payment time')).toBeVisible();
  expect(within(items[1]).getByText('12 s')).toBeVisible();
});
