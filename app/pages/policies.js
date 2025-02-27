// pages/policies.js (政策頁面)
import React from 'react';
import { Button } from '@mui/material';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { PolicyList } from '../components/policy/PolicyList';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const PoliciesPage = () => {
  return (
    <DashboardLayout>
      <PageHeader
        title="政策管理"
        subtitle="管理和配置安全政策以控制您的交易"
        breadcrumbs={[
          { label: '首頁', href: '/' },
          { label: '政策管理', href: '/policies' },
        ]}
        action={
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<InfoOutlinedIcon />}
          >
            政策指南
          </Button>
        }
      />
      
      <PolicyList />
    </DashboardLayout>
  );
};

export default PoliciesPage;