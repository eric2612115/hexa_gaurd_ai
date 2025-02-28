// app/policies/page.tsx
'use client';
import React from 'react';
import { Typography } from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/layout/PageHeader';

export default function PoliciesPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Policies Management"
        subtitle="Manage and trace every transactions"
        breadcrumbs={[
          { label: 'Main page', href: '/' },
          { label: 'Policies Management', href: '/policies' },
        ]}
      />
      <Typography variant="body1">Policies Management page content will be implemented here</Typography>
    </DashboardLayout>
  );
}