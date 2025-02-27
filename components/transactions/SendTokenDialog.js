// components/transactions/SendTokenDialog.js
import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, 
  Typography, Box, InputAdornment, FormHelperText, CircularProgress,
  Divider, Chip, useTheme, Alert
} from '@mui/material';
import Image from 'next/image';
import { useAccount, useBalance, useNetwork, useSendTransaction, useFeeData, usePrepareSendTransaction } from 'wagmi';
import { parseEther, parseUnits, formatUnits } from 'ethers/lib/utils';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

const SendTokenDialog = ({ open, onClose, token }) => {
  const theme = useTheme();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  
  // 獲取用戶餘額
  const { data: balanceData } = useBalance({
    address,
    token: token?.address === '0x0000000000000000000000000000000000000000' ? undefined : token?.address,
    chainId: chain?.id,
    watch: true,
  });
  
  // 獲取網絡費用數據
  const { data: feeData } = useFeeData({
    chainId: chain?.id,
  });

  // 準備交易配置
  const { config, error: prepareError } = usePrepareSendTransaction({
    to: recipient,
    value: amount && token?.address === '0x0000000000000000000000000000000000000000' 
      ? parseEther(amount) 
      : undefined,
    // 如果不是原生代幣，這裡應該使用 ERC20 合約的 transfer 方法
  });

  // 發送交易 hook
  const { sendTransaction, isLoading, isSuccess, error: sendError } = useSendTransaction(config);
  
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError('');
    }
  };
  
  const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
    setError('');
  };

  const handleSetMaxAmount = () => {
    if (balanceData) {
      setAmount(balanceData.formatted);
    }
  };

  const validateTransaction = () => {
    if (!recipient) {
      setError('請輸入收款地址');
      return false;
    }
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      setError('無效的以太坊地址');
      return false;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('請輸入有效金額');
      return false;
    }
    
    if (balanceData && parseFloat(amount) > parseFloat(balanceData.formatted)) {
      setError('餘額不足');
      return false;
    }
    
    return true;
  };
  
  const handleAiAnalyze = () => {
    if (!validateTransaction()) return;
    
    setIsAiAnalyzing(true);
    
    // 模擬 AI 分析
    setTimeout(() => {
      // 隨機生成分析結果 (在實際應用中應調用後端 API)
      const randomRisk = Math.random();
      let riskLevel, findings, recommendations;
      
      if (randomRisk < 0.7) {
        riskLevel = 'low';
        findings = ['收款地址不在已知黑名單中', '交易金額在正常範圍內', '符合用戶正常交易模式'];
        recommendations = ['可以安全進行交易'];
      } else if (randomRisk < 0.9) {
        riskLevel = 'medium';
        findings = ['收款地址是新地址，首次交互', '交易金額略高於用戶平均交易金額'];
        recommendations = ['建議確認收款地址', '考慮分批轉賬減少風險'];
      } else {
        riskLevel = 'high';
        findings = ['收款地址與已知詐騙地址相似', '交易金額異常大', '與用戶歷史交易模式顯著不符'];
        recommendations = ['強烈建議重新確認收款地址', '不建議繼續交易'];
      }
      
      setAiAnalysisResult({
        riskLevel,
        findings,
        recommendations
      });
      
      setIsAiAnalyzing(false);
    }, 2000);
  };

  const handleSendTransaction = () => {
    if (!validateTransaction()) return;
    
    // 如果是 ERC20 代幣，應該調用相應的合約方法
    // 這裡使用了簡化的原生代幣發送
    if (token.address === '0x0000000000000000000000000000000000000000') {
      sendTransaction?.();
    } else {
      // 提示用戶此功能尚未實現
      setError('ERC20 代幣發送功能尚未完全實現');
    }
  };
  
  // 估算 gas 費用 (簡化版)
  const estimatedGasFee = feeData
    ? parseFloat(formatUnits(feeData.gasPrice || '0', 'gwei')) * 21000 / 1e9
    : 0;
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: theme.palette.background.paper,
          backgroundImage: 'none',
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ mr: 2, p: 1, background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image
              src={token?.logoUrl || `/images/tokens/${token?.symbol.toLowerCase()}.png`}
              alt={token?.symbol}
              width={28}
              height={28}
            />
          </Box>
          <Typography variant="h6">
            發送 {token?.symbol}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <TextField
          fullWidth
          label="接收地址"
          placeholder="0x..."
          value={recipient}
          onChange={handleRecipientChange}
          margin="normal"
          variant="outlined"
          error={error.includes('地址')}
          sx={{ mb: 3 }}
        />
        
        <TextField
          fullWidth
          label="金額"
          placeholder="0.0"
          value={amount}
          onChange={handleAmountChange}
          margin="normal"
          variant="outlined"
          error={error.includes('金額') || error.includes('餘額')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleSetMaxAmount}
                    sx={{ mr: 1 }}
                  >
                    最大
                  </Button>
                  <Typography>{token?.symbol}</Typography>
                </Box>
              </InputAdornment>
            ),
          }}
        />
        
        {balanceData && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              可用餘額: {parseFloat(balanceData.formatted).toFixed(6)} {token?.symbol}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ≈ ${(parseFloat(balanceData.formatted) * (token?.symbol === 'ETH' ? 2300 : token?.symbol === 'WBTC' ? 58000 : 1)).toFixed(2)}
            </Typography>
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            交易詳情
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              預估 Gas 費用
            </Typography>
            <Typography variant="body2">
              {estimatedGasFee.toFixed(6)} {chain?.nativeCurrency.symbol} (${(estimatedGasFee * (chain?.id === 11155111 ? 2300 : 15)).toFixed(2)})
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              網絡
            </Typography>
            <Typography variant="body2">
              {chain?.id === 11155111 ? 'Sepolia 測試網' : 'Sonic 測試網'}
            </Typography>
          </Box>
        </Box>
        
        {aiAnalysisResult && (
          <Box sx={{ mt: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                AI 安全分析結果
              </Typography>
              <Chip 
                label={aiAnalysisResult.riskLevel === 'low' ? '低風險' : aiAnalysisResult.riskLevel === 'medium' ? '中風險' : '高風險'} 
                color={aiAnalysisResult.riskLevel === 'low' ? 'success' : aiAnalysisResult.riskLevel === 'medium' ? 'warning' : 'error'}
                size="small"
              />
            </Box>
            
            <Alert 
              severity={aiAnalysisResult.riskLevel === 'low' ? 'success' : aiAnalysisResult.riskLevel === 'medium' ? 'warning' : 'error'}
              sx={{ mb: 2 }}
            >
              <Typography variant="body2" fontWeight={500}>
                {aiAnalysisResult.riskLevel === 'low' 
                  ? '此交易看起來安全' 
                  : aiAnalysisResult.riskLevel === 'medium' 
                  ? '此交易可能有一些風險' 
                  : '此交易存在高風險'}
              </Typography>
            </Alert>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              發現項:
            </Typography>
            <Box component="ul" sx={{ mt: 0, pl: 2 }}>
              {aiAnalysisResult.findings.map((finding, index) => (
                <Typography component="li" variant="body2" key={index} sx={{ mb: 0.5 }}>
                  {finding}
                </Typography>
              ))}
            </Box>
            
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 1 }}>
              建議:
            </Typography>
            <Box component="ul" sx={{ mt: 0, pl: 2 }}>
              {aiAnalysisResult.recommendations.map((recommendation, index) => (
                <Typography component="li" variant="body2" key={index} sx={{ mb: 0.5 }}>
                  {recommendation}
                </Typography>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} color="inherit">
          取消
        </Button>
        
        {!aiAnalysisResult ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAiAnalyze}
            disabled={isAiAnalyzing}
            startIcon={isAiAnalyzing ? <CircularProgress size={20} /> : null}
          >
            {isAiAnalyzing ? '分析中...' : 'AI 安全分析'}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendTransaction}
            disabled={isLoading || aiAnalysisResult.riskLevel === 'high'}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
            endIcon={!isLoading && <ArrowForwardIcon />}
          >
            {isLoading ? '處理中...' : '確認發送'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SendTokenDialog;