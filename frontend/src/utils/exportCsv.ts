import { OrderRecord } from '../types';

export const exportOrdersToCsv = (orders: OrderRecord[], filename: string = 'analytics_orders_export.csv') => {
  if (!orders || orders.length === 0) return;

  const headers = [
    'BillNo',
    'Order_Datetime',
    'Outlet_Name',
    'Brand',
    'Group',
    'Item',
    'Price',
    'Quantity',
    'Revenue',
    'Order_Type',
    'Settlement'
  ];

  const csvRows = [
    headers.join(','),
    ...orders.map((row) => [
      `"${row.BillNo || ''}"`,
      `"${row.Order_Datetime || ''}"`,
      `"${(row.Outlet_Name || '').replace(/"/g, '""')}"`,
      `"${(row.Brand || '').replace(/"/g, '""')}"`,
      `"${(row.Group || '').replace(/"/g, '""')}"`,
      `"${(row.Item || '').replace(/"/g, '""')}"`,
      row.Price,
      row.Quantity,
      row.Revenue,
      `"${(row.Order_Type || '').replace(/"/g, '""')}"`,
      `"${(row.Settlement || '').replace(/"/g, '""')}"`
    ].join(','))
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
