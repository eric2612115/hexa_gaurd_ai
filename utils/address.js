// utils/address.js
/**
 * 截斷以太坊地址，顯示前6位和後4位
 * @param {string} address 完整的以太坊地址
 * @param {number} prefixLength 前綴長度，默認6
 * @param {number} suffixLength 後綴長度，默認4
 * @returns {string} 截斷後的地址
 */
export const truncateAddress = (address, prefixLength = 6, suffixLength = 4) => {
    if (!address) return '';
    if (address.length < prefixLength + suffixLength + 3) return address;
    
    return `${address.substring(0, prefixLength)}...${address.substring(address.length - suffixLength)}`;
  };
  
  /**
   * 驗證以太坊地址是否有效
   * @param {string} address 要驗證的地址
   * @returns {boolean} 地址是否有效
   */
  export const isValidEthereumAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };
  
  // utils/date.js
  /**
   * 格式化日期為本地字符串
   * @param {Date|number} date 日期對象或時間戳
   * @param {object} options 格式化選項
   * @returns {string} 格式化後的日期字符串
   */
  export const formatDate = (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    const dateObj = date instanceof Date ? date : new Date(date);
    
    return new Intl.DateTimeFormat('zh-TW', mergedOptions).format(dateObj);
  };
  
  /**
   * 計算相對時間（例如"3小時前"）
   * @param {Date|number} date 日期對象或時間戳
   * @returns {string} 相對時間字符串
   */
  export const getRelativeTime = (date) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffMs = now - dateObj;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffMonth / 12);
    
    if (diffSec < 60) {
      return '剛剛';
    } else if (diffMin < 60) {
      return `${diffMin} 分鐘前`;
    } else if (diffHr < 24) {
      return `${diffHr} 小時前`;
    } else if (diffDay < 30) {
      return `${diffDay} 天前`;
    } else if (diffMonth < 12) {
      return `${diffMonth} 個月前`;
    } else {
      return `${diffYear} 年前`;
    }
  };
  
  // utils/number.js
  /**
   * 格式化數字為指定小數位的字符串
   * @param {number} number 要格式化的數字
   * @param {number} decimals 小數位數
   * @param {object} options 其他格式化選項
   * @returns {string} 格式化後的數字字符串
   */
  export const formatNumber = (number, decimals = 2, options = {}) => {
    const defaultOptions = {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    return Number(number).toLocaleString(undefined, mergedOptions);
  };
  
  /**
   * 將 Wei 轉換為 Ether（或其他單位）
   * @param {string|number} wei Wei 值
   * @param {number} decimals 代幣小數位數，ETH 為 18
   * @param {number} displayDecimals 顯示的小數位數
   * @returns {string} 轉換後的值
   */
  export const formatFromWei = (wei, decimals = 18, displayDecimals = 6) => {
    if (!wei) return '0';
    
    // 將 wei 轉換為基本單位
    const divisor = Math.pow(10, decimals);
    const value = Number(wei) / divisor;
    
    return formatNumber(value, displayDecimals);
  };
  
  /**
   * 將 Ether（或其他單位）轉換為 Wei
   * @param {string|number} ether Ether 值
   * @param {number} decimals 代幣小數位數，ETH 為 18
   * @returns {string} Wei 值
   */
  export const formatToWei = (ether, decimals = 18) => {
    if (!ether) return '0';
    
    // 將基本單位轉換為 wei
    const multiplier = Math.pow(10, decimals);
    const value = Number(ether) * multiplier;
    
    return value.toString();
  };
  
  /**
   * 格式化價格為美元字符串
   * @param {number} price 價格
   * @param {number} decimals 小數位數
   * @returns {string} 格式化後的價格字符串
   */
  export const formatUSD = (price, decimals = 2) => {
    if (price === undefined || price === null) return '$0.00';
    
    return `$${formatNumber(price, decimals)}`;
  };
  
  // utils/storage.js
  /**
   * 從 localStorage 獲取數據
   * @param {string} key 存儲鍵
   * @param {any} defaultValue 默認值
   * @returns {any} 存儲的數據或默認值
   */
  export const getFromStorage = (key, defaultValue = null) => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return defaultValue;
    }
  };
  
  /**
   * 將數據存儲到 localStorage
   * @param {string} key 存儲鍵
   * @param {any} value 要存儲的數據
   */
  export const saveToStorage = (key, value) => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  };
  
  /**
   * 從 localStorage 中移除數據
   * @param {string} key 存儲鍵
   */
  export const removeFromStorage = (key) => {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  };