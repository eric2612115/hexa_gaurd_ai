// components/policy/PolicyRuleCard.js
import React, { useState } from 'react';
import { 
  Box, Typography, Switch, IconButton, Tooltip, Chip, 
  Menu, MenuItem, ListItemIcon, ListItemText, Divider, useTheme 
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as FileCopyIcon,
  VerifiedUser as VerifiedUserIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { CardWithTitle } from '../layout/CardWithTitle';
import EditPolicyDialog from './EditPolicyDialog';

export const PolicyRuleCard = ({ policy, onStatusChange, onDelete, onEdit, onDuplicate }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const getPolicyTypeColor = (type) => {
    switch (type) {
      case 'WHITELIST_ONLY':
        return theme.palette.success.main;
      case 'AMOUNT_LIMIT':
        return theme.palette.warning.main;
      case 'TIME_LOCK':
        return theme.palette.info.main;
      case 'CUSTOM':
      default:
        return theme.palette.primary.main;
    }
  };
  
  const getPolicyTypeLabel = (type) => {
    switch (type) {
      case 'WHITELIST_ONLY':
        return '白名單政策';
      case 'AMOUNT_LIMIT':
        return '金額限制政策';
      case 'TIME_LOCK':
        return '時間鎖定政策';
      case 'CUSTOM':
        return '自定義政策';
      default:
        return '未知政策';
    }
  };
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleEditClick = () => {
    setAnchorEl(null);
    setEditDialogOpen(true);
  };
  
  const handleDeleteClick = () => {
    setAnchorEl(null);
    onDelete?.(policy.id);
  };
  
  const handleDuplicateClick = () => {
    setAnchorEl(null);
    onDuplicate?.(policy);
  };
  
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };
  
  const handleEditSubmit = (updatedPolicy) => {
    onEdit?.(updatedPolicy);
    setEditDialogOpen(false);
  };
  
  const expirationDate = policy.expiryTime ? new Date(policy.expiryTime * 1000).toLocaleDateString() : '永不過期';
  
  return (
    <>
      <CardWithTitle
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" noWrap sx={{ maxWidth: 150 }}>
              {policy.name}
            </Typography>
            <Chip
              label={getPolicyTypeLabel(policy.policyType)}
              size="small"
              sx={{ 
                ml: 1, 
                bgcolor: `${getPolicyTypeColor(policy.policyType)}20`, 
                color: getPolicyTypeColor(policy.policyType),
                fontWeight: 500
              }}
            />
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Switch
              checked={policy.enabled}
              onChange={() => onStatusChange?.(policy.id, !policy.enabled)}
              color="primary"
              size="small"
            />
            <IconButton size="small" onClick={handleMenuClick}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        }
        sx={{
          borderLeft: `4px solid ${getPolicyTypeColor(policy.policyType)}`,
        }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {policy.description}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2, mb: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                簽名閾值
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {policy.policyType === 'WHITELIST_ONLY' ? '無需簽名' : 
                 policy.policyType === 'AMOUNT_LIMIT' ? `${policy.requiredWeight} / 9` : 
                 policy.policyType === 'TIME_LOCK' ? `${policy.requiredWeight} / 9` : 
                 '自定義邏輯'}
              </Typography>
            </Box>
            
            {policy.policyType === 'AMOUNT_LIMIT' && (
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  每日限額
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  ${policy.dailyLimitUSD?.toLocaleString()} USD
                </Typography>
              </Box>
            )}
            
            {policy.policyType === 'TIME_LOCK' && (
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  鎖定時間
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {policy.timelock ? `${policy.timelock / 3600} 小時` : '無'}
                </Typography>
              </Box>
            )}
            
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                AI 簽名要求
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {policy.requireAiSignature ? '需要' : '不需要'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                有效期至
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {expirationDate}
              </Typography>
            </Box>
          </Box>
          
          {policy.policyType === 'WHITELIST_ONLY' && policy.whitelistedAddresses?.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                白名單地址 ({policy.whitelistedAddresses.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {policy.whitelistedAddresses.slice(0, 3).map((address, index) => (
                  <Chip
                    key={index}
                    label={`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
                    size="small"
                    sx={{ 
                      bgcolor: theme.palette.background.default,
                      fontSize: '0.7rem'
                    }}
                  />
                ))}
                {policy.whitelistedAddresses.length > 3 && (
                  <Chip
                    label={`+${policy.whitelistedAddresses.length - 3} 個地址`}
                    size="small"
                    sx={{ 
                      bgcolor: theme.palette.background.default,
                      fontSize: '0.7rem'
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </Box>
      </CardWithTitle>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            boxShadow: theme.shadows[3],
            minWidth: 180,
          }
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>編輯政策</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDuplicateClick}>
          <ListItemIcon>
            <FileCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>複製政策</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteClick} sx={{ color: theme.palette.error.main }}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>刪除政策</ListItemText>
        </MenuItem>
      </Menu>
      
      {editDialogOpen && (
        <EditPolicyDialog
          open={editDialogOpen}
          onClose={handleEditDialogClose}
          policy={policy}
          onSubmit={handleEditSubmit}
        />
      )}
    </>
  );
};