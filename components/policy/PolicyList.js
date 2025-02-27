// components/policy/PolicyList.js
import React, { useState } from 'react';
import { Grid, Button, Box, TextField, InputAdornment, useTheme } from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { PolicyRuleCard } from './PolicyRuleCard';
import EditPolicyDialog from './EditPolicyDialog';

// 模擬政策數據
const mockPolicies = [
  {
    id: '1',
    name: '白名單轉帳政策',
    description: '允許向白名單地址轉帳，無需額外批准',
    policyType: 'WHITELIST_ONLY',
    requiredWeight: 0,
    dailyLimitUSD: 0,
    whitelistedAddresses: [
      '0x1234567890abcdef1234567890abcdef12345678',
      '0x2345678901abcdef2345678901abcdef23456789',
      '0x3456789012abcdef3456789012abcdef34567890',
      '0x4567890123abcdef4567890123abcdef45678901',
    ],
    allowedFunctions: [
      { label: 'transfer(address,uint256)', value: '0xa9059cbb' },
    ],
    expiryTime: Math.floor(Date.now() / 1000) + 90 * 24 * 3600,
    autoRenewal: true,
    requireAiSignature: false,
    enabled: true,
  },
  {
    id: '2',
    name: '大額轉帳政策',
    description: '超過 10,000 USD 的轉帳需要更多的簽名數量',
    policyType: 'AMOUNT_LIMIT',
    requiredWeight: 7,
    dailyLimitUSD: 50000,
    timelock: 0,
    expiryTime: 0,
    autoRenewal: false,
    requireAiSignature: true,
    enabled: true,
  },
  {
    id: '3',
    name: '合約升級政策',
    description: '合約升級操作需要時間鎖定和多重簽名',
    policyType: 'TIME_LOCK',
    requiredWeight: 9,
    timelock: 7 * 24 * 3600,
    expiryTime: Math.floor(Date.now() / 1000) + 365 * 24 * 3600,
    autoRenewal: true,
    requireAiSignature: true,
    enabled: true,
  },
  {
    id: '4',
    name: '智能協議互動政策',
    description: 'DeFi 協議互動的自定義政策',
    policyType: 'CUSTOM',
    customPolicyData: JSON.stringify({
      protocols: ['Uniswap', 'Aave', 'Compound'],
      maxAmountPerTx: 25000,
      cooldownPeriod: 3600,
    }, null, 2),
    requiredWeight: 5,
    expiryTime: Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
    autoRenewal: true,
    requireAiSignature: true,
    enabled: false,
  },
];

export const PolicyList = () => {
  const theme = useTheme();
  const [policies, setPolicies] = useState(mockPolicies);
  const [searchQuery, setSearchQuery] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  
  // 過濾政策
  const filteredPolicies = policies.filter(policy => 
    policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleAddNewPolicy = () => {
    setSelectedPolicy(null);
    setEditDialogOpen(true);
  };
  
  const handleEditPolicy = (policy) => {
    setSelectedPolicy(policy);
    setEditDialogOpen(true);
  };
  
  const handleStatusChange = (policyId, newStatus) => {
    setPolicies(policies.map(policy => 
      policy.id === policyId ? { ...policy, enabled: newStatus } : policy
    ));
  };
  
  const handleDeletePolicy = (policyId) => {
    setPolicies(policies.filter(policy => policy.id !== policyId));
  };
  
  const handleDuplicatePolicy = (policy) => {
    const newPolicy = {
      ...policy,
      id: Date.now().toString(),
      name: `${policy.name} (複製)`,
    };
    setPolicies([...policies, newPolicy]);
  };
  
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };
  
  const handleEditSubmit = (updatedPolicy) => {
    if (selectedPolicy) {
      // 更新現有政策
      setPolicies(policies.map(policy => 
        policy.id === updatedPolicy.id ? updatedPolicy : policy
      ));
    } else {
      // 添加新政策
      const newPolicy = {
        ...updatedPolicy,
        id: Date.now().toString(),
      };
      setPolicies([...policies, newPolicy]);
    }
    setEditDialogOpen(false);
  };
  
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder="搜索政策..."
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddNewPolicy}
        >
          新增政策
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {filteredPolicies.map(policy => (
          <Grid item xs={12} md={6} key={policy.id}>
            <PolicyRuleCard
              policy={policy}
              onStatusChange={handleStatusChange}
              onDelete={handleDeletePolicy}
              onEdit={handleEditPolicy}
              onDuplicate={handleDuplicatePolicy}
            />
          </Grid>
        ))}
        
        {filteredPolicies.length === 0 && (
          <Grid item xs={12}>
            <Box 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                border: `1px dashed ${theme.palette.divider}`,
                borderRadius: 2,
                bgcolor: 'rgba(0, 0, 0, 0.02)',
              }}
            >
              {searchQuery ? (
                <>沒有找到符合 "{searchQuery}" 的政策</>
              ) : (
                <>尚未創建任何政策。點擊"新增政策"按鈕創建您的第一個政策。</>
              )}
            </Box>
          </Grid>
        )}
      </Grid>
      
      <EditPolicyDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        policy={selectedPolicy}
        onSubmit={handleEditSubmit}
      />
    </>
  );
};