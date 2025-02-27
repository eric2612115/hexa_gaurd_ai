// components/transactions/NewTransactionDialog.js
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, 
  FormControl, InputLabel, Select, MenuItem, Box, Typography, Divider,
  InputAdornment, Autocomplete, Chip, CircularProgress, useTheme,
  FormHelperText, Stepper, Step, StepLabel, StepContent, Paper
} from '@mui/material';
import { useAccount, useNetwork } from 'wagmi';
import { SUPPORTED_TOKENS } from '../../config/wagmi';

const NewTransactionDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    type: 'transfer',
    token: null,
    amount: '',
    recipient: '',
    contractAddress: '',
    contractMethod: '',
    contractParams: '',
    policyType: '',
    policyDescription: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // 獲取當前鏈上支持的代幣列表
  const tokens = chain ? SUPPORTED_TOKENS[chain.id] || [] : [];
  
  // 合約方法選項
  const contractMethods = [
    { value: 'transfer', label: 'transfer(address,uint256)' },
    { value: 'approve', label: 'approve(address,uint256)' },
    { value: 'transferFrom', label: 'transferFrom(address,address,uint256)' },
    { value: 'swap', label: 'swap(uint256,uint256,address,bytes)' },
  ];
  
  // 政策類型選項
  const policyTypes = [
    { value: 'WHITELIST_ONLY', label: '白名單政策' },
    { value: 'AMOUNT_LIMIT', label: '金額限制政策' },
    { value: 'TIME_LOCK', label: '時間鎖定政策' },
    { value: 'CUSTOM', label: '自定義政策' },
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // 清除對應的錯誤
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const handleTokenChange = (event, newValue) => {
    setFormData({
      ...formData,
      token: newValue,
    });
    
    // 清除金額錯誤
    if (errors.token) {
      setErrors({
        ...errors,
        token: '',
      });
    }
  };
  
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleBackStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const validateCurrentStep = () => {
    const newErrors = {};
    
    switch (activeStep) {
      case 0:
        // 交易類型驗證
        if (!formData.type) {
          newErrors.type = '請選擇交易類型';
        }
        break;
        
      case 1:
        // 根據交易類型進行驗證
        if (formData.type === 'transfer') {
          if (!formData.token) {
            newErrors.token = '請選擇代幣';
          }
          
          if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = '請輸入有效金額';
          }
          
          if (!formData.recipient) {
            newErrors.recipient = '請輸入接收地址';
          } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.recipient)) {
            newErrors.recipient = '無效的以太坊地址';
          }
        } else if (formData.type === 'contract-interaction') {
          if (!formData.contractAddress) {
            newErrors.contractAddress = '請輸入合約地址';
          } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.contractAddress)) {
            newErrors.contractAddress = '無效的合約地址';
          }
          
          if (!formData.contractMethod) {
            newErrors.contractMethod = '請選擇合約方法';
          }
        } else if (formData.type === 'policy-update') {
          if (!formData.policyType) {
            newErrors.policyType = '請選擇政策類型';
          }
          
          if (!formData.policyDescription) {
            newErrors.policyDescription = '請輸入政策描述';
          }
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateCurrentStep()) {
      setLoading(true);
      
      // 模擬提交過程
      setTimeout(() => {
        setLoading(false);
        onClose();
        
        // 這裡應該調用實際的合約交互函數
        console.log('提交交易:', formData);
      }, 2000);
    }
  };
  
  // 渲染交易類型選擇步驟
  const renderTypeStep = () => (
    <Box sx={{ py: 1 }}>
      <FormControl fullWidth error={!!errors.type}>
        <InputLabel>交易類型</InputLabel>
        <Select
          name="type"
          value={formData.type}
          onChange={handleChange}
          label="交易類型"
        >
          <MenuItem value="transfer">轉賬交易</MenuItem>
          <MenuItem value="contract-interaction">合約交互</MenuItem>
          <MenuItem value="policy-update">政策更新</MenuItem>
        </Select>
        {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
      </FormControl>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {formData.type === 'transfer' 
            ? '創建一個發送代幣至指定地址的交易。'
            : formData.type === 'contract-interaction'
            ? '與智能合約進行交互，調用特定函數。'
            : '更新錢包政策設置，例如白名單、簽名閾值等。'}
        </Typography>
      </Box>
    </Box>
  );
  
  // 渲染交易詳情步驟
  const renderDetailsStep = () => {
    switch (formData.type) {
      case 'transfer':
        return (
          <Box sx={{ py: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              轉賬詳情
            </Typography>
            
            <Autocomplete
              value={formData.token}
              onChange={handleTokenChange}
              options={tokens}
              getOptionLabel={(option) => option.name || ''}
              renderOption={(props, option) => (
                <Box component="li" sx={{ display: 'flex', alignItems: 'center' }} {...props}>
                  <Box 
                    sx={{ 
                      mr: 1, 
                      bgcolor: 'background.default', 
                      borderRadius: '50%', 
                      width: 24, 
                      height: 24, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    <img
                      src={option.logoUrl}
                      alt={option.symbol}
                      width={16}
                      height={16}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.symbol}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="選擇代幣"
                  margin="normal"
                  error={!!errors.token}
                  helperText={errors.token}
                />
              )}
            />
            
            <TextField
              name="amount"
              label="金額"
              value={formData.amount}
              onChange={handleChange}
              margin="normal"
              fullWidth
              type="number"
              error={!!errors.amount}
              helperText={errors.amount}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {formData.token?.symbol || ''}
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              name="recipient"
              label="接收地址"
              value={formData.recipient}
              onChange={handleChange}
              margin="normal"
              fullWidth
              error={!!errors.recipient}
              helperText={errors.recipient || '輸入有效的以太坊地址'}
              placeholder="0x..."
            />
          </Box>
        );
        
      case 'contract-interaction':
        return (
          <Box sx={{ py: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              合約交互詳情
            </Typography>
            
            <TextField
              name="contractAddress"
              label="合約地址"
              value={formData.contractAddress}
              onChange={handleChange}
              margin="normal"
              fullWidth
              error={!!errors.contractAddress}
              helperText={errors.contractAddress || '輸入有效的合約地址'}
              placeholder="0x..."
            />
            
            <FormControl fullWidth margin="normal" error={!!errors.contractMethod}>
              <InputLabel>合約方法</InputLabel>
              <Select
                name="contractMethod"
                value={formData.contractMethod}
                onChange={handleChange}
                label="合約方法"
              >
                {contractMethods.map((method) => (
                  <MenuItem key={method.value} value={method.value}>
                    {method.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.contractMethod && <FormHelperText>{errors.contractMethod}</FormHelperText>}
            </FormControl>
            
            <TextField
              name="contractParams"
              label="參數 (JSON 格式)"
              value={formData.contractParams}
              onChange={handleChange}
              margin="normal"
              fullWidth
              multiline
              rows={3}
              placeholder='例如: {"param1": "value1", "param2": 123}'
            />
          </Box>
        );
        
      case 'policy-update':
        return (
          <Box sx={{ py: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              政策更新詳情
            </Typography>
            
            <FormControl fullWidth margin="normal" error={!!errors.policyType}>
              <InputLabel>政策類型</InputLabel>
              <Select
                name="policyType"
                value={formData.policyType}
                onChange={handleChange}
                label="政策類型"
              >
                {policyTypes.map((policy) => (
                  <MenuItem key={policy.value} value={policy.value}>
                    {policy.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.policyType && <FormHelperText>{errors.policyType}</FormHelperText>}
            </FormControl>
            
            <TextField
              name="policyDescription"
              label="政策描述"
              value={formData.policyDescription}
              onChange={handleChange}
              margin="normal"
              fullWidth
              multiline
              rows={3}
              error={!!errors.policyDescription}
              helperText={errors.policyDescription}
              placeholder="請詳細描述此政策更新的目的和具體變更內容..."
            />
          </Box>
        );
        
      default:
        return null;
    }
  };
  
  // 渲染確認步驟
  const renderConfirmStep = () => (
    <Box sx={{ py: 1 }}>
      <Typography variant="subtitle2" gutterBottom>
        確認交易詳情
      </Typography>
      
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            交易類型
          </Typography>
          <Typography variant="body1">
            {formData.type === 'transfer' 
              ? '轉賬交易'
              : formData.type === 'contract-interaction'
              ? '合約交互'
              : '政策更新'}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        {formData.type === 'transfer' && (
          <>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                代幣
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                {formData.token && (
                  <>
                    <Box 
                      sx={{ 
                        mr: 1, 
                        bgcolor: 'background.default', 
                        borderRadius: '50%', 
                        width: 24, 
                        height: 24, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}
                    >
                      <img
                        src={formData.token.logoUrl}
                        alt={formData.token.symbol}
                        width={16}
                        height={16}
                      />
                    </Box>
                    <Typography variant="body1">
                      {formData.token.name} ({formData.token.symbol})
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
            
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                金額
              </Typography>
              <Typography variant="body1">
                {formData.amount} {formData.token?.symbol}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                接收地址
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem' 
                }}
              >
                {formData.recipient}
              </Typography>
            </Box>
          </>
        )}
        
        {formData.type === 'contract-interaction' && (
          <>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                合約地址
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem' 
                }}
              >
                {formData.contractAddress}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                合約方法
              </Typography>
              <Typography variant="body1">
                {contractMethods.find(m => m.value === formData.contractMethod)?.label || formData.contractMethod}
              </Typography>
            </Box>
            
            {formData.contractParams && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  參數
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem' 
                  }}
                >
                  {formData.contractParams}
                </Typography>
              </Box>
            )}
          </>
        )}
        
        {formData.type === 'policy-update' && (
          <>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                政策類型
              </Typography>
              <Typography variant="body1">
                {policyTypes.find(p => p.value === formData.policyType)?.label || formData.policyType}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                政策描述
              </Typography>
              <Typography variant="body1">
                {formData.policyDescription}
              </Typography>
            </Box>
          </>
        )}
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box>
          <Typography variant="body2" color="text.secondary">
            需要簽名
          </Typography>
          <Typography variant="body1">
            {formData.type === 'transfer' 
              ? '5/9 簽名'
              : formData.type === 'contract-interaction'
              ? '7/9 簽名'
              : '9/9 簽名 (全部成員)'}
          </Typography>
        </Box>
      </Paper>
      
      <Typography variant="body2" color="text.secondary">
        點擊「建立交易」後，交易將被提交給其他成員進行簽名。
      </Typography>
    </Box>
  );
  
  const steps = [
    {
      label: '選擇交易類型',
      content: renderTypeStep,
    },
    {
      label: '填寫交易詳情',
      content: renderDetailsStep,
    },
    {
      label: '確認交易',
      content: renderConfirmStep,
    },
  ];
  
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
        新建交易
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                {step.content()}
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      onClick={index === steps.length - 1 ? handleSubmit : handleNextStep}
                      sx={{ mr: 1 }}
                      disabled={loading}
                      endIcon={loading && index === steps.length - 1 ? <CircularProgress size={16} /> : null}
                    >
                      {index === steps.length - 1 ? '建立交易' : '下一步'}
                    </Button>
                    <Button
                      disabled={index === 0 || loading}
                      onClick={handleBackStep}
                      sx={{ mr: 1 }}
                    >
                      上一步
                    </Button>
                  </Box>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          取消
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewTransactionDialog;