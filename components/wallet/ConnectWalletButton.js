// components/wallet/ConnectWalletButton.js
import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, List, ListItem, 
         ListItemButton, ListItemIcon, ListItemText, Typography, Box, 
         useTheme, Divider } from '@mui/material';
import { useConnect } from 'wagmi';
import Image from 'next/image';

export const ConnectWalletButton = () => {
  const [open, setOpen] = useState(false);
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const theme = useTheme();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConnect = (connector) => {
    connect({ connector });
    handleClose();
  };

  // 連接器圖標
  const connectorIcons = {
    metaMask: '/images/wallets/metamask.png',
    walletConnect: '/images/wallets/walletconnect.png',
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{
          fontWeight: 600,
          px: 3,
        }}
      >
        連接錢包
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundImage: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            border: `1px solid ${theme.palette.divider}`,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            連接您的錢包
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            選擇一個連接方式來管理您的資產
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <List sx={{ p: 0 }}>
            {connectors.map((connector) => (
              <ListItem key={connector.id} disablePadding>
                <ListItemButton
                  onClick={() => handleConnect(connector)}
                  disabled={!connector.ready}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    my: 1,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: `rgba(29, 185, 84, 0.1)`,
                      borderColor: theme.palette.primary.main,
                    }
                  }}
                >
                  <ListItemIcon>
                    <Box sx={{ p: 1, background: '#fff', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {connector.id === 'metaMask' && (
                        <Image
                          src={connectorIcons.metaMask}
                          alt="MetaMask"
                          width={32}
                          height={32}
                        />
                      )}
                      {connector.id === 'walletConnect' && (
                        <Image
                          src={connectorIcons.walletConnect}
                          alt="WalletConnect"
                          width={32}
                          height={32}
                        />
                      )}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={500}>
                        {connector.name}
                        {!connector.ready && ' (不可用)'}
                        {isLoading && connector.id === pendingConnector?.id && ' (連接中...)'}
                      </Typography>
                    }
                    secondary={
                      connector.id === 'metaMask' 
                        ? '最流行的Web3錢包' 
                        : connector.id === 'walletConnect' 
                        ? '連接手機錢包' 
                        : ''
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
          {error && (
            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
              {error.message}
            </Typography>
          )}
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
            連接錢包即表示您同意我們的使用條款和隱私政策
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

