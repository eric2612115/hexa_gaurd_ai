// app/dashboard/page.tsx

import React from 'react';
import { Typography } from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/layout/PageHeader';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Would display the main dashboard"
        breadcrumbs={[
          { label: 'Main page', href: '/' },
          { label: 'Dashboard', href: '/dashboard' },
        ]}
      />
      <Typography variant="body1">Dashboard page content will be implemented here</Typography>
    </DashboardLayout>
  );
}