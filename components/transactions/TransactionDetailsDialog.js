// components/transactions/TransactionDetailsDialog.js
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography,
  Box, Chip, Divider, Grid, Paper, Avatar, Tooltip, LinearProgress, useTheme,
  List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, IconButton
} from '@mui/material';
import {
  InfoOutlined as InfoOutlinedIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Code as CodeIcon,
  Security as SecurityIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import Image from 'next/image';

// 模擬簽名者數據
const mockSigners = [
  { 
    id: '1', 
    name: 'Alice', 
    avatar: '/images/avatars/alice.png', 
    role: '管理員',
    status: 'signed', 
    signedAt: new Date(Date.now() - 1000 * 60 * 20) 
  },
  { 
    id: '2', 
    name: 'Bob', 
    avatar: '/images/avatars/bob.png',
    role: '財務官',
    status: 'signed', 
    signedAt: new Date(Date.now() - 1000 * 60 * 15) 
  },
  { 
    id: '3', 
    name: 'Charlie', 
    avatar: '/images/avatars/charlie.png',
    role: '技術主管',
    status: 'signed', 
    signedAt: new Date(Date.now() - 1000 * 60 * 10) 
  },
  { 
    id: '4', 
    name: 'David', 
    avatar: '/images/avatars/david.png',
    role: '運營總監',
    status: 'pending', 
    signedAt: null 
  },
  { 
    id: '5', 
    name: 'Eva', 
    avatar: '/images/avatars/eva.png',
    role: '安全官',
    status: 'pending', 
    signedAt: null 
  },
  { 
    id: '6', 
    name: 'Frank', 
    avatar: '/images/avatars/frank.png',
    role: '合規官',
    status: 'pending', 
    signedAt: null 
  },
  { 
    id: '7', 
    name: 'Grace', 
    avatar: '/images/avatars/grace.png',
    role: 'CTO',
    status: 'pending', 
    signedAt: null 
  },
  { 
    id: '8', 
    name: 'Henry', 
    avatar: '/images/avatars/henry.png',
    role: 'CFO',
    status: 'pending', 
    signedAt: null 
  },
  { 
    id: '9', 
    name: 'Ivy', 
    avatar: '/images/avatars/ivy.png',
    role: 'CEO',
    status: 'pending', 
    signedAt: null 
  },
];

const TransactionDetailsDialog = ({ open, onClose, transaction }) => {
  const theme = useTheme();
  const [signers, setSigners] = useState(mockSigners);
  
  // 如果沒有交易數據，不顯示
  if (!transaction) {
    return null;
  }

  // 時間格式化
  const formatTime = (date) => {
    if (!date) return '未簽名';
    
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / (1000 * 60));
    
    if (diffMin < 60) {
      return `${diffMin} 分鐘前`;
    } else if (diffMin < 60 * 24) {
      return `${Math.floor(diffMin / 60)} 小時前`;
    } else {
      return `${Math.floor(diffMin / (60 * 24))} 天前`;
    }
  };
  
  // 獲取交易類型圖標
  const getTransactionTypeIcon = () => {
    switch (transaction.type) {
      case 'transfer':
        return <AccountBalanceWalletIcon />;
      case 'contract-interaction':
        return <CodeIcon />;
      case 'policy-update':
        return <SecurityIcon />;
      default:
        return <InfoOutlinedIcon />;
    }
  };
  
  // 獲取交易類型名稱
  const getTransactionTypeName = () => {
    switch (transaction.type) {
      case 'transfer':
        return '轉賬交易';
      case 'contract-interaction':
        return '合約交互';
      case 'policy-update':
        return '政策更新';
      default:
        return '未知類型';
    }
  };
  
  // 獲取風險等級顏色
  const getRiskColor = (level) => {
    switch (level) {
      case 'low':
        return theme.palette.success.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'high':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };
  
  // 獲取風險等級名稱
  const getRiskLevelName = (level) => {
    switch (level) {
      case 'low':
        return '低風險';
      case 'medium':
        return '中風險';
      case 'high':
        return '高風險';
      default:
        return '未知風險';
    }
  };
  
  // 模擬簽名
  const handleSign = () => {
    // 更新第一個待簽名者狀態
    const pendingSigner = signers.find(signer => signer.status === 'pending');
    if (pendingSigner) {
      setSigners(signers.map(signer => 
        signer.id === pendingSigner.id 
          ? { ...signer, status: 'signed', signedAt: new Date() } 
          : signer
      ));
    }
  };
  
  // 模擬拒絕
  const handleReject = () => {
    onClose();
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle>
        交易詳情
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    mr: 2,
                    bgcolor: `${theme.palette.primary.main}20`,
                    color: theme.palette.primary.main,
                    borderRadius: '50%',
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getTransactionTypeIcon()}
                </Box>
                
                <Box>
                  <Typography variant="h6">
                    {transaction.type === 'transfer' 
                      ? `轉賬 ${transaction.amount} ${transaction.token.symbol}`
                      : transaction.type === 'contract-interaction'
                      ? `與 ${transaction.contractName} 交互`
                      : transaction.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getTransactionTypeName()} | ID: {transaction.id}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                {transaction.type === 'transfer' && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        發送代幣
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 1, p: 0.5, bgcolor: 'rgba(0, 0, 0, 0.04)', borderRadius: '50%' }}>
                          <Image
                            src={transaction.token.logoUrl}
                            alt={transaction.token.symbol}
                            width={20}
                            height={20}
                          />
                        </Box>
                        <Typography variant="body2" fontWeight={500}>
                          {transaction.token.symbol}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        數量
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {transaction.amount} {transaction.token.symbol}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        接收地址
                      </Typography>
                      <Typography variant="body2" fontWeight={500} sx={{ wordBreak: 'break-all' }}>
                        {transaction.to}
                      </Typography>
                    </Grid>
                  </>
                )}
                
                {transaction.type === 'contract-interaction' && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        合約名稱
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {transaction.contractName}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        交互金額
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 1, p: 0.5, bgcolor: 'rgba(0, 0, 0, 0.04)', borderRadius: '50%' }}>
                          <Image
                            src={transaction.token.logoUrl}
                            alt={transaction.token.symbol}
                            width={20}
                            height={20}
                          />
                        </Box>
                        <Typography variant="body2" fontWeight={500}>
                          {transaction.amount} {transaction.token.symbol}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        合約地址
                      </Typography>
                      <Typography variant="body2" fontWeight={500} sx={{ wordBreak: 'break-all' }}>
                        {transaction.to}
                      </Typography>
                    </Grid>
                  </>
                )}
                
                {transaction.type === 'policy-update' && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      更新描述
                    </Typography>
                    <Typography variant="body2">
                      {transaction.description}
                    </Typography>
                  </Grid>
                )}
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    發起人
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={transaction.initiator.avatar}
                      alt={transaction.initiator.name}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Typography variant="body2" fontWeight={500}>
                      {transaction.initiator.name}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    創建時間
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatTime(transaction.createdAt)}
                  </Typography>
                </Grid>
              </Grid>
              
              {transaction.aiAnalysis && (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mr: 1 }}>
                      AI 風險分析
                    </Typography>
                    <Chip 
                      label={getRiskLevelName(transaction.aiAnalysis.riskLevel)} 
                      size="small"
                      sx={{ 
                        bgcolor: `${getRiskColor(transaction.aiAnalysis.riskLevel)}20`,
                        color: getRiskColor(transaction.aiAnalysis.riskLevel),
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                  
                  {transaction.aiAnalysis.warning && (
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        bgcolor: `${getRiskColor(transaction.aiAnalysis.riskLevel)}10`,
                        borderColor: getRiskColor(transaction.aiAnalysis.riskLevel),
                        mb: 2
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {transaction.aiAnalysis.warning}
                      </Typography>
                    </Paper>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button startIcon={<ThumbUpIcon />} size="small">
                      有用
                    </Button>
                    <Button startIcon={<ThumbDownIcon />} size="small">
                      無用
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" gutterBottom>
                簽名進度
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(transaction.currentSignatures / transaction.requiredSignatures) * 100}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: theme.palette.divider,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
                      }
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {transaction.currentSignatures}/{transaction.requiredSignatures}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                簽名者
              </Typography>
              
              <List disablePadding>
                {signers.map((signer) => (
                  <ListItem
                    key={signer.id}
                    disablePadding
                    sx={{ 
                      py: 0.5, 
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <Avatar 
                        src={signer.avatar} 
                        alt={signer.name}
                        sx={{ width: 28, height: 28 }}
                      />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <Typography variant="body2" fontWeight={500}>
                          {signer.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {signer.role}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      {signer.status === 'signed' ? (
                        <Tooltip title={`簽名於 ${formatTime(signer.signedAt)}`}>
                          <CheckCircleIcon fontSize="small" color="success" />
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          等待中
                        </Typography>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} color="inherit">
          關閉
        </Button>
        <Button onClick={handleReject} color="error" variant="outlined" startIcon={<CancelIcon />}>
          拒絕交易
        </Button>
        <Button 
          onClick={handleSign} 
          color="primary" 
          variant="contained" 
          startIcon={<CheckCircleIcon />}
          endIcon={<ArrowForwardIcon />}
        >
          簽名批准
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionDetailsDialog;