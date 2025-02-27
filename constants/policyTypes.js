// constants/policyTypes.js
export const policyTypes = {
    'WHITELIST_ONLY': '白名單政策',
    'AMOUNT_LIMIT': '金額限制政策',
    'TIME_LOCK': '時間鎖定政策',
    'CUSTOM': '自定義政策'
  };
  
  export const policyTypeDescriptions = {
    'WHITELIST_ONLY': '允許向白名單地址轉帳，無需額外批准',
    'AMOUNT_LIMIT': '根據交易金額設定不同的簽名門檻',
    'TIME_LOCK': '交易將在指定時間後才能執行',
    'CUSTOM': '根據特定需求自定義的複雜政策規則'
  };
  
  export const policyTypeIcons = {
    'WHITELIST_ONLY': 'verified',
    'AMOUNT_LIMIT': 'savings',
    'TIME_LOCK': 'schedule',
    'CUSTOM': 'settings'
  };
  
  export const policyTypeColors = {
    'WHITELIST_ONLY': 'success',
    'AMOUNT_LIMIT': 'warning',
    'TIME_LOCK': 'info',
    'CUSTOM': 'primary'
  };
  
  // 用於展示的範例政策數據
  export const examplePolicies = [
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
      name: 'DeFi互動政策',
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