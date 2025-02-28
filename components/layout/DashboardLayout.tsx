// components/layout/DashboardLayout.tsx
'use client';
import React, { useState } from 'react';
import {
  Box, Drawer, DrawerProps, AppBar, AppBarProps, Toolbar, List, Typography, Divider, IconButton,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Container,
  useMediaQuery, useTheme, Avatar, Menu, MenuItem, Tooltip, Button
} from '@mui/material';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  AccountBalanceWallet as WalletIcon,
  Security as SecurityIcon,
  SwapHoriz as TransactionsIcon,
  DataObject as PolicyIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Layers as LayersIcon,
  Settings as SettingsIcon,
  
} from '@mui/icons-material';
import Link from 'next/link';

const drawerWidth = 260;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: theme.palette.background.paper, // 使用主题
  borderRight: `1px solid ${theme.palette.divider}`,
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`, //修正
  backgroundColor: theme.palette.background.paper, // 使用主题
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,  //修正
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface StyledAppBarProps extends AppBarProps {
  open?: boolean;
}

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<StyledAppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: theme.palette.background.default, // 使用主题
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface StyledDrawerProps extends DrawerProps {
  open?: boolean;
}

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<StyledDrawerProps>(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));


const truncateAddress = (address: string | undefined): string => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | undefined>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuItems = [
    { text: 'Get Start', icon: <LayersIcon />, path: '/' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Wallets', icon: <WalletIcon />, path: '/wallets' },
    { text: 'AI Actins', icon: <SecurityIcon />, path: '/ai-actions' },
    { text: 'Transaction', icon: <TransactionsIcon />, path: '/transactions' },
    { text: 'Policy', icon: <PolicyIcon />, path: '/policies' },
  ];

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleConnectWallet = () => {
    setIsConnected(true);
    setAddress("0x5a7bd2f67f929ebc74c5eb8e2562e5e55c24c3d9");
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress(undefined);
    handleUserMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <StyledAppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Hexa Guard Wallet Management System
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* 网络选择器 */}
            <Box
              sx={{
                px: 2,
                py: 0.75,
                border: `1px solid ${theme.palette.primary.main}`, // 使用主题
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme.palette.primary.main }} /> {/* 使用主题 */}
              <Typography variant="body2">Sepolia Testnet</Typography>
            </Box>

            {isConnected ? (
              <>
                <Tooltip title={address || ""}>
                  <IconButton
                    onClick={handleUserMenuClick}
                    size="small"
                    sx={{ border: `1px solid ${theme.palette.primary.main}`, p: 1 }}  // 使用主题
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: theme.palette.primary.main, // 使用主题
                        fontSize: '0.875rem'
                      }}
                    >
                      {address ? address.substring(2, 4).toUpperCase() : ""}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      background: theme.palette.background.paper, // 使用主题
                      border: `1px solid ${theme.palette.divider}`,
                    }
                  }}
                >
                  <MenuItem onClick={handleUserMenuClose}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="User Info"
                      secondary={truncateAddress(address)}
                    />
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleDisconnect}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Disconnect" />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                onClick={handleConnectWallet}
                variant="contained"
                // color="primary" // 不需要手动指定 color
                sx={{
                  borderRadius: 2,
                  py: 1,
                }}
              >
                Connect Wallet
              </Button>
            )}
          </Box>
        </Toolbar>
      </StyledAppBar>
      <StyledDrawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <Link href={item.path} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: theme.palette.primary.main, // 使用主题
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </StyledDrawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: { xs: 8, sm: 9 }, // 调整 padding top
          backgroundColor: theme.palette.background.default, // 使用主题
          minHeight: '100vh'
        }}
      >
         <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  );
}