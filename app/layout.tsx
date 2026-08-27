import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Assessment1 — Business Analytics Dashboard | Celceya',
  description:
    'Restaurant Sales & Performance Intelligence dashboard built by Celceya for Assessment1. High performance analytics over 300,000 order line items.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
