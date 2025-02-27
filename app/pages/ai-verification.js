// pages/ai-verification.js (AI 驗證頁面)
import React, { useState } from 'react';
import { Grid, Box, Typography, Button, Card, CardContent, TextField, Chip, Avatar } from '@mui/material';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { CardWithTitle } from '../components/layout/CardWithTitle';
import { PolicyRuleCard } from '../components/policy/PolicyRuleCard';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const AIVerificationPage = () => {
  const [aiStatus, setAiStatus] = useState('active'); // 'active', 'pause', 'disabled'
  
  // 示例 AI 政策
  const aiPolicy = {
    id: '5',
    name: 'AI 交易驗證',
    description: '使用人工智能自動分析交易安全性',
    policyType: 'CUSTOM',
    requireAiSignature: true,
    enabled: aiStatus === 'active',
  };
  
  const handleStatusChange = () => {
    setAiStatus(aiStatus === 'active' ? 'pause' : 'active');
  };
  
  return (
    <DashboardLayout>
      <PageHeader
        title="AI 交易驗證"
        subtitle="使用人工智能自動分析交易安全性"
        breadcrumbs={[
          { label: '首頁', href: '/' },
          { label: 'AI 交易驗證', href: '/ai-verification' },
        ]}
        chipLabel={aiStatus === 'active' ? '已啟用' : '已暫停'}
        chipColor={aiStatus === 'active' ? 'success' : 'warning'}
        action={
          <Button
            variant="contained"
            color={aiStatus === 'active' ? 'error' : 'primary'}
            onClick={handleStatusChange}
          >
            {aiStatus === 'active' ? '暫停 AI 驗證' : '啟用 AI 驗證'}
          </Button>
        }
      />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CardWithTitle
            title="實時 AI 分析"
            subtitle="AI 模型將自動審核所有交易"
            sx={{ height: '100%' }}
            footer={
              <Button 
                variant="outlined" 
                fullWidth
                startIcon={<SecurityIcon />}
              >
                查看詳細安全日誌
              </Button>
            }
          >
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2">
                  分析交易
                </Typography>
                <Chip 
                  label={`今日: 27/43`} 
                  color="primary" 
                  size="small" 
                  variant="outlined" 
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Chip label="低風險: 27" color="success" size="small" />
                <Chip label="中風險: 12" color="warning" size="small" />
                <Chip label="高風險: 4" color="error" size="small" />
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                AI 已在本月阻止 8 筆可疑交易，幫助您避免潛在損失。
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                最近分析
              </Typography>
              
              {[1, 2, 3].map(i => (
                <Card key={i} sx={{ mb: 1, bgcolor: 'background.default' }}>
                  <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {i === 1 ? '轉帳 5.2 ETH 至 0x45...7a9b' : 
                           i === 2 ? '與 Uniswap 合約交互' : 
                           '批准 USDC 支出限額'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {i === 1 ? '10 分鐘前' : i === 2 ? '2 小時前' : '昨天 15:30'}
                          </Typography>
                          <Chip 
                            label={i === 1 ? '低風險' : i === 2 ? '中風險' : '高風險'} 
                            color={i === 1 ? 'success' : i === 2 ? 'warning' : 'error'} 
                            size="small" 
                            sx={{ ml: 1, height: 20, '& .MuiChip-label': { px: 1, py: 0 } }} 
                          />
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Button size="small" sx={{ minWidth: 'auto', p: 0.5 }}>
                          <ThumbUpIcon sx={{ fontSize: 18, color: 'success.main' }} />
                        </Button>
                        <Button size="small" sx={{ minWidth: 'auto', p: 0.5 }}>
                          <ThumbDownIcon sx={{ fontSize: 18, color: 'error.main' }} />
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardWithTitle>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <CardWithTitle
            title="AI 簽名驗證"
            subtitle="檢測簽名欺詐和異常交易"
            sx={{ height: '100%' }}
          >
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="驗證交易簽名"
                placeholder="輸入交易簽名或哈希..."
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              />
              
              <Button 
                variant="contained" 
                fullWidth
                startIcon={<VerifiedUserIcon />}
              >
                驗證簽名
              </Button>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                AI 簽名者
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ width: 28, height: 28, mr: 1, bgcolor: 'primary.main' }}>AI</Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    主要 AI 簽名者
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    0xAI...5678
                  </Typography>
                </Box>
                <Chip 
                  label="活躍中" 
                  color="success" 
                  size="small" 
                  sx={{ ml: 'auto', height: 20, '& .MuiChip-label': { px: 1, py: 0 } }} 
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ width: 28, height: 28, mr: 1, bgcolor: 'warning.main' }}>B</Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    備用 AI 簽名者
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    0xB4...9012
                  </Typography>
                </Box>
                <Chip 
                  label="待命中" 
                  color="warning" 
                  size="small" 
                  variant="outlined"
                  sx={{ ml: 'auto', height: 20, '& .MuiChip-label': { px: 1, py: 0 } }} 
                />
              </Box>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                AI 政策
              </Typography>
              
              <PolicyRuleCard
                policy={aiPolicy}
                onStatusChange={() => handleStatusChange()}
              />
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  最後更新: 3 小時前
                </Typography>
                <Button size="small">
                  調整 AI 設置
                </Button>
              </Box>
            </Box>
          </CardWithTitle>
        </Grid>
        
        <Grid item xs={12}>
          <CardWithTitle
            title="AI 模型詳情"
            subtitle="了解我們使用的 AI 模型和分析方法"
          >
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  分析能力
                </Typography>
                <Typography variant="body2" paragraph>
                  我們的 AI 模型可以檢測多種類型的風險，包括釣魚攻擊、異常交易模式、合約漏洞風險等。每筆交易都會根據歷史數據、合約代碼和目標地址的信譽進行評分。
                </Typography>
                <Typography variant="body2">
                  模型定期更新以應對新的威脅和攻擊方式，保持最高的安全標準。
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  安全機制
                </Typography>
                <Typography variant="body2" paragraph>
                  AI 簽名是通過多方計算 (MPC) 技術生成的，確保私鑰片段分散存儲。所有交易分析結果都會被安全記錄在鏈上，提供完整的審計軌跡。
                </Typography>
                <Typography variant="body2">
                  系統設計有多層備份和故障轉移機制，即使在主要 AI 服務中斷的情況下也能繼續運行。
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  隱私保護
                </Typography>
                <Typography variant="body2" paragraph>
                  我們的 AI 系統在分析交易時尊重用戶隱私，不存儲敏感個人信息。所有數據處理都在加密環境中進行，並符合最高的隱私標準。
                </Typography>
                <Typography variant="body2">
                  用戶可以隨時查看和刪除他們的交易分析歷史記錄，完全控制自己的數據。
                </Typography>
              </Grid>
            </Grid>
          </CardWithTitle>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default AIVerificationPage;