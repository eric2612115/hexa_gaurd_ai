// app/transactions/page.tsx
'use client';
import React from 'react';
import { Typography } from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/layout/PageHeader';

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Transactions Management"
        subtitle="Manage and trace every transactions"
        breadcrumbs={[
          { label: 'main page', href: '/' },
          { label: 'Transactions Managemen', href: '/transactions' },
        ]}
      />
      <Typography variant="body1">Transactions Management page content will be implemented here</Typography>
    </DashboardLayout>
  );
}

