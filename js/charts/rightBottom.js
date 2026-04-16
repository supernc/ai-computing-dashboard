/**
 * 右下：任务调度与趋势
 */
let chartLoadTrend, chartWeekly;

function initRightBottom() {
  chartLoadTrend = echarts.init(document.getElementById('chart-load-trend'));
  chartWeekly = echarts.init(document.getElementById('chart-weekly'));
  updateRightBottom();
}

function updateRightBottom() {
  // 作业队列
  const queue = MockData.getJobQueue();
  const queueEl = document.getElementById('job-queue');
  if (queueEl) {
    const total = queue.running + queue.queued + queue.completed;
    queueEl.innerHTML = `
      <div class="queue-cards">
        <div class="queue-card running">
          <div class="queue-num">${queue.running}</div>
          <div class="queue-label">运行中</div>
        </div>
        <div class="queue-card queued">
          <div class="queue-num">${queue.queued}</div>
          <div class="queue-label">排队中</div>
        </div>
        <div class="queue-card completed">
          <div class="queue-num">${queue.completed.toLocaleString()}</div>
          <div class="queue-label">已完成</div>
        </div>
      </div>
    `;
  }

  // 24h 算力负载趋势
  const loadData = MockData.getLoadTrend();
  chartLoadTrend.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10,35,66,0.9)',
      borderColor: CONFIG.colors.borderPanel,
      textStyle: { color: CONFIG.colors.textPrimary, fontSize: 12 }
    },
    legend: {
      right: 5, top: 0,
      textStyle: { color: CONFIG.colors.textSecondary, fontSize: 10 },
      itemWidth: 12, itemHeight: 3
    },
    grid: { left: 35, right: 10, top: 25, bottom: 22 },
    xAxis: {
      type: 'category',
      data: loadData.map(d => d.time),
      axisLabel: { color: CONFIG.colors.textSecondary, fontSize: 9, interval: 5 },
      axisLine: { lineStyle: { color: 'rgba(0,228,255,0.15)' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      min: 0, max: 100,
      splitNumber: 4,
      axisLabel: { color: CONFIG.colors.textSecondary, fontSize: 9, formatter: '{value}%' },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(0,228,255,0.08)' } }
    },
    series: [
      {
        name: 'GPU',
        type: 'line',
        data: loadData.map(d => parseFloat(d.gpu)),
        smooth: true,
        symbol: 'none',
        lineStyle: { color: CONFIG.colors.cyan, width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: CONFIG.colors.cyan + '33' },
            { offset: 1, color: CONFIG.colors.cyan + '05' }
          ])
        }
      },
      {
        name: 'CPU',
        type: 'line',
        data: loadData.map(d => parseFloat(d.cpu)),
        smooth: true,
        symbol: 'none',
        lineStyle: { color: CONFIG.colors.purple, width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: CONFIG.colors.purple + '33' },
            { offset: 1, color: CONFIG.colors.purple + '05' }
          ])
        }
      }
    ]
  });

  // 近 7 日任务完成量
  const weeklyData = MockData.getWeeklyTasks();
  chartWeekly.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10,35,66,0.9)',
      borderColor: CONFIG.colors.borderPanel,
      textStyle: { color: CONFIG.colors.textPrimary, fontSize: 12 }
    },
    grid: { left: 45, right: 10, top: 10, bottom: 22 },
    xAxis: {
      type: 'category',
      data: weeklyData.map(d => d.day),
      axisLabel: { color: CONFIG.colors.textSecondary, fontSize: 10 },
      axisLine: { lineStyle: { color: 'rgba(0,228,255,0.15)' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: CONFIG.colors.textSecondary, fontSize: 9 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(0,228,255,0.08)' } }
    },
    series: [{
      type: 'bar',
      data: weeklyData.map((d, i) => ({
        value: d.count,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: CONFIG.colors.cyan },
            { offset: 1, color: CONFIG.colors.cyan + '22' }
          ]),
          borderRadius: [3, 3, 0, 0]
        }
      })),
      barWidth: 20
    }]
  });

  // 网络流量
  const net = MockData.getNetworkTraffic();
  const netEl = document.getElementById('network-traffic');
  if (netEl) {
    netEl.innerHTML = `
      <div class="net-grid">
        <div class="net-item">
          <svg viewBox="0 0 24 24" width="14" height="14"><path fill="${CONFIG.colors.green}" d="M7 14l5-5 5 5z"/></svg>
          <span class="net-label">入站</span>
          <span class="net-value">${net.inbound} <small>Gbps</small></span>
        </div>
        <div class="net-item">
          <svg viewBox="0 0 24 24" width="14" height="14"><path fill="${CONFIG.colors.orange}" d="M7 10l5 5 5-5z"/></svg>
          <span class="net-label">出站</span>
          <span class="net-value">${net.outbound} <small>Gbps</small></span>
        </div>
        <div class="net-item">
          <svg viewBox="0 0 24 24" width="14" height="14"><circle fill="${CONFIG.colors.cyan}" cx="12" cy="12" r="5"/></svg>
          <span class="net-label">内网</span>
          <span class="net-value">${net.innerLink} <small>Gbps</small></span>
        </div>
        <div class="net-item">
          <svg viewBox="0 0 24 24" width="14" height="14"><rect fill="${CONFIG.colors.purple}" x="4" y="4" width="16" height="16" rx="3"/></svg>
          <span class="net-label">包量</span>
          <span class="net-value">${(net.packets/10000).toFixed(1)} <small>万/s</small></span>
        </div>
      </div>
    `;
  }
}
