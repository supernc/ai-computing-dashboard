/**
 * 模拟数据生成器
 */
const MockData = {
  // 工具函数：在基准值附近波动
  fluctuate(base, range) {
    return base + (Math.random() - 0.5) * 2 * range;
  },

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // 顶部 KPI 数据
  getKPI() {
    const k = CONFIG.kpi;
    return {
      totalFlops: this.fluctuate(k.totalFlops, 5).toFixed(0),
      onlineServers: this.randomInt(k.onlineServers - 10, k.onlineServers + 5),
      gpuCards: this.randomInt(k.gpuCards - 20, k.gpuCards + 10),
      totalRacks: k.totalRacks,
      availableFlops: this.fluctuate(k.availableFlops, 15).toFixed(0),
      pue: this.fluctuate(k.pue, 0.03).toFixed(2),
      annualSaving: this.fluctuate(k.annualSaving, 50).toFixed(0),
      tenants: this.randomInt(k.tenants - 2, k.tenants + 3),
      runningTasks: this.randomInt(k.runningTasks - 100, k.runningTasks + 200)
    };
  },

  // 左上：算力集群分布
  getClusterDistribution() {
    return [
      { name: '训练集群', value: this.randomInt(430, 470) },
      { name: '推理集群', value: this.randomInt(340, 380) },
      { name: '通用计算', value: this.randomInt(190, 220) }
    ];
  },

  // 左上：GPU 资源池
  getGPUPool() {
    return [
      { name: 'A800', total: 2560, used: this.randomInt(2100, 2500) },
      { name: 'H100', total: 3200, used: this.randomInt(2600, 3100) },
      { name: 'B300', total: 1920, used: this.randomInt(1500, 1850) },
      { name: '4090', total: 1280, used: this.randomInt(900, 1200) }
    ];
  },

  // 左上：算力利用率
  getUtilization() {
    return {
      gpu: this.fluctuate(82, 5).toFixed(1),
      cpu: this.fluctuate(68, 6).toFixed(1),
      memory: this.fluctuate(74, 4).toFixed(1),
      storage: this.fluctuate(61, 3).toFixed(1),
      virtualization: this.fluctuate(78, 5).toFixed(1),
      container: this.fluctuate(85, 4).toFixed(1)
    };
  },

  // 右上：政企单位 TOP10
  getTenantRanking() {
    const tenants = [
      { name: '公安局', value: this.randomInt(280, 340) },
      { name: '教育体育局', value: this.randomInt(220, 280) },
      { name: '卫健委', value: this.randomInt(180, 240) },
      { name: '政法委', value: this.randomInt(160, 210) },
      { name: '应急管理局', value: this.randomInt(140, 190) },
      { name: '交通运输局', value: this.randomInt(120, 170) },
      { name: '市场监管局', value: this.randomInt(100, 150) },
      { name: '生态环境局', value: this.randomInt(80, 130) },
      { name: '自然资源局', value: this.randomInt(60, 110) },
      { name: '城市管理局', value: this.randomInt(40, 90) }
    ];
    return tenants.sort((a, b) => b.value - a.value);
  },

  // 右上：任务类型占比
  getTaskTypes() {
    return [
      { name: '大模型训练', value: this.randomInt(32, 38) },
      { name: 'AI 推理', value: this.randomInt(25, 30) },
      { name: '视频解析', value: this.randomInt(15, 20) },
      { name: '科学计算', value: this.randomInt(10, 15) },
      { name: '数据分析', value: this.randomInt(5, 8) }
    ];
  },

  // 右上：项目交付状态
  getProjectStatus() {
    return {
      online: this.randomInt(42, 48),
      building: this.randomInt(12, 18),
      expanding: this.randomInt(5, 9)
    };
  },

  // 右上：费用消耗排行
  getCostRanking() {
    return [
      { name: '公安局', tokens: this.randomInt(12000, 15000), cost: this.randomInt(85, 110) },
      { name: '教育体育局', tokens: this.randomInt(9000, 12000), cost: this.randomInt(65, 85) },
      { name: '卫健委', tokens: this.randomInt(7000, 10000), cost: this.randomInt(50, 70) },
      { name: '政法委', tokens: this.randomInt(5000, 8000), cost: this.randomInt(38, 55) },
      { name: '应急管理局', tokens: this.randomInt(4000, 6000), cost: this.randomInt(28, 42) }
    ];
  },

  // 左下：机柜温湿度
  getCabinetThermal() {
    const data = [];
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 10; col++) {
        data.push([col, row, this.fluctuate(24, 4).toFixed(1)]);
      }
    }
    return data;
  },

  // 左下：配电与环境
  getPowerStatus() {
    return {
      totalPower: this.fluctuate(4800, 100).toFixed(0),
      upsStatus: Math.random() > 0.02 ? '正常' : '告警',
      upsLoad: this.fluctuate(62, 5).toFixed(1),
      coolingStatus: Math.random() > 0.03 ? '正常' : '告警',
      coolingTemp: this.fluctuate(18, 2).toFixed(1)
    };
  },

  // 左下：PUE 历史曲线（24h）
  getPUEHistory() {
    const data = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const t = new Date(now - i * 3600000);
      data.push({
        time: `${String(t.getHours()).padStart(2, '0')}:00`,
        value: this.fluctuate(1.18, 0.06).toFixed(2)
      });
    }
    return data;
  },

  // 左下：服务器状态
  getServerStatus() {
    const total = CONFIG.kpi.onlineServers;
    const fault = this.randomInt(3, 12);
    const warning = this.randomInt(15, 35);
    return {
      online: total - fault - warning,
      warning: warning,
      fault: fault,
      total: total
    };
  },

  // 左下：告警统计
  getAlerts() {
    return {
      red: this.randomInt(0, 3),
      yellow: this.randomInt(5, 15),
      blue: this.randomInt(20, 45)
    };
  },

  // 右下：作业队列
  getJobQueue() {
    return {
      running: this.randomInt(380, 450),
      queued: this.randomInt(120, 200),
      completed: this.randomInt(2800, 3500)
    };
  },

  // 右下：24h 算力负载
  getLoadTrend() {
    const data = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const t = new Date(now - i * 3600000);
      data.push({
        time: `${String(t.getHours()).padStart(2, '0')}:00`,
        gpu: this.fluctuate(82, 12).toFixed(1),
        cpu: this.fluctuate(65, 10).toFixed(1)
      });
    }
    return data;
  },

  // 右下：近 7 日任务完成量
  getWeeklyTasks() {
    const data = [];
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const today = new Date().getDay();
    for (let i = 6; i >= 0; i--) {
      const idx = (today - i + 7) % 7;
      data.push({
        day: days[idx === 0 ? 6 : idx - 1],
        count: this.randomInt(3200, 4800)
      });
    }
    return data;
  },

  // 右下：网络流量
  getNetworkTraffic() {
    return {
      inbound: this.fluctuate(128, 20).toFixed(1),
      outbound: this.fluctuate(96, 15).toFixed(1),
      innerLink: this.fluctuate(340, 30).toFixed(1),
      packets: this.randomInt(850000, 1200000)
    };
  }
};
