// pages/transactions.js (交易管理頁面)
import React, { useState } from 'react';
import { Box, Button, Tabs, Tab, useTheme } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { TransactionList } from '../components/transactions/TransactionList';
import { TransactionHistoryList } from '../components/transactions/TransactionHistoryList';
import NewTransactionDialog from '../components/transactions/NewTransactionDialog';

const TransactionsPage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [newTxDialogOpen, setNewTxDialogOpen] = useState(false);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleNewTransaction = () => {
    setNewTxDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setNewTxDialogOpen(false);
  };
  
  return (
    <DashboardLayout>
      <PageHeader
        title="交易管理"
        subtitle="管理和跟踪所有交易和簽名請求"
        breadcrumbs={[
          { label: '首頁', href: '/' },
          { label: '交易管理', href: '/transactions' },
        ]}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNewTransaction}
          >
            新建交易
          </Button>
        }
      />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 500,
              fontSize: '0.875rem',
              textTransform: 'none',
              minWidth: 100,
            }
          }}
        >
          <Tab label="待處理交易" />
          <Tab label="交易歷史" />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        <TransactionList />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <TransactionHistoryList />
      </TabPanel>
      
      <NewTransactionDialog
        open={newTxDialogOpen}
        onClose={handleCloseDialog}
      />
    </DashboardLayout>
  );
};

// 標籤面板組件
const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`transaction-tabpanel-${index}`}
      aria-labelledby={`transaction-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export default TransactionsPage;