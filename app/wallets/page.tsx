// app/wallets/page.tsx
'use client';
import React from 'react';
import { Typography } from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/layout/PageHeader';

export default function WalletsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Wallets Management"
        subtitle="Manage MPC wallets and transactions"
        breadcrumbs={[
          { label: 'Main Page', href: '/' },
          { label: 'Wallets Management', href: '/wallets' },
        ]}
      />
      <Typography variant="body1">Wallets Management page content will be implemented here</Typography>
    </DashboardLayout>
  );
}