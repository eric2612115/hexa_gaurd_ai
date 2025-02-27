// pages/index.js (首頁)
import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { TotalBalanceCard } from '../components/assets/TotalBalanceCard';
import { AssetList } from '../components/assets/AssetList';
import Link from 'next/link';

const HomePage = () => {
  return (
    <DashboardLayout>
      <PageHeader
        title="資產儀表板"
        subtitle="管理您的數位資產和交易"
        breadcrumbs={[{ label: '首頁', href: '/' }]}
      />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TotalBalanceCard />
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              mb: 3,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                政策引擎保護您的資產安全
              </Typography>
              <Typography variant="body2" color="text.secondary">
                設置自定義政策和 AI 交易驗證，提升安全性並優化資產管理。
              </Typography>
            </Box>
            
            <Link href="/policies" passHref>
              <Button
                variant="outlined"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: { xs: 2, sm: 0 } }}
              >
                管理政策
              </Button>
            </Link>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              您的資產
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              以下是您當前網絡的所有資產。點擊任意資產卡片可以發送或管理。
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <AssetList />
    </DashboardLayout>
  );
};

export default HomePage;