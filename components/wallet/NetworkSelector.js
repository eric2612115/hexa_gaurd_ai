// components/wallet/NetworkSelector.js
import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, Typography, useTheme, ListItemIcon } from '@mui/material';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';

const NetworkSelector = () => {
  const theme = useTheme();
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchNetwork = (chainId) => {
    switchNetwork?.(chainId);
    handleClose();
  };

  // 網絡圖標和顏色
  const getNetworkColor = (chainId) => {
    switch (chainId) {
      case 11155111: // Sepolia
        return '#5F4BB6';
      case 99999: // Sonic 
        return '#00FFA3';
      default:
        return theme.palette.primary.main;
    }
  };

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 11155111:
        return 'Sepolia 測試網';
      case 99999:
        return 'Sonic 測試網';
      default:
        return '未知網絡';
    }
  };

  // 沒有連接鏈時的顯示
  if (!chain) {
    return (
      <Button
        variant="outlined"
        color="primary"
        disabled
        sx={{
          borderRadius: 2,
          fontSize: '0.875rem',
          background: 'rgba(29, 185, 84, 0.1)',
          px: 2,
        }}
      >
        未連接網絡
      </Button>
    );
  }

  return (
    <>
      <Button
        id="network-select-button"
        aria-controls={open ? 'network-select-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
        color="primary"
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          borderRadius: 2,
          borderColor: getNetworkColor(chain.id),
          background: `rgba(${getNetworkColor(chain.id).replace('#', '')}, 0.1)`,
          px: 2,
          '&:hover': {
            borderColor: getNetworkColor(chain.id),
            background: `rgba(${getNetworkColor(chain.id).replace('#', '')}, 0.2)`,
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: getNetworkColor(chain.id),
              mr: 1
            }}
          />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {getNetworkName(chain.id)}
          </Typography>
        </Box>
      </Button>
      
      <Menu
        id="network-select-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'network-select-button',
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }
        }}
      >
        {chains.map((chainOption) => (
          <MenuItem
            key={chainOption.id}
            selected={chain.id === chainOption.id}
            onClick={() => handleSwitchNetwork(chainOption.id)}
            disabled={isLoading && pendingChainId === chainOption.id}
            sx={{
              py: 1.5,
              '&.Mui-selected': {
                background: `rgba(29, 185, 84, 0.1)`,
                '&:hover': {
                  background: `rgba(29, 185, 84, 0.2)`,
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: getNetworkColor(chainOption.id),
                }}
              />
            </ListItemIcon>
            <Typography>
              {getNetworkName(chainOption.id)}
              {isLoading && pendingChainId === chainOption.id && ' (切換中...)'}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
      
      {error && (
        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
          {error.message}
        </Typography>
      )}
    </>
  );
};

export default NetworkSelector;