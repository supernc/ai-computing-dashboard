/**
 * 顶部通栏：总览驾驶舱
 */
function initHeader() {
  updateHeader();
}

function updateHeader() {
  const data = MockData.getKPI();
  const items = [
    { id: 'kpi-flops', value: data.totalFlops, unit: 'PFLOPS', label: '总算力' },
    { id: 'kpi-servers', value: data.onlineServers.toLocaleString(), unit: '台', label: '在线服务器' },
    { id: 'kpi-gpus', value: data.gpuCards.toLocaleString(), unit: '张', label: 'GPU 卡数' },
    { id: 'kpi-racks', value: data.totalRacks, unit: '个', label: '总机架数' },
    { id: 'kpi-available', value: data.availableFlops, unit: 'PFLOPS', label: '可用算力' },
    { id: 'kpi-pue', value: data.pue, unit: '', label: 'PUE 值' },
    { id: 'kpi-saving', value: data.annualSaving, unit: '万度', label: '年均节电' },
    { id: 'kpi-tenants', value: data.tenants, unit: '家', label: '租户接入' },
    { id: 'kpi-tasks', value: data.runningTasks.toLocaleString(), unit: '个', label: '运行任务' }
  ];

  items.forEach(item => {
    const el = document.getElementById(item.id);
    if (el) {
      const valEl = el.querySelector('.kpi-value');
      const numEl = valEl.querySelector('.kpi-num');
      const unitEl = valEl.querySelector('.kpi-unit');
      if (numEl) numEl.textContent = item.value;
      if (unitEl) unitEl.textContent = item.unit;
    }
  });
}
