/**
 * 左上：算力资源总览
 */
let chartCluster, chartGPUBar, chartUtilRing;

function initLeftTop() {
  chartCluster = echarts.init(document.getElementById('chart-cluster'));
  chartGPUBar = echarts.init(document.getElementById('chart-gpu-bar'));
  chartUtilRing = echarts.init(document.getElementById('chart-util-ring'));
  updateLeftTop();
}

function updateLeftTop() {
  // 算力集群分布 - 饼图
  const clusterData = MockData.getClusterDistribution();
  chartCluster.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10,35,66,0.9)',
      borderColor: CONFIG.colors.borderPanel,
      textStyle: { color: CONFIG.colors.textPrimary, fontSize: 12 }
    },
    legend: {
      bottom: 0,
      textStyle: { color: CONFIG.colors.textSecondary, fontSize: 11 },
      itemWidth: 10, itemHeight: 10
    },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '42%'],
      avoidLabelOverlap: true,
      label: {
        show: true,
        formatter: '{c} PFLOPS',
        fontSize: 10,
        color: CONFIG.colors.textSecondary
      },
      labelLine: { length: 8, length2: 6 },
      itemStyle: { borderColor: CONFIG.colors.bgDark, borderWidth: 2 },
      data: clusterData.map((d, i) => ({
        ...d,
        itemStyle: { color: CONFIG.colors.series[i] }
      }))
    }]
  });

  // GPU 资源池 - 条形进度
  const gpuData = MockData.getGPUPool();
  chartGPUBar.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10,35,66,0.9)',
      borderColor: CONFIG.colors.borderPanel,
      textStyle: { color: CONFIG.colors.textPrimary, fontSize: 12 },
      formatter: params => {
        const d = gpuData[params[0].dataIndex];
        return `${d.name}<br/>使用: ${d.used} / ${d.total}<br/>占用率: ${(d.used/d.total*100).toFixed(1)}%`;
      }
    },
    grid: { left: 55, right: 50, top: 5, bottom: 5 },
    xAxis: {
      type: 'value', max: 100,
      axisLabel: { show: false },
      splitLine: { show: false },
      axisLine: { show: false }
    },
    yAxis: {
      type: 'category',
      data: gpuData.map(d => d.name),
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: CONFIG.colors.textSecondary, fontSize: 11 }
    },
    series: [{
      type: 'bar',
      barWidth: 12,
      data: gpuData.map((d, i) => ({
        value: (d.used / d.total * 100).toFixed(1),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: CONFIG.colors.series[i] },
            { offset: 1, color: CONFIG.colors.series[i] + '66' }
          ]),
          borderRadius: [0, 6, 6, 0]
        },
        label: {
          show: true,
          position: 'right',
          formatter: `${d.used}/${d.total}`,
          color: CONFIG.colors.textSecondary,
          fontSize: 10
        }
      })),
      backgroundStyle: {
        color: 'rgba(0,228,255,0.06)',
        borderRadius: [0, 6, 6, 0]
      },
      showBackground: true
    }]
  });

  // 算力利用率 - 环形仪表
  const util = MockData.getUtilization();
  const utilItems = [
    { name: 'GPU', value: parseFloat(util.gpu) },
    { name: 'CPU', value: parseFloat(util.cpu) },
    { name: '内存', value: parseFloat(util.memory) },
    { name: '存储', value: parseFloat(util.storage) }
  ];

  chartUtilRing.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10,35,66,0.9)',
      borderColor: CONFIG.colors.borderPanel,
      textStyle: { color: CONFIG.colors.textPrimary, fontSize: 12 }
    },
    series: utilItems.map((item, i) => {
      const radius = 72 - i * 16;
      const color = CONFIG.colors.series[i];
      return {
        type: 'pie',
        radius: [`${radius - 6}%`, `${radius}%`],
        center: ['50%', '50%'],
        startAngle: 90,
        silent: false,
        label: { show: false },
        data: [
          {
            value: item.value,
            name: item.name,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: color },
                { offset: 1, color: color + '88' }
              ])
            }
          },
          {
            value: 100 - item.value,
            name: '',
            itemStyle: { color: 'rgba(0,228,255,0.06)' },
            tooltip: { show: false }
          }
        ]
      };
    }),
    graphic: {
      type: 'group',
      left: 'center',
      top: 'middle',
      children: [{
        type: 'text',
        style: {
          text: util.gpu + '%',
          fontSize: 16,
          fontWeight: 'bold',
          fill: CONFIG.colors.cyan,
          textAlign: 'center'
        },
        left: 'center',
        top: -10
      }, {
        type: 'text',
        style: {
          text: 'GPU利用率',
          fontSize: 10,
          fill: CONFIG.colors.textSecondary,
          textAlign: 'center'
        },
        left: 'center',
        top: 10
      }]
    }
  });

  // 虚拟化/容器配额
  const vEl = document.getElementById('quota-virtual');
  const cEl = document.getElementById('quota-container');
  if (vEl) {
    vEl.querySelector('.quota-bar-fill').style.width = util.virtualization + '%';
    vEl.querySelector('.quota-val').textContent = util.virtualization + '%';
  }
  if (cEl) {
    cEl.querySelector('.quota-bar-fill').style.width = util.container + '%';
    cEl.querySelector('.quota-val').textContent = util.container + '%';
  }
}
