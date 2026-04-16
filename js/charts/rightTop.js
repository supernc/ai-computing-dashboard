/**
 * 右上：业务与租户排行
 */
let chartTenantBar, chartTaskPie;

function initRightTop() {
  chartTenantBar = echarts.init(document.getElementById('chart-tenant-rank'));
  chartTaskPie = echarts.init(document.getElementById('chart-task-type'));
  updateRightTop();
}

function updateRightTop() {
  // 政企单位 TOP10
  const tenants = MockData.getTenantRanking();
  const maxVal = tenants[0].value;

  chartTenantBar.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10,35,66,0.9)',
      borderColor: CONFIG.colors.borderPanel,
      textStyle: { color: CONFIG.colors.textPrimary, fontSize: 12 },
      formatter: p => `${p[0].name}: ${p[0].value} TFLOPS`
    },
    grid: { left: 85, right: 45, top: 5, bottom: 5 },
    xAxis: {
      type: 'value',
      axisLabel: { show: false },
      splitLine: { show: false },
      axisLine: { show: false }
    },
    yAxis: {
      type: 'category',
      data: tenants.map(d => d.name),
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: (val, idx) => idx < 3 ? CONFIG.colors.cyan : CONFIG.colors.textSecondary,
        fontSize: 11,
        fontWeight: (val, idx) => idx < 3 ? 'bold' : 'normal'
      }
    },
    series: [{
      type: 'bar',
      barWidth: 10,
      data: tenants.map((d, i) => ({
        value: d.value,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: i < 3 ? CONFIG.colors.cyan : CONFIG.colors.blue },
            { offset: 1, color: i < 3 ? CONFIG.colors.cyan + '33' : CONFIG.colors.blue + '33' }
          ]),
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c}',
          color: CONFIG.colors.textSecondary,
          fontSize: 10
        }
      })),
      showBackground: true,
      backgroundStyle: { color: 'rgba(0,228,255,0.04)', borderRadius: [0, 4, 4, 0] }
    }]
  });

  // 任务类型占比
  const taskTypes = MockData.getTaskTypes();
  chartTaskPie.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10,35,66,0.9)',
      borderColor: CONFIG.colors.borderPanel,
      textStyle: { color: CONFIG.colors.textPrimary, fontSize: 12 },
      formatter: p => `${p.name}: ${p.value}%`
    },
    legend: {
      orient: 'vertical',
      right: 5,
      top: 'center',
      textStyle: { color: CONFIG.colors.textSecondary, fontSize: 10 },
      itemWidth: 8, itemHeight: 8
    },
    series: [{
      type: 'pie',
      radius: ['35%', '60%'],
      center: ['35%', '50%'],
      roseType: 'radius',
      label: { show: false },
      itemStyle: { borderColor: CONFIG.colors.bgDark, borderWidth: 2 },
      data: taskTypes.map((d, i) => ({
        ...d,
        itemStyle: { color: CONFIG.colors.series[i] }
      }))
    }]
  });

  // 费用消耗排行
  const costs = MockData.getCostRanking();
  const costListEl = document.getElementById('cost-ranking-list');
  if (costListEl) {
    costListEl.innerHTML = costs.map((c, i) => `
      <div class="cost-item">
        <span class="cost-rank ${i < 3 ? 'top3' : ''}">${i + 1}</span>
        <span class="cost-name">${c.name}</span>
        <span class="cost-tokens">${(c.tokens / 1000).toFixed(1)}K tokens</span>
        <span class="cost-amount">${c.cost}万</span>
      </div>
    `).join('');
  }

  // 项目交付状态
  const status = MockData.getProjectStatus();
  const statusEl = document.getElementById('project-status');
  if (statusEl) {
    statusEl.innerHTML = `
      <div class="status-item online"><span class="status-dot"></span>已上线 <strong>${status.online}</strong></div>
      <div class="status-item building"><span class="status-dot"></span>在建 <strong>${status.building}</strong></div>
      <div class="status-item expanding"><span class="status-dot"></span>扩容中 <strong>${status.expanding}</strong></div>
    `;
  }
}
