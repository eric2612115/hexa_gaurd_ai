// components/assets/TotalBalanceCard.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Skeleton, Divider, Button, useTheme } from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { CardWithTitle } from '../layout/CardWithTitle';
import { useNetwork, useAccount, useBalance } from 'wagmi';
import { SUPPORTED_TOKENS } from '../../config/wagmi';

export const TotalBalanceCard = () => {
  const theme = useTheme();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [isLoading, setIsLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const [dailyChange, setDailyChange] = useState(0);
  const [weeklyChange, setWeeklyChange] = useState(0);
  
  // 獲取當前鏈上支持的代幣列表
  const tokens = chain ? SUPPORTED_TOKENS[chain.id] || [] : [];
  
  useEffect(() => {
    // 模擬獲取總餘額和變化率數據
    const fetchTotalBalance = async () => {
      setIsLoading(true);
      
      try {
        // 簡化示例：在實際應用中，應該遍歷所有代幣並獲取其美元價值
        // 然後計算總餘額和變化率
        
        // 假設數據
        const mockTotalBalance = chain?.id === 11155111 ? 15240.85 : 8750.32; // Sepolia 上的總餘額
        const mockDailyChange = chain?.id === 11155111 ? 3.8 : 5.2; // 日變化率
        const mockWeeklyChange = chain?.id === 11155111 ? 12.5 : 9.8; // 週變化率
        
        // 模擬 API 延遲
        setTimeout(() => {
          setTotalBalance(mockTotalBalance);
          setDailyChange(mockDailyChange);
          setWeeklyChange(mockWeeklyChange);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('獲取總餘額失敗', error);
        setIsLoading(false);
      }
    };
    
    if (chain && address) {
      fetchTotalBalance();
    } else {
      setIsLoading(false);
      setTotalBalance(0);
    }
  }, [chain, address]);
  
  return (
    <CardWithTitle
      title="總資產概覽"
      sx={{
        backgroundImage: `linear-gradient(to right, ${theme.palette.background.paper}, rgba(29, 185, 84, 0.08))`,
      }}
    >
      <Box>
        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
        ) : (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingUpIcon 
                sx={{ 
                  color: dailyChange >= 0 ? theme.palette.success.main : theme.palette.error.main,
                  mr: 0.5,
                  fontSize: 20
                }} 
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: dailyChange >= 0 ? theme.palette.success.main : theme.palette.error.main,
                  fontWeight: 500
                }}
              >
                {dailyChange > 0 ? '+' : ''}{dailyChange}% (24h)
              </Typography>
            </Box>
          </Box>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              過去 7 天變化
            </Typography>
            {isLoading ? (
              <Skeleton width={80} />
            ) : (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: weeklyChange >= 0 ? theme.palette.success.main : theme.palette.error.main,
                  fontWeight: 500
                }}
              >
                {weeklyChange > 0 ? '+' : ''}{weeklyChange}%
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              代幣數量
            </Typography>
            {isLoading ? (
              <Skeleton width={80} />
            ) : (
              <Typography variant="body2" fontWeight={500}>
                {tokens.length}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              當前網絡
            </Typography>
            {isLoading ? (
              <Skeleton width={120} />
            ) : (
              <Typography variant="body2" fontWeight={500}>
                {chain ? (chain.id === 11155111 ? 'Sepolia 測試網' : 'Sonic 測試網') : '未連接'}
              </Typography>
            )}
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" fullWidth>
            存入
          </Button>
          <Button variant="outlined" fullWidth>
            提取
          </Button>
        </Box>
      </Box>
    </CardWithTitle>
  );
};