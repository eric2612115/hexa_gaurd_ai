// components/assets/AssetList.js
import React, { useState } from 'react';
import { Grid, Typography, Box, Button, useTheme } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { AssetCard } from './AssetCard';
import { useNetwork } from 'wagmi';
import { SUPPORTED_TOKENS } from '../../config/wagmi';
import SendTokenDialog from '../transactions/SendTokenDialog';

export const AssetList = () => {
  const { chain } = useNetwork();
  const theme = useTheme();
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);

  // 獲取當前鏈上支持的代幣列表
  const tokens = chain ? SUPPORTED_TOKENS[chain.id] || [] : [];

  const handleSendClick = (token) => {
    setSelectedToken(token);
    setSendDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSendDialogOpen(false);
  };

  if (!chain) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">請連接錢包以查看您的資產</Typography>
      </Box>
    );
  }

  if (tokens.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">當前網絡沒有支持的資產</Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {tokens.map((token) => (
          <Grid item xs={12} sm={6} md={4} key={token.symbol}>
            <AssetCard token={token} onSendClick={handleSendClick} />
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              height: '100%',
              minHeight: 250,
              border: `2px dashed ${theme.palette.divider}`,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
              background: 'rgba(255, 255, 255, 0.02)',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                background: 'rgba(29, 185, 84, 0.05)',
              }
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'rgba(29, 185, 84, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}
            >
              <AddIcon sx={{ color: theme.palette.primary.main }} />
            </Box>
            <Typography variant="h6" align="center" gutterBottom>
              添加自定義代幣
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" mb={2}>
              導入任何 ERC-20 代幣以跟踪其餘額
            </Typography>
            <Button variant="outlined" size="small">
              添加代幣
            </Button>
          </Box>
        </Grid>
      </Grid>

      {selectedToken && (
        <SendTokenDialog
          open={sendDialogOpen}
          onClose={handleCloseDialog}
          token={selectedToken}
        />
      )}
    </>
  );
};

