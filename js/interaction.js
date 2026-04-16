/**
 * 交互管理器 - 面板点击弹出详情
 */
const Interaction = {
  init() {
    this.overlay = document.getElementById('modal-overlay');
    this.title = document.getElementById('modal-title');
    this.body = document.getElementById('modal-body');
    this.closeBtn = document.getElementById('modal-close');
    
    if (!this.overlay) return;
    
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
    
    this.bindPanelClicks();
    this.bindChartClicks();
    this.bindKPIClicks();
  },

  open(title, contentHTML) {
    this.title.textContent = title;
    this.body.innerHTML = contentHTML;
    this.overlay.classList.add('active');
  },

  close() {
    this.overlay.classList.remove('active');
  },

  // KPI 卡片点击
  bindKPIClicks() {
    const kpiMap = {
      'kpi-flops': { title: '总算力详情', gen: () => this.genKPIDetail('totalFlops', 'PFLOPS', '总算力代表智算中心全部GPU/CPU可提供的浮点运算能力总和。') },
      'kpi-servers': { title: '服务器详情', gen: () => this.genServerDetail() },
      'kpi-gpus': { title: 'GPU 卡详情', gen: () => this.genGPUDetail() },
      'kpi-racks': { title: '机架详情', gen: () => this.genRackDetail() },
      'kpi-available': { title: '可用算力详情', gen: () => this.genKPIDetail('availableFlops', 'PFLOPS', '当前可调度分配的空闲算力资源。') },
      'kpi-pue': { title: 'PUE 能效详情', gen: () => this.genPUEDetail() },
      'kpi-saving': { title: '节电详情', gen: () => this.genSavingDetail() },
      'kpi-tenants': { title: '租户详情', gen: () => this.genTenantDetail() },
      'kpi-tasks': { title: '运行任务详情', gen: () => this.genTaskDetail() }
    };
    
    Object.entries(kpiMap).forEach(([id, cfg]) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => this.open(cfg.title, cfg.gen()));
      }
    });
  },

  // 面板标题点击
  bindPanelClicks() {
    const panels = {
      'panel-lt': { title: '算力资源总览 · 详细数据', gen: () => this.genLeftTopDetail() },
      'panel-rt': { title: '业务与租户排行 · 详细数据', gen: () => this.genRightTopDetail() },
      'panel-lb': { title: '机房动环与硬件健康 · 详细数据', gen: () => this.genLeftBottomDetail() },
      'panel-rb': { title: '任务调度与趋势 · 详细数据', gen: () => this.genRightBottomDetail() }
    };

    Object.entries(panels).forEach(([id, cfg]) => {
      const el = document.getElementById(id);
      if (el) {
        const titleEl = el.querySelector('.panel-title');
        if (titleEl) {
          titleEl.style.cursor = 'pointer';
          titleEl.addEventListener('click', () => this.open(cfg.title, cfg.gen()));
        }
      }
    });
  },

  // 图表点击事件
  bindChartClicks() {
    // 给 ECharts 实例绑定点击
    setTimeout(() => {
      if (typeof chartCluster !== 'undefined' && chartCluster) {
        chartCluster.on('click', (params) => {
          this.open(`${params.name} · 集群详情`, this.genClusterClickDetail(params.name, params.value));
        });
      }
      if (typeof chartTenantBar !== 'undefined' && chartTenantBar) {
        chartTenantBar.on('click', (params) => {
          this.open(`${params.name} · 算力使用详情`, this.genTenantClickDetail(params.name, params.value));
        });
      }
      if (typeof chartTaskPie !== 'undefined' && chartTaskPie) {
        chartTaskPie.on('click', (params) => {
          this.open(`${params.name} · 任务详情`, this.genTaskTypeClickDetail(params.name, params.value));
        });
      }
    }, 1000);
  },

  // ===== 详情内容生成 =====
  
  _s(label, value, unit='') {
    return `<div class="detail-row"><span class="detail-label">${label}</span><span class="detail-value">${value}<small>${unit}</small></span></div>`;
  },

  _table(headers, rows) {
    let html = '<table class="detail-table"><thead><tr>';
    headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead><tbody>';
    rows.forEach(row => {
      html += '<tr>';
      row.forEach(cell => html += `<td>${cell}</td>`);
      html += '</tr>';
    });
    html += '</tbody></table>';
    return html;
  },

  genKPIDetail(key, unit, desc) {
    const kpi = MockData.getKPI();
    return `<p class="detail-desc">${desc}</p>` + this._s('当前值', kpi[key] || CONFIG.kpi[key], ` ${unit}`) +
      this._s('日均值', (CONFIG.kpi[key] * 0.95).toFixed(0), ` ${unit}`) +
      this._s('峰值', (CONFIG.kpi[key] * 1.05).toFixed(0), ` ${unit}`) +
      this._s('数据更新时间', new Date().toLocaleString());
  },

  genServerDetail() {
    const s = MockData.getServerStatus();
    return `<p class="detail-desc">服务器集群运行状态概览</p>` +
      this._s('在线服务器', s.online, ' 台') +
      this._s('告警服务器', s.warning, ' 台') +
      this._s('故障服务器', s.fault, ' 台') +
      this._s('总计', s.total, ' 台') +
      this._table(['型号', '数量', '状态'], [
        ['H3C UniServer R5300 G6', '960', '正常'],
        ['华为 FusionServer Pro 2288H V7', '820', '正常'],
        ['浪潮 NF5488A6', '640', '正常'],
        ['超聚变 FusionServer 2488H V6', '436', '2台告警']
      ]);
  },

  genGPUDetail() {
    const gpu = MockData.getGPUPool();
    return `<p class="detail-desc">GPU 资源池使用明细</p>` +
      this._table(['GPU 型号', '总量', '已用', '空闲', '占用率'],
        gpu.map(g => [g.name, g.total, g.used, g.total - g.used, (g.used/g.total*100).toFixed(1) + '%'])
      );
  },

  genRackDetail() {
    return `<p class="detail-desc">机柜布局与使用状态</p>` +
      this._s('总机架数', CONFIG.kpi.totalRacks, ' 个') +
      this._s('已部署', MockData.randomInt(380, 400), ' 个') +
      this._s('预留扩容', MockData.randomInt(15, 30), ' 个') +
      this._s('空闲', MockData.randomInt(5, 15), ' 个') +
      this._table(['机房区域', '机架数', '用电(kW)', '温度(°C)'], [
        ['A区-训练集群', '120', '1,850', '23.5'],
        ['B区-训练集群', '100', '1,620', '24.1'],
        ['C区-推理集群', '90', '1,180', '22.8'],
        ['D区-通用计算', '60', '680', '22.3'],
        ['E区-存储/网络', '50', '470', '21.9']
      ]);
  },

  genPUEDetail() {
    const pueHist = MockData.getPUEHistory();
    const avg = (pueHist.reduce((s,d) => s + parseFloat(d.value), 0) / pueHist.length).toFixed(3);
    return `<p class="detail-desc">PUE（电能利用效率）反映数据中心能效水平，越接近 1.0 越节能。</p>` +
      this._s('当前 PUE', MockData.getKPI().pue) +
      this._s('24h 平均', avg) +
      this._s('行业先进水平', '≤ 1.25') +
      this._s('设计目标', '1.15') +
      this._s('制冷方式', '液冷 + 间接蒸发') +
      this._s('年节电当量', CONFIG.kpi.annualSaving + ' 万度');
  },

  genSavingDetail() {
    return `<p class="detail-desc">通过先进液冷技术和智能温控系统实现的节能效果。</p>` +
      this._s('年均节电', CONFIG.kpi.annualSaving, ' 万度') +
      this._s('等效减碳', (CONFIG.kpi.annualSaving * 0.785).toFixed(0), ' 吨 CO₂') +
      this._s('节省电费', (CONFIG.kpi.annualSaving * 0.65).toFixed(0), ' 万元') +
      this._s('核心技术', '冷板式液冷 + AI 智能温控');
  },

  genTenantDetail() {
    const tenants = MockData.getTenantRanking();
    return `<p class="detail-desc">接入智算中心的政企单位列表（按算力使用量排序）</p>` +
      this._table(['排名', '单位名称', '算力使用(TFLOPS)', '接入时间'],
        tenants.map((t, i) => [i + 1, t.name, t.value, `2024-${String(MockData.randomInt(1,12)).padStart(2,'0')}`])
      );
  },

  genTaskDetail() {
    const q = MockData.getJobQueue();
    return `<p class="detail-desc">实时作业调度状态</p>` +
      this._s('运行中', q.running, ' 个') +
      this._s('排队中', q.queued, ' 个') +
      this._s('今日完成', q.completed.toLocaleString(), ' 个') +
      this._s('平均排队时间', MockData.randomInt(3, 15) + ' 分钟') +
      this._s('平均运行时长', MockData.randomInt(20, 120) + ' 分钟');
  },

  genLeftTopDetail() {
    const util = MockData.getUtilization();
    const gpu = MockData.getGPUPool();
    return `<p class="detail-desc">算力资源全景视图</p>` +
      this._s('GPU 利用率', util.gpu, '%') + this._s('CPU 利用率', util.cpu, '%') +
      this._s('内存利用率', util.memory, '%') + this._s('存储利用率', util.storage, '%') +
      this._s('虚拟化配额', util.virtualization, '%') + this._s('容器配额', util.container, '%') +
      '<div style="margin-top:12px"></div>' +
      this._table(['GPU', '总量', '使用', '占用率'], gpu.map(g => [g.name, g.total, g.used, (g.used/g.total*100).toFixed(1)+'%']));
  },

  genRightTopDetail() {
    const tenants = MockData.getTenantRanking();
    const costs = MockData.getCostRanking();
    const status = MockData.getProjectStatus();
    return `<p class="detail-desc">业务运营全景</p>` +
      this._s('已上线项目', status.online, ' 个') + this._s('在建项目', status.building, ' 个') + this._s('扩容项目', status.expanding, ' 个') +
      '<div style="margin-top:12px"></div>' +
      this._table(['单位', '算力(TFLOPS)', '费用(万元)'],
        tenants.slice(0, 5).map((t, i) => [t.name, t.value, costs[i] ? costs[i].cost : '-'])
      );
  },

  genLeftBottomDetail() {
    const power = MockData.getPowerStatus();
    const server = MockData.getServerStatus();
    const alerts = MockData.getAlerts();
    return `<p class="detail-desc">机房基础设施与环境监控</p>` +
      this._s('总功率', power.totalPower, ' kW') + this._s('UPS 状态', power.upsStatus) +
      this._s('UPS 负载', power.upsLoad, '%') + this._s('冷却系统', power.coolingStatus) +
      this._s('服务器在线', server.online, ' 台') + this._s('故障', server.fault, ' 台') +
      this._s('红色告警', alerts.red, ' 条') + this._s('黄色告警', alerts.yellow, ' 条') + this._s('蓝色告警', alerts.blue, ' 条');
  },

  genRightBottomDetail() {
    const q = MockData.getJobQueue();
    const net = MockData.getNetworkTraffic();
    return `<p class="detail-desc">任务调度与网络概览</p>` +
      this._s('运行中任务', q.running, ' 个') + this._s('排队任务', q.queued, ' 个') +
      this._s('今日完成', q.completed.toLocaleString(), ' 个') +
      this._s('入站流量', net.inbound, ' Gbps') + this._s('出站流量', net.outbound, ' Gbps') +
      this._s('内网流量', net.innerLink, ' Gbps');
  },

  genClusterClickDetail(name, value) {
    const desc = { '训练集群': '用于大模型预训练和微调', '推理集群': '用于 AI 推理服务部署', '通用计算': '用于科学计算、数据处理等通用任务' };
    return `<p class="detail-desc">${desc[name] || ''}</p>` +
      this._s('集群名称', name) + this._s('算力规模', value, ' PFLOPS') +
      this._s('GPU 卡数', MockData.randomInt(1500, 3500), ' 张') +
      this._s('利用率', MockData.randomInt(70, 95), '%');
  },

  genTenantClickDetail(name, value) {
    const types = ['大模型训练', 'AI 推理', '视频解析', '数据分析'];
    return `<p class="detail-desc">${name} 的算力使用详情</p>` +
      this._s('算力使用', value, ' TFLOPS') +
      this._s('主要任务', types[MockData.randomInt(0, types.length - 1)]) +
      this._s('GPU 占用', MockData.randomInt(50, 300), ' 张') +
      this._s('运行任务数', MockData.randomInt(20, 200), ' 个') +
      this._s('接入时间', '2024-0' + MockData.randomInt(1, 9));
  },

  genTaskTypeClickDetail(name, value) {
    return `<p class="detail-desc">${name}任务运行统计</p>` +
      this._s('任务类型', name) + this._s('占比', value, '%') +
      this._s('运行中', MockData.randomInt(50, 200), ' 个') +
      this._s('今日完成', MockData.randomInt(300, 1200), ' 个') +
      this._s('平均 GPU 占用', MockData.randomInt(2, 16), ' 张/任务');
  }
};
