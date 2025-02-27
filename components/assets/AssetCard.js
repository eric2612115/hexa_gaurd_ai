// components/assets/AssetCard.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Button, Chip, useTheme } from '@mui/material';
import Image from 'next/image';
import { CardWithTitle } from '../layout/CardWithTitle';
import { useBalance, useNetwork, useAccount } from 'wagmi';

export const AssetCard = ({ token, onSendClick }) => {
  const theme = useTheme();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [usdValue, setUsdValue] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  
  // 使用 wagmi 的 useBalance hook 查詢餘額
  const { data: balanceData, isLoading, isError } = useBalance({
    address,
    token: token.address === '0x0000000000000000000000000000000000000000' ? undefined : token.address,
    chainId: chain?.id,
    watch: true,
  });

  // 模擬獲取代幣 USD 價格和價格變化
  useEffect(() => {
    // 在實際應用中，這裡應該調用 Chainlink Price Oracle 或其他價格 API
    const fetchTokenPrice = async () => {
      try {
        // 假設價格數據 (實際應該從 API 獲取)
        const prices = {
          'ETH': 2300, // ETH 價格 $2,300
          'USDC': 1,   // USDC 價格 $1
          'WBTC': 58000, // WBTC 價格 $58,000
          'SONIC': 15,  // SONIC 價格 $15
        };
        
        // 假設價格變化數據
        const changes = {
          'ETH': 3.5,   // ETH 上漲 3.5%
          'USDC': 0.01, // USDC 上漲 0.01%
          'WBTC': 2.8,  // WBTC 上漲 2.8%
          'SONIC': 5.2, // SONIC 上漲 5.2%
        };
        
        // 模擬 API 延遲
        setTimeout(() => {
          setUsdValue(prices[token.symbol] || 0);
          setPriceChange(changes[token.symbol] || 0);
        }, 500);
      } catch (error) {
        console.error('獲取代幣價格失敗', error);
      }
    };
    
    fetchTokenPrice();
  }, [token.symbol]);
  
  // 計算 USD 總值
  const totalUsdValue = balanceData 
    ? parseFloat(balanceData.formatted) * usdValue 
    : 0;
  
  return (
    <CardWithTitle
      title={token.name}
      subtitle={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {token.symbol}
          </Typography>
          <Chip 
            label={`${priceChange > 0 ? '+' : ''}${priceChange}%`} 
            size="small" 
            color={priceChange >= 0 ? 'success' : 'error'}
            sx={{ height: 20, '& .MuiChip-label': { px: 1, py: 0.5 } }}
          />
        </Box>
      }
      sx={{ 
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: 100,
          height: 100,
          background: `linear-gradient(135deg, transparent 50%, rgba(29, 185, 84, 0.05) 50%)`,
          zIndex: 0
        }
      }}
      footer={
        <Button 
          variant="outlined" 
          fullWidth
          onClick={() => onSendClick(token)}
          sx={{ mt: 2 }}
        >
          發送 {token.symbol}
        </Button>
      }
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ p: 1, background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image
              src={token.logoUrl || `/images/tokens/${token.symbol.toLowerCase()}.png`}
              alt={token.symbol}
              width={36}
              height={36}
            />
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              ${totalUsdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per {token.symbol}
            </Typography>
          </Box>
        </Box>
        
        {isLoading ? (
          <LinearProgress sx={{ my: 2 }} />
        ) : isError ? (
          <Typography color="error" variant="body2">
            無法獲取餘額
          </Typography>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                可用餘額
              </Typography>
              <Typography variant="body2" color="text.primary">
                {parseFloat(balanceData?.formatted || '0').toFixed(6)} {token.symbol}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={100} 
              sx={{ 
                height: 8, 
                borderRadius: 1,
                backgroundColor: theme.palette.divider,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 1,
                  background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
                }
              }} 
            />
          </Box>
        )}
      </Box>
    </CardWithTitle>
  );
};

