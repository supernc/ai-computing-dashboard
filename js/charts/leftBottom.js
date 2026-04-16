/**
 * 左下：机房动环与硬件健康
 */
let chartHeatmap, chartPUE;

function initLeftBottom() {
  chartHeatmap = echarts.init(document.getElementById('chart-heatmap'));
  chartPUE = echarts.init(document.getElementById('chart-pue'));
  updateLeftBottom();
}

function updateLeftBottom() {
  // 机柜温湿度云图
  const thermalData = MockData.getCabinetThermal();
  chartHeatmap.setOption({
    tooltip: {
      backgroundColor: 'rgba(10,35,66,0.9)',
      borderColor: CONFIG.colors.borderPanel,
      textStyle: { color: CONFIG.colors.textPrimary, fontSize: 12 },
      formatter: p => `机柜 ${String.fromCharCode(65 + p.data[1])}${p.data[0] + 1}<br/>温度: ${p.data[2]}°C`
    },
    grid: { left: 30, right: 15, top: 5, bottom: 20 },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 10 }, (_, i) => `${i + 1}列`),
      axisLabel: { color: CONFIG.colors.textSecondary, fontSize: 9 },
      axisLine: { show: false }, axisTick: { show: false },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'category',
      data: ['A排', 'B排', 'C排', 'D排', 'E排', 'F排'],
      axisLabel: { color: CONFIG.colors.textSecondary, fontSize: 9 },
      axisLine: { show: false }, axisTick: { show: false },
      splitLine: { show: false }
    },
    visualMap: {
      min: 18, max: 32,
      calculable: false,
      orient: 'horizontal',
      bottom: 0,
      right: 0,
      itemWidth: 8,
      itemHeight: 60,
      textStyle: { color: CONFIG.colors.textSecondary, fontSize: 9 },
      inRange: {
        color: ['#0A2342', '#00457a', '#006d8f', '#00E4FF', '#FFD600', '#FF4D4D']
      },
      show: false
    },
    series: [{
      type: 'heatmap',
      data: thermalData,
      itemStyle: { borderColor: CONFIG.colors.bgDark, borderWidth: 2, borderRadius: 2 },
      emphasis: {
        itemStyle: { shadowBlur: 6, shadowColor: CONFIG.colors.cyanGlow }
      }
    }]
  });

  // PUE 实时曲线
  const pueData = MockData.getPUEHistory();
  chartPUE.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10,35,66,0.9)',
      borderColor: CONFIG.colors.borderPanel,
      textStyle: { color: CONFIG.colors.textPrimary, fontSize: 12 }
    },
    grid: { left: 38, right: 10, top: 10, bottom: 22 },
    xAxis: {
      type: 'category',
      data: pueData.map(d => d.time),
      axisLabel: {
        color: CONFIG.colors.textSecondary, fontSize: 9,
        interval: 5
      },
      axisLine: { lineStyle: { color: 'rgba(0,228,255,0.15)' } },
      axisTick: { show: false },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      min: 1.05, max: 1.35,
      splitNumber: 3,
      axisLabel: { color: CONFIG.colors.textSecondary, fontSize: 9 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(0,228,255,0.08)' } }
    },
    series: [{
      type: 'line',
      data: pueData.map(d => parseFloat(d.value)),
      smooth: true,
      symbol: 'none',
      lineStyle: { color: CONFIG.colors.green, width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: CONFIG.colors.green + '33' },
          { offset: 1, color: CONFIG.colors.green + '05' }
        ])
      },
      markLine: {
        silent: true,
        data: [{ yAxis: 1.2, label: { formatter: '目标 1.2', fontSize: 9, color: CONFIG.colors.yellow }, lineStyle: { color: CONFIG.colors.yellow, type: 'dashed', width: 1 } }]
      }
    }]
  });

  // 配电与环境状态
  const power = MockData.getPowerStatus();
  const pwrEl = document.getElementById('power-status');
  if (pwrEl) {
    pwrEl.innerHTML = `
      <div class="env-row">
        <div class="env-item">
          <span class="env-label">总功率</span>
          <span class="env-value">${power.totalPower}<small> kW</small></span>
        </div>
        <div class="env-item">
          <span class="env-label">UPS 状态</span>
          <span class="env-value ${power.upsStatus === '正常' ? 'ok' : 'warn'}">${power.upsStatus}</span>
        </div>
      </div>
      <div class="env-row">
        <div class="env-item">
          <span class="env-label">UPS 负载</span>
          <span class="env-value">${power.upsLoad}<small>%</small></span>
        </div>
        <div class="env-item">
          <span class="env-label">冷却系统</span>
          <span class="env-value ${power.coolingStatus === '正常' ? 'ok' : 'warn'}">${power.coolingStatus}</span>
        </div>
      </div>
    `;
  }

  // 服务器状态
  const server = MockData.getServerStatus();
  const svrEl = document.getElementById('server-status');
  if (svrEl) {
    svrEl.innerHTML = `
      <div class="srv-bar">
        <div class="srv-seg online" style="width:${server.online/server.total*100}%"></div>
        <div class="srv-seg warning" style="width:${server.warning/server.total*100}%"></div>
        <div class="srv-seg fault" style="width:${server.fault/server.total*100}%"></div>
      </div>
      <div class="srv-legend">
        <span class="srv-tag online">在线 ${server.online}</span>
        <span class="srv-tag warning">告警 ${server.warning}</span>
        <span class="srv-tag fault">故障 ${server.fault}</span>
      </div>
    `;
  }

  // 告警统计
  const alerts = MockData.getAlerts();
  const alertEl = document.getElementById('alert-status');
  if (alertEl) {
    alertEl.innerHTML = `
      <div class="alert-badge red"><span class="alert-count">${alerts.red}</span><span class="alert-label">红色</span></div>
      <div class="alert-badge yellow"><span class="alert-count">${alerts.yellow}</span><span class="alert-label">黄色</span></div>
      <div class="alert-badge blue"><span class="alert-count">${alerts.blue}</span><span class="alert-label">蓝色</span></div>
    `;
  }
}
