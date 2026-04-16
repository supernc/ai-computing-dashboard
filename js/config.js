/**
 * 智算中心大屏 - 全局配置
 */
const CONFIG = {
  // 主色调
  colors: {
    bgDark: '#0A2342',
    bgPanel: 'rgba(10, 35, 66, 0.85)',
    borderPanel: 'rgba(0, 228, 255, 0.15)',
    cyan: '#00E4FF',
    cyanDim: 'rgba(0, 228, 255, 0.6)',
    cyanGlow: 'rgba(0, 228, 255, 0.25)',
    white: '#FFFFFF',
    textPrimary: '#EAEAEA',
    textSecondary: 'rgba(234, 234, 234, 0.65)',
    green: '#00FF88',
    yellow: '#FFD600',
    orange: '#FF8C00',
    red: '#FF4D4D',
    purple: '#A855F7',
    blue: '#3B82F6',
    series: ['#00E4FF', '#00FF88', '#FFD600', '#A855F7', '#3B82F6', '#FF8C00', '#FF4D4D', '#36D7B7']
  },

  // 设计基准
  baseWidth: 1920,
  baseHeight: 1080,

  // 数据刷新间隔（ms）
  refreshInterval: 4000,

  // 智算中心信息
  centerName: '城市智算中心',
  projectName: '国家新一代人工智能公共算力开放创新平台',

  // KPI 基础值
  kpi: {
    totalFlops: 1200,        // PFLOPS
    onlineServers: 2856,
    gpuCards: 8960,
    totalRacks: 420,
    availableFlops: 1080,    // PFLOPS
    pue: 1.18,
    annualSaving: 3200,      // 万度
    tenants: 186,
    runningTasks: 4327
  }
};
