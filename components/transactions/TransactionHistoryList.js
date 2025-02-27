// components/transactions/TransactionHistoryList.js
import React, { useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Tooltip, Typography, Skeleton, Avatar,
  Menu, MenuItem, TextField, InputAdornment, Select, FormControl, InputLabel
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  OpenInNew as OpenInNewIcon,
  ContentCopy as ContentCopyIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';

// 模擬歷史交易數據
const mockHistoryTransactions = [
  {
    id: 'tx101',
    type: 'transfer',
    token: {
      symbol: 'ETH',
      logoUrl: '/images/tokens/eth.png',
    },
    amount: '5.0',
    to: '0x1234567890abcdef1234567890abcdef12345678',
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    status: 'confirmed',
    initiator: {
      name: 'Alice',
      avatar: '/images/avatars/alice.png',
    },
    executedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 天前
    signatures: 7,
    block: 12345678,
    gasUsed: 21000,
  },
  {
    id: 'tx102',
    type: 'contract-interaction',
    token: {
      symbol: 'USDC',
      logoUrl: '/images/tokens/usdc.png',
    },
    amount: '10000',
    to: '0x2345678901abcdef2345678901abcdef23456789',
    contractName: 'Uniswap V3 Router',
    hash: '0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890a',
    status: 'confirmed',
    initiator: {
      name: 'Bob',
      avatar: '/images/avatars/bob.png',
    },
    executedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 天前
    signatures: 5,
    block: 12345000,
    gasUsed: 120000,
  },
  {
    id: 'tx103',
    type: 'policy-update',
    description: '更新大額轉賬限制',
    hash: '0xcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    status: 'confirmed',
    initiator: {
      name: 'Charlie',
      avatar: '/images/avatars/charlie.png',
    },
    executedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 天前
    signatures: 9,
    block: 12344000,
    gasUsed: 85000,
  },
  {
    id: 'tx104',
    type: 'transfer',
    token: {
      symbol: 'WBTC',
      logoUrl: '/images/tokens/wbtc.png',
    },
    amount: '0.75',
    to: '0x3456789012abcdef3456789012abcdef34567890',
    hash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
    status: 'failed',
    error: '交易被拒絕',
    initiator: {
      name: 'David',
      avatar: '/images/avatars/david.png',
    },
    executedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12), // 12 天前
    signatures: 6,
    block: null,
    gasUsed: 0,
  },
];

export const TransactionHistoryList = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState(mockHistoryTransactions);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTx, setSelectedTx] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  
  const handleMenuClick = (event, transaction) => {
    setAnchorEl(event.currentTarget);
    setSelectedTx(transaction);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleViewOnExplorer = () => {
    if (selectedTx?.hash) {
      // 這裡應該根據鏈ID打開不同的區塊瀏覽器
      window.open(`https://etherscan.io/tx/${selectedTx.hash}`, '_blank');
    }
    handleMenuClose();
  };
  
  const handleCopyTxHash = () => {
    if (selectedTx?.hash) {
      navigator.clipboard.writeText(selectedTx.hash);
      // 可以加入提示動畫或消息
    }
    handleMenuClose();
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFilterStatusChange = (e) => {
    setFilterStatus(e.target.value);
  };
  
  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };
  
  // 過濾和搜索交易
  const filteredTransactions = transactions.filter(tx => {
    // 過濾狀態
    if (filterStatus !== 'all' && tx.status !== filterStatus) {
      return false;
    }
    
    // 過濾類型
    if (filterType !== 'all' && tx.type !== filterType) {
      return false;
    }
    
    // 搜索 (交易 ID, 哈希, 地址等)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tx.id.toLowerCase().includes(query) ||
        (tx.hash && tx.hash.toLowerCase().includes(query)) ||
        (tx.to && tx.to.toLowerCase().includes(query)) ||
        (tx.token && tx.token.symbol.toLowerCase().includes(query)) ||
        (tx.initiator && tx.initiator.name.toLowerCase().includes(query)) ||
        (tx.description && tx.description.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // 日期格式化
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  // 複製到剪貼板
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // 可以加入提示動畫或消息
  };
  
  return (
    <>
      <Box sx={{ display: 'flex', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="搜索交易..."
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>狀態</InputLabel>
          <Select
            value={filterStatus}
            onChange={handleFilterStatusChange}
            label="狀態"
          >
            <MenuItem value="all">所有狀態</MenuItem>
            <MenuItem value="confirmed">已確認</MenuItem>
            <MenuItem value="failed">失敗</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>交易類型</InputLabel>
          <Select
            value={filterType}
            onChange={handleFilterTypeChange}
            label="交易類型"
          >
            <MenuItem value="all">所有類型</MenuItem>
            <MenuItem value="transfer">轉賬</MenuItem>
            <MenuItem value="contract-interaction">合約交互</MenuItem>
            <MenuItem value="policy-update">政策更新</MenuItem>
          </Select>
        </FormControl>
      </Box>
    
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: theme.shadows[1] }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell>交易</TableCell>
              <TableCell>發起人</TableCell>
              <TableCell>執行時間</TableCell>
              <TableCell>狀態</TableCell>
              <TableCell>簽名</TableCell>
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
                  <TableCell><Skeleton variant="text" width={50} /></TableCell>
                  <TableCell align="right"><Skeleton variant="circular" width={32} height={32} /></TableCell>
                </TableRow>
              ))
            ) : filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    沒有找到符合條件的交易記錄
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
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
                            `轉賬 ${transaction.amount} ${transaction.token.symbol}`
                          ) : transaction.type === 'contract-interaction' ? (
                            `與 ${transaction.contractName} 交互`
                          ) : (
                            transaction.description
                          )}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Tooltip title="點擊複製交易哈希">
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              onClick={() => copyToClipboard(transaction.hash)}
                              sx={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                '&:hover': {
                                  color: theme.palette.primary.main,
                                },
                              }}
                            >
                              {transaction.hash.substring(0, 6)}...{transaction.hash.substring(transaction.hash.length - 4)}
                              <ContentCopyIcon sx={{ fontSize: 12, ml: 0.5 }} />
                            </Typography>
                          </Tooltip>
                        </Box>
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
                      {formatDate(transaction.executedAt)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={transaction.status === 'confirmed' ? '已確認' : '失敗'}
                      size="small"
                      color={transaction.status === 'confirmed' ? 'success' : 'error'}
                      variant={transaction.status === 'confirmed' ? 'filled' : 'outlined'}
                      sx={{ 
                        fontWeight: 500,
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Tooltip title={`${transaction.signatures} 個簽名`}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ReceiptIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {transaction.signatures}
                        </Typography>
                      </Box>
                    </Tooltip>
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
        <MenuItem onClick={handleViewOnExplorer}>
          <OpenInNewIcon fontSize="small" sx={{ mr: 1 }} />
          在區塊瀏覽器中查看
        </MenuItem>
        <MenuItem onClick={handleCopyTxHash}>
          <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} />
          複製交易哈希
        </MenuItem>
      </Menu>
    </>
  );
};

export default TransactionHistoryList;