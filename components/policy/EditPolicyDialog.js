// components/policy/EditPolicyDialog.js
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, FormHelperText, Switch,
  Typography, Box, Chip, Divider, FormControlLabel, useTheme, Autocomplete,
  Slider
} from '@mui/material';
import { policyTypes } from '../../constants/policyTypes';

const EditPolicyDialog = ({ open, onClose, policy, onSubmit }) => {
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    policyType: 'WHITELIST_ONLY',
    requiredWeight: 3,
    dailyLimitUSD: 10000,
    timelock: 24 * 3600, // 24 hours in seconds
    whitelistedAddresses: [],
    allowedFunctions: [],
    expiryTime: 0,
    autoRenewal: true,
    requireAiSignature: false,
    enabled: true,
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (policy) {
      setFormData({
        ...formData,
        ...policy,
      });
    }
  }, [policy]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };
  
  const handleWhitelistChange = (event, newValue) => {
    setFormData({
      ...formData,
      whitelistedAddresses: newValue,
    });
  };

  const handleSliderChange = (name) => (event, newValue) => {
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleFunctionSelectorsChange = (event, newValue) => {
    setFormData({
      ...formData,
      allowedFunctions: newValue,
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '請輸入政策名稱';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '請輸入政策描述';
    }
    
    if (formData.policyType === 'WHITELIST_ONLY' && formData.whitelistedAddresses.length === 0) {
      newErrors.whitelistedAddresses = '請至少添加一個白名單地址';
    }
    
    if (formData.policyType === 'AMOUNT_LIMIT' && (formData.dailyLimitUSD <= 0 || isNaN(formData.dailyLimitUSD))) {
      newErrors.dailyLimitUSD = '請輸入有效的每日限額';
    }
    
    if (formData.policyType === 'TIME_LOCK' && (formData.timelock <= 0 || isNaN(formData.timelock))) {
      newErrors.timelock = '請輸入有效的鎖定時間';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  // Mock function selectors for demonstration
  const functionSelectors = [
    { label: 'transfer(address,uint256)', value: '0xa9059cbb' },
    { label: 'transferFrom(address,address,uint256)', value: '0x23b872dd' },
    { label: 'approve(address,uint256)', value: '0x095ea7b3' },
    { label: 'swap(uint256,uint256,address,bytes)', value: '0x12aa3caf' },
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
        {policy ? '編輯政策' : '新增政策'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name="name"
              label="政策名稱"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />
            
            <FormControl fullWidth error={!!errors.policyType}>
              <InputLabel>政策類型</InputLabel>
              <Select
                name="policyType"
                value={formData.policyType}
                onChange={handleChange}
                label="政策類型"
              >
                {Object.entries(policyTypes).map(([value, label]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
              {errors.policyType && <FormHelperText>{errors.policyType}</FormHelperText>}
            </FormControl>
          </Box>
          
          <TextField
            name="description"
            label="政策描述"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            error={!!errors.description}
            helperText={errors.description}
          />
          
          <Divider sx={{ my: 1 }}>
            <Typography variant="caption" color="text.secondary">
              政策參數
            </Typography>
          </Divider>
          
          {formData.policyType === 'WHITELIST_ONLY' && (
            <Box>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={formData.whitelistedAddresses}
                onChange={handleWhitelistChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip 
                      variant="outlined" 
                      label={option} 
                      size="small"
                      {...getTagProps({ index })} 
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="白名單地址"
                    placeholder="輸入以太坊地址..."
                    helperText={errors.whitelistedAddresses || "輸入地址後按 Enter 添加"}
                    error={!!errors.whitelistedAddresses}
                  />
                )}
              />
              
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, mb: 1 }}>
                允許的合約函數 (可選)
              </Typography>
              
              <Autocomplete
                multiple
                options={functionSelectors}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                value={formData.allowedFunctions}
                onChange={handleFunctionSelectorsChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="函數選擇器"
                    placeholder="選擇允許的函數..."
                    variant="outlined"
                  />
                )}
              />
            </Box>
          )}
          
          {formData.policyType === 'AMOUNT_LIMIT' && (
            <Box>
              <TextField
                name="dailyLimitUSD"
                label="每日限額 (USD)"
                type="number"
                value={formData.dailyLimitUSD}
                onChange={handleChange}
                fullWidth
                error={!!errors.dailyLimitUSD}
                helperText={errors.dailyLimitUSD}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />
              
              <Box sx={{ mt: 3 }}>
                <Typography gutterBottom>
                  簽名閾值 ({formData.requiredWeight}/9)
                </Typography>
                <Slider
                  value={formData.requiredWeight}
                  onChange={handleSliderChange('requiredWeight')}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={9}
                  sx={{
                    color: theme.palette.primary.main,
                    '& .MuiSlider-thumb': {
                      backgroundColor: theme.palette.primary.main,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  設定完成此政策下交易所需的簽名數量
                </Typography>
              </Box>
            </Box>
          )}
          
          {formData.policyType === 'TIME_LOCK' && (
            <Box>
              <FormControl fullWidth>
                <InputLabel>鎖定時間</InputLabel>
                <Select
                  name="timelock"
                  value={formData.timelock}
                  onChange={handleChange}
                  label="鎖定時間"
                >
                  <MenuItem value={3600}>1 小時</MenuItem>
                  <MenuItem value={6 * 3600}>6 小時</MenuItem>
                  <MenuItem value={12 * 3600}>12 小時</MenuItem>
                  <MenuItem value={24 * 3600}>1 天</MenuItem>
                  <MenuItem value={3 * 24 * 3600}>3 天</MenuItem>
                  <MenuItem value={7 * 24 * 3600}>1 週</MenuItem>
                </Select>
                <FormHelperText>交易提交後需要等待的時間</FormHelperText>
              </FormControl>
            </Box>
          )}
          
          {formData.policyType === 'CUSTOM' && (
            <Box>
              <Typography color="text.secondary" gutterBottom>
                自定義政策提供最大的靈活性，但需要更複雜的配置。請在下方輸入JSON格式的策略規則。
              </Typography>
              
              <TextField
                name="customPolicyData"
                label="自定義政策數據 (JSON)"
                value={formData.customPolicyData || ''}
                onChange={handleChange}
                fullWidth
                multiline
                rows={6}
                error={!!errors.customPolicyData}
                helperText={errors.customPolicyData}
              />
            </Box>
          )}
          
          <Divider sx={{ my: 1 }}>
            <Typography variant="caption" color="text.secondary">
              高級設置
            </Typography>
          </Divider>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  name="requireAiSignature"
                  checked={formData.requireAiSignature}
                  onChange={handleSwitchChange}
                  color="primary"
                />
              }
              label="需要 AI 簽名驗證"
            />
            <Typography variant="caption" color="text.secondary" sx={{ pl: 3.5 }}>
              啟用後，此政策下的交易需要通過AI安全分析
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  name="autoRenewal"
                  checked={formData.autoRenewal}
                  onChange={handleSwitchChange}
                  color="primary"
                />
              }
              label="自動續期"
            />
            <Typography variant="caption" color="text.secondary" sx={{ pl: 3.5 }}>
              啟用後，政策到期時將自動續期30天
            </Typography>
            
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel>有效期</InputLabel>
              <Select
                name="expiryTime"
                value={formData.expiryTime}
                onChange={handleChange}
                label="有效期"
              >
                <MenuItem value={0}>永不過期</MenuItem>
                <MenuItem value={Math.floor(Date.now() / 1000) + 30 * 24 * 3600}>30 天</MenuItem>
                <MenuItem value={Math.floor(Date.now() / 1000) + 90 * 24 * 3600}>90 天</MenuItem>
                <MenuItem value={Math.floor(Date.now() / 1000) + 180 * 24 * 3600}>180 天</MenuItem>
                <MenuItem value={Math.floor(Date.now() / 1000) + 365 * 24 * 3600}>1 年</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
        >
          取消
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
        >
          {policy ? '更新政策' : '創建政策'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPolicyDialog;