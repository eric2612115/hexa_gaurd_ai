import React, { useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Tooltip, Typography, MenuItem, Menu, Avatar, Skeleton,
  Button
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import TransactionDetailsDialog from './TransactionDetailsDialog';

// 模擬待處理交易數據
const mockPendingTransactions = [
  {
    id: 'tx1',
    type: 'transfer',
    token: {
      symbol: 'ETH',
      logoUrl: '/images/tokens/eth.png',
    },
    amount: '1.5',
    to: '0x1234567890abcdef1234567890abcdef12345678',
    status: 'pending',
    requiredSignatures: 7,
    currentSignatures: 3,
    initiator: {
      name: 'Alice',
      avatar: '/images/avatars/alice.png',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 分鐘前
    aiAnalysis: {
      riskLevel: 'low',
      warning: null
    }
  },
  {
    id: 'tx2',
    type: 'contract-interaction',
    token: {
      symbol: 'USDC',
      logoUrl: '/images/tokens/usdc.png',
    },
    amount: '5000',
    to: '0x2345678901abcdef2345678901abcdef23456789',
    contractName: 'Uniswap V3 Router',
    status: 'pending',
    requiredSignatures: 5,
    currentSignatures: 4,
    initiator: {
      name: 'Bob',
      avatar: '/images/avatars/bob.png',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 小時前
    aiAnalysis: {
      riskLevel: 'medium',
      warning: '與新合約的首次互動'
    }
  },
  {
    id: 'tx3',
    type: 'policy-update',
    description: '更新白名單政策',
    status: 'pending',
    requiredSignatures: 9,
    currentSignatures: 6,
    initiator: {
      name: 'Charlie',
      avatar: '/images/avatars/charlie.png',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 天前
    aiAnalysis: {
      riskLevel: 'high',
      warning: '權限變更風險：移除重要白名單地址'
    }
  },
];

export const TransactionList = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState(mockPendingTransactions);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTx, setSelectedTx] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  const handleMenuClick = (event, transaction) => {
    setAnchorEl(event.currentTarget);
    setSelectedTx(transaction);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleViewDetails = () => {
    handleMenuClose();
    setDetailsDialogOpen(true);
  };
  
  const handleApprove = () => {
    handleMenuClose();
    // 實際應用中應該調用合約簽名方法
    console.log(`Approving transaction ${selectedTx.id}`);
    
    // 更新 UI 以模擬簽名
    setTransactions(transactions.map(tx => 
      tx.id === selectedTx.id ? { ...tx, currentSignatures: tx.currentSignatures + 1 } : tx
    ));
  };
  
  const handleReject = () => {
    handleMenuClose();
    // 實際應用中應該調用拒絕交易方法
    console.log(`Rejecting transaction ${selectedTx.id}`);
    
    // 從列表中移除該交易
    setTransactions(transactions.filter(tx => tx.id !== selectedTx.id));
  };
  
  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };
  
  // 時間格式化
  const formatTime = (date) => {
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
  
  // 生成簽名進度標籤
  const getSignatureLabel = (current, required) => {
    return `${current}/${required} 簽名`;
  };
  
  // 如果沒有待處理交易
  if (transactions.length === 0) {
    return (
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 8, 
          px: 3,
          border: `1px dashed ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          沒有待處理的交易
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          當您或其他團隊成員創建新的交易時，它們將顯示在此處等待簽名。
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setNewTxDialogOpen(true)}
        >
          創建新交易
        </Button>
      </Box>
    );
  }
  
  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: theme.shadows[1] }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell>交易</TableCell>
              <TableCell>發起人</TableCell>
              <TableCell>創建時間</TableCell>
              <TableCell>簽名狀態</TableCell>
              <TableCell>AI 風險分析</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // 加載骨架屏
              Array(3).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" width={200} /></TableCell>
                  <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>
                  <TableCell><Skeleton variant="text" width={100} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={100} height={24} /></TableCell>
                  <TableCell><Skeleton variant="rectangular" width={80} height={24} /></TableCell>
                  <TableCell align="right"><Skeleton variant="circular" width={32} height={32} /></TableCell>
                </TableRow>
              ))
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {transaction.token && (
                        <Box 
                          sx={{ 
                            mr: 1.5, 
                            bgcolor: 'background.default', 
                            borderRadius: '50%', 
                            width: 36, 
                            height: 36, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          }}
                        >
                          <Image
                            src={transaction.token.logoUrl}
                            alt={transaction.token.symbol}
                            width={24}
                            height={24}
                          />
                        </Box>
                      )}
                      
                      {!transaction.token && (
                        <Box
                          sx={{
                            mr: 1.5,
                            bgcolor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            borderRadius: '50%',
                            width: 36,
                            height: 36,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          {transaction.type === 'policy-update' ? 'PO' : 'TX'}
                        </Box>
                      )}
                      
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {transaction.type === 'transfer' ? (
                            `轉帳 ${transaction.amount} ${transaction.token.symbol}`
                          ) : transaction.type === 'contract-interaction' ? (
                            `與 ${transaction.contractName} 交互`
                          ) : (
                            transaction.description
                          )}
                        </Typography>
                        
                        {transaction.to && (
                          <Typography variant="caption" color="text.secondary">
                            至 {transaction.to.substring(0, 6)}...{transaction.to.substring(transaction.to.length - 4)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={transaction.initiator.avatar}
                        alt={transaction.initiator.name}
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                      <Typography variant="body2">
                        {transaction.initiator.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {formatTime(transaction.createdAt)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 100,
                          height: 6,
                          bgcolor: theme.palette.divider,
                          borderRadius: 3,
                          mr: 1.5,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${(transaction.currentSignatures / transaction.requiredSignatures) * 100}%`,
                            bgcolor: theme.palette.primary.main,
                            borderRadius: 3,
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {getSignatureLabel(transaction.currentSignatures, transaction.requiredSignatures)}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    {transaction.aiAnalysis && (
                      <Tooltip title={transaction.aiAnalysis.warning || '無風險警告'}>
                        <Chip
                          label={transaction.aiAnalysis.riskLevel === 'low' ? '低風險' : 
                                transaction.aiAnalysis.riskLevel === 'medium' ? '中風險' : '高風險'}
                          size="small"
                          sx={{ 
                            bgcolor: `${getRiskColor(transaction.aiAnalysis.riskLevel)}20`,
                            color: getRiskColor(transaction.aiAnalysis.riskLevel),
                            fontWeight: 500,
                            '& .MuiChip-label': { px: 1 }
                          }}
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                  
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleMenuClick(e, transaction)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            boxShadow: theme.shadows[3],
            mt: 1,
            minWidth: 180,
          }
        }}
      >
        <MenuItem onClick={handleViewDetails}>
          <VisibilityOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          查看詳情
        </MenuItem>
        <MenuItem onClick={handleApprove}>
          <CheckCircleIcon fontSize="small" sx={{ mr: 1, color: theme.palette.success.main }} />
          簽名批准
        </MenuItem>
        <MenuItem onClick={handleReject}>
          <CancelIcon fontSize="small" sx={{ mr: 1, color: theme.palette.error.main }} />
          拒絕交易
        </MenuItem>
      </Menu>
      
      {selectedTx && (
        <TransactionDetailsDialog
          open={detailsDialogOpen}
          onClose={handleCloseDetailsDialog}
          transaction={selectedTx}
        />
      )}
    </>
  );
};