import { supabase } from '../supabase.js'
import { adminLogout, checkAdminSession } from '../utils/admin-auth.js'
import { navigate } from '../router.js'
import { renderPieChart, CHART_COLORS } from '../utils/pie-chart.js'
import { exportTableToCSV } from '../utils/csv-export.js'
import { questions } from '../logic/questions.js'
import logoImg from '../assets/logo-light.png'

/** Per-page row count */
const PAGE_SIZE = 15

export default function renderAdminDashboard() {
  const container = document.createElement('div')
  container.className = 'admin-page'

  container.innerHTML = `
    <!-- Sidebar -->
    <aside class="admin-sidebar" id="admin-sidebar">
      <div class="admin-sidebar-logo">
        <img src="${logoImg}" alt="Supera | Mente Ativa" class="admin-sidebar-logo-img" />
        <span class="admin-sidebar-title text-white">Admin</span>
      </div>
      <nav class="admin-sidebar-nav">
        <a class="admin-nav-item active">
          <span class="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </a>
        <a class="admin-nav-item" id="nav-export-csv-sidebar">
          <span class="material-symbols-outlined">download</span>
          <span>Exportar CSV</span>
        </a>
        <a class="admin-nav-item" id="nav-goto-quiz">
          <span class="material-symbols-outlined">quiz</span>
          <span>Ir ao Quiz</span>
        </a>
        <a class="admin-nav-item" id="nav-goto-site">
          <span class="material-symbols-outlined">home</span>
          <span>Voltar ao Site</span>
        </a>
        <div style="flex:1"></div>
        <a class="admin-nav-item" id="nav-logout">
          <span class="material-symbols-outlined">logout</span>
          <span>Sair</span>
        </a>
      </nav>
      <div class="admin-sidebar-footer" id="admin-user-info">
        <span class="material-symbols-outlined">account_circle</span>
        <span class="admin-user-email">carregando...</span>
      </div>
    </aside>

    <!-- Main content -->
    <main class="admin-main">
      <!-- Top bar (mobile) -->
      <div class="admin-topbar">
        <button id="sidebar-toggle" class="admin-topbar-btn">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <h1 class="admin-topbar-title">Dashboard</h1>
        <button id="topbar-logout" class="admin-topbar-btn">
          <span class="material-symbols-outlined">logout</span>
        </button>
      </div>

      <!-- Loading state -->
      <div id="admin-loading" class="admin-loading">
        <span class="admin-spinner-lg"></span>
        <p>Carregando dados...</p>
      </div>

      <!-- Content wrapper -->
      <div id="admin-content" class="admin-content admin-hidden">
        <!-- KPI Cards -->
        <section class="admin-kpi-grid">
          <div class="admin-kpi-card">
            <div class="admin-kpi-icon" style="background: rgba(234,91,12,0.12); color: #EA5B0C;">
              <span class="material-symbols-outlined">group</span>
            </div>
            <div class="admin-kpi-data">
              <span class="admin-kpi-value" id="kpi-total">0</span>
              <span class="admin-kpi-label">Participantes</span>
            </div>
          </div>
          <div class="admin-kpi-card">
            <div class="admin-kpi-icon" style="background: rgba(89,28,11,0.12); color: #591C0B;">
              <span class="material-symbols-outlined">speed</span>
            </div>
            <div class="admin-kpi-data">
              <span class="admin-kpi-value" id="kpi-avg-score">0%</span>
              <span class="admin-kpi-label">Score Médio</span>
            </div>
          </div>
          <div class="admin-kpi-card">
            <div class="admin-kpi-icon" style="background: rgba(45,139,117,0.12); color: #2D8B75;">
              <span class="material-symbols-outlined">neurology</span>
            </div>
            <div class="admin-kpi-data">
              <span class="admin-kpi-value" id="kpi-neurocovid">0</span>
              <span class="admin-kpi-label">Fator Neuro-Covid</span>
            </div>
          </div>
          <div class="admin-kpi-card">
            <div class="admin-kpi-icon" style="background: rgba(74,144,217,0.12); color: #4A90D9;">
              <span class="material-symbols-outlined">today</span>
            </div>
            <div class="admin-kpi-data">
              <span class="admin-kpi-value" id="kpi-today">0</span>
              <span class="admin-kpi-label">Hoje</span>
            </div>
          </div>
        </section>

        <!-- Charts row -->
        <section class="admin-charts-row">
          <div class="admin-chart-card">
            <canvas id="chart-segmentation" class="admin-chart-canvas"></canvas>
          </div>
          <div class="admin-chart-card">
            <canvas id="chart-city" class="admin-chart-canvas"></canvas>
          </div>
          <div class="admin-chart-card">
            <canvas id="chart-neuro" class="admin-chart-canvas"></canvas>
          </div>
        </section>

        <!-- Filters + Search bar -->
        <section class="admin-toolbar">
          <div class="admin-toolbar-left">
            <div class="admin-search-box">
              <span class="material-symbols-outlined">search</span>
              <input type="text" id="search-input" placeholder="Buscar por nome ou celular..." />
            </div>
          </div>
          <div class="admin-toolbar-right">
            <select id="filter-city" class="admin-filter-select">
              <option value="">Todas as cidades</option>
            </select>
            <select id="filter-segmentation" class="admin-filter-select">
              <option value="">Todas segmentações</option>
              <option value="baixo">Baixo</option>
              <option value="medio">Médio</option>
              <option value="alto">Alto</option>
            </select>
            <select id="filter-neuro" class="admin-filter-select">
              <option value="">Neuro-Covid</option>
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
            <select id="filter-age" class="admin-filter-select">
              <option value="">Todas idades</option>
              <option value="18-30">18-30</option>
              <option value="31-45">31-45</option>
              <option value="46-60">46-60</option>
              <option value="61+">61+</option>
            </select>
            <button id="btn-clear-filters" class="admin-btn-ghost" title="Limpar filtros">
              <span class="material-symbols-outlined">filter_alt_off</span>
            </button>
          </div>
        </section>

        <!-- Action bar -->
        <section class="admin-action-bar">
          <div class="admin-action-left">
            <label class="admin-checkbox-wrap">
              <input type="checkbox" id="select-all" />
              <span>Selecionar todos</span>
            </label>
            <button id="btn-delete-selected" class="admin-btn-danger admin-hidden">
              <span class="material-symbols-outlined">delete</span>
              Excluir selecionados (<span id="delete-count">0</span>)
            </button>
          </div>
          <div class="admin-action-right">
            <span id="results-count" class="admin-results-count">0 resultados</span>
            <button id="btn-export-csv" class="admin-btn-secondary">
              <span class="material-symbols-outlined">download</span>
              Exportar CSV
            </button>
          </div>
        </section>

        <!-- Data Table -->
        <section class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th class="admin-th-check"><input type="checkbox" id="th-select-all" /></th>
                <th>Nome</th>
                <th>Idade</th>
                <th>Cidade</th>
                <th>WhatsApp</th>
                <th>Score IG</th>
                <th>Segmentação</th>
                <th>Neuro-Covid</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="table-body"></tbody>
          </table>
          <div id="table-empty" class="admin-table-empty admin-hidden">
            <span class="material-symbols-outlined" style="font-size: 48px; color: #ccc;">inbox</span>
            <p>Nenhum resultado encontrado</p>
          </div>
        </section>

        <!-- Pagination -->
        <section class="admin-pagination" id="pagination-wrap">
        </section>
      </div>
    </main>
  `

  setTimeout(() => initDashboard(container), 0)
  return container
}

// ─── State ───────────────────────────────────────
let allData = []          // full merged dataset
let filteredData = []     // after filters / search
let currentPage = 1
let selectedIds = new Set()

// ─── Init ────────────────────────────────────────
async function initDashboard(container) {
  // Show user email
  const { user } = await checkAdminSession()
  const emailEl = container.querySelector('.admin-user-email')
  if (emailEl && user) emailEl.textContent = user.email

  // Sidebar toggle (mobile)
  const sidebar = document.getElementById('admin-sidebar')
  document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    sidebar.classList.toggle('open')
  })

  // Logout
  const doLogout = async () => { await adminLogout(); navigate('/admin/login') }
  document.getElementById('nav-logout')?.addEventListener('click', doLogout)
  document.getElementById('topbar-logout')?.addEventListener('click', doLogout)

  // Sidebar shortcuts
  document.getElementById('nav-export-csv-sidebar')?.addEventListener('click', () => {
    exportTableToCSV(filteredData.length ? filteredData : allData)
  })
  document.getElementById('nav-goto-quiz')?.addEventListener('click', () => {
    navigate('/onboarding')
  })
  document.getElementById('nav-goto-site')?.addEventListener('click', () => {
    navigate('/')
  })

  // Load data
  await loadData()

  // Bind events
  bindFilters()
  bindSelection()
  bindExport()
}

// ─── Data loading ────────────────────────────────
async function loadData() {
  try {
    const { data: participants, error: pErr } = await supabase
      .from('participants')
      .select('*')
      .order('created_at', { ascending: false })

    if (pErr) throw pErr

    const { data: responses, error: rErr } = await supabase
      .from('quiz_responses')
      .select('*')

    if (rErr) throw rErr

    // Merge by participant_id
    const respMap = {}
    responses.forEach(r => { respMap[r.participant_id] = r })

    allData = participants.map(p => ({
      ...p,
      ...(respMap[p.id] || {}),
      participant_db_id: p.id // keep the original id
    }))

    filteredData = [...allData]
    currentPage = 1
    selectedIds.clear()

    renderKPIs()
    renderCharts()
    renderTable()
    populateCityFilter()

    document.getElementById('admin-loading')?.classList.add('admin-hidden')
    document.getElementById('admin-content')?.classList.remove('admin-hidden')
  } catch (err) {
    console.error('Dashboard data load error:', err)
    document.getElementById('admin-loading').innerHTML = `
      <span class="material-symbols-outlined" style="font-size:48px;color:#D94577;">error</span>
      <p>Erro ao carregar dados: ${err.message}</p>
      <button onclick="location.reload()" class="admin-btn-secondary" style="margin-top:12px;">Tentar novamente</button>
    `
  }
}

// ─── KPIs ────────────────────────────────────────
function renderKPIs() {
  document.getElementById('kpi-total').textContent = filteredData.length

  const scores = filteredData.filter(d => d.score_ig != null).map(d => d.score_ig)
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  document.getElementById('kpi-avg-score').textContent = avg + '%'

  const neuro = filteredData.filter(d => d.fator_neuro_covid === true).length
  document.getElementById('kpi-neurocovid').textContent = neuro

  const today = new Date().toISOString().slice(0, 10)
  const todayCount = filteredData.filter(d => d.created_at && d.created_at.slice(0, 10) === today).length
  document.getElementById('kpi-today').textContent = todayCount
}

// ─── Charts ──────────────────────────────────────
function renderCharts() {
  // Segmentation chart
  const segCounts = { baixo: 0, medio: 0, alto: 0 }
  filteredData.forEach(d => { if (d.segmentacao) segCounts[d.segmentacao]++ })
  renderPieChart(document.getElementById('chart-segmentation'), [
    { label: 'Baixo', value: segCounts.baixo, color: '#2D8B75' },
    { label: 'Médio', value: segCounts.medio, color: '#F4965B' },
    { label: 'Alto', value: segCounts.alto, color: '#D94577' }
  ], { title: 'Segmentação' })

  // City chart
  const cityCounts = {}
  filteredData.forEach(d => {
    const c = d.cidade_uf || 'Não informado'
    cityCounts[c] = (cityCounts[c] || 0) + 1
  })
  const citySlices = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value], i) => ({ label, value, color: CHART_COLORS[i % CHART_COLORS.length] }))
  renderPieChart(document.getElementById('chart-city'), citySlices, { title: 'Por Cidade' })

  // Neuro-covid chart
  const neuroYes = filteredData.filter(d => d.fator_neuro_covid === true).length
  const neuroNo = filteredData.length - neuroYes
  renderPieChart(document.getElementById('chart-neuro'), [
    { label: 'Sim', value: neuroYes, color: '#D94577' },
    { label: 'Não', value: neuroNo, color: '#2D8B75' }
  ], { title: 'Fator Neuro-Covid' })
}

// ─── City filter options ─────────────────────────
function populateCityFilter() {
  const cities = [
    'Americana, SP',
    'Nova Odessa, SP',
    'Santa Bárbara d\'Oeste, SP',
    'Outras Cidades'
  ]
  const select = document.getElementById('filter-city')
  // Clear existing options except the first one
  while (select.options.length > 1) {
    select.remove(1)
  }
  cities.forEach(c => {
    const opt = document.createElement('option')
    opt.value = c
    opt.textContent = c
    select.appendChild(opt)
  })
}

// ─── Filters & Search ────────────────────────────
function bindFilters() {
  const applyAll = () => {
    applyFilters()
    currentPage = 1
    selectedIds.clear()
    renderTable()
    renderKPIs()
    renderCharts()
  }

  document.getElementById('search-input').addEventListener('input', applyAll)
  document.getElementById('filter-city').addEventListener('change', applyAll)
  document.getElementById('filter-segmentation').addEventListener('change', applyAll)
  document.getElementById('filter-neuro').addEventListener('change', applyAll)
  document.getElementById('filter-age').addEventListener('change', applyAll)

  document.getElementById('btn-clear-filters').addEventListener('click', () => {
    document.getElementById('search-input').value = ''
    document.getElementById('filter-city').value = ''
    document.getElementById('filter-segmentation').value = ''
    document.getElementById('filter-neuro').value = ''
    document.getElementById('filter-age').value = ''
    applyAll()
  })
}

function applyFilters() {
  const search = (document.getElementById('search-input').value || '').toLowerCase().trim()
  const city = document.getElementById('filter-city').value
  const seg = document.getElementById('filter-segmentation').value
  const neuro = document.getElementById('filter-neuro').value
  const age = document.getElementById('filter-age').value

  filteredData = allData.filter(d => {
    // Search
    if (search) {
      const nameMatch = (d.nome || '').toLowerCase().includes(search)
      const phoneMatch = (d.whatsapp || '').replace(/\D/g, '').includes(search.replace(/\D/g, ''))
      if (!nameMatch && !phoneMatch) return false
    }
    // City
    if (city && d.cidade_uf !== city) return false
    // Segmentation
    if (seg && d.segmentacao !== seg) return false
    // Neuro
    if (neuro) {
      const boolVal = neuro === 'true'
      if (d.fator_neuro_covid !== boolVal) return false
    }
    // Age range
    if (age) {
      const a = d.idade
      if (age === '18-30' && !(a >= 18 && a <= 30)) return false
      if (age === '31-45' && !(a >= 31 && a <= 45)) return false
      if (age === '46-60' && !(a >= 46 && a <= 60)) return false
      if (age === '61+' && !(a >= 61)) return false
    }
    return true
  })
}

// ─── Table ───────────────────────────────────────
function renderTable() {
  const tbody = document.getElementById('table-body')
  const emptyEl = document.getElementById('table-empty')
  const countEl = document.getElementById('results-count')

  countEl.textContent = `${filteredData.length} resultado${filteredData.length !== 1 ? 's' : ''}`

  if (filteredData.length === 0) {
    tbody.innerHTML = ''
    emptyEl.classList.remove('hidden')
    document.getElementById('pagination-wrap').innerHTML = ''
    return
  }
  emptyEl.classList.add('hidden')

  // Pagination
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE)
  if (currentPage > totalPages) currentPage = totalPages
  const start = (currentPage - 1) * PAGE_SIZE
  const pageData = filteredData.slice(start, start + PAGE_SIZE)

  tbody.innerHTML = pageData.map(d => {
    const segBadge = getSegBadge(d.segmentacao)
    const neuroBadge = d.fator_neuro_covid
      ? '<span class="admin-badge admin-badge-danger">Sim</span>'
      : '<span class="admin-badge admin-badge-success">Não</span>'
    const dateStr = d.created_at ? new Date(d.created_at).toLocaleDateString('pt-BR') : '—'
    const checked = selectedIds.has(d.participant_db_id) ? 'checked' : ''

    return `
      <tr class="${selectedIds.has(d.participant_db_id) ? 'admin-row-selected' : ''}">
        <td><input type="checkbox" class="row-check" data-id="${d.participant_db_id}" ${checked} /></td>
        <td class="admin-td-name">${escHtml(d.nome || '—')}</td>
        <td>${d.idade || '—'}</td>
        <td>${escHtml(d.cidade_uf || '—')}</td>
        <td>${escHtml(d.whatsapp || '—')}</td>
        <td><strong>${d.score_ig != null ? d.score_ig + '%' : '—'}</strong></td>
        <td>${segBadge}</td>
        <td>${neuroBadge}</td>
        <td>${dateStr}</td>
        <td>
          <button class="admin-btn-icon view-btn" data-id="${d.participant_db_id}" title="Ver ficha">
            <span class="material-symbols-outlined">visibility</span>
          </button>
          <button class="admin-btn-icon delete-single-btn" data-id="${d.participant_db_id}" data-nome="${escAttr(d.nome)}" title="Excluir">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </td>
      </tr>
    `
  }).join('')

  renderPagination(totalPages)
  bindTableActions()
  updateSelectionUI()
}

function getSegBadge(seg) {
  if (seg === 'baixo') return '<span class="admin-badge admin-badge-success">Baixo</span>'
  if (seg === 'medio') return '<span class="admin-badge admin-badge-warning">Médio</span>'
  if (seg === 'alto') return '<span class="admin-badge admin-badge-danger">Alto</span>'
  return '<span class="admin-badge">—</span>'
}

// ─── Pagination ──────────────────────────────────
function renderPagination(totalPages) {
  const wrap = document.getElementById('pagination-wrap')
  if (totalPages <= 1) { wrap.innerHTML = ''; return }

  let html = '<div class="admin-pagination-inner">'
  html += `<button class="admin-page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>
    <span class="material-symbols-outlined">chevron_left</span>
  </button>`

  for (let p = 1; p <= totalPages; p++) {
    if (totalPages > 7 && p > 3 && p < totalPages - 1 && Math.abs(p - currentPage) > 1) {
      if (p === 4 || p === totalPages - 2) html += '<span class="admin-page-dots">…</span>'
      continue
    }
    html += `<button class="admin-page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`
  }

  html += `<button class="admin-page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>
    <span class="material-symbols-outlined">chevron_right</span>
  </button></div>`

  wrap.innerHTML = html
  wrap.querySelectorAll('.admin-page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pg = parseInt(btn.dataset.page)
      if (pg >= 1 && pg <= totalPages) {
        currentPage = pg
        renderTable()
        document.querySelector('.admin-table-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  })
}

// ─── Selection ───────────────────────────────────
function bindSelection() {
  // "Select all" in action bar
  document.getElementById('select-all')?.addEventListener('change', (e) => {
    toggleSelectAll(e.target.checked)
  })
  // "Select all" in table header
  document.getElementById('th-select-all')?.addEventListener('change', (e) => {
    toggleSelectAll(e.target.checked)
  })

  // Delete selected
  document.getElementById('btn-delete-selected')?.addEventListener('click', () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Tem certeza que deseja excluir ${selectedIds.size} registro(s)? Esta ação não pode ser desfeita.`)) return
    deleteParticipants([...selectedIds])
  })
}

function toggleSelectAll(checked) {
  if (checked) {
    filteredData.forEach(d => selectedIds.add(d.participant_db_id))
  } else {
    selectedIds.clear()
  }
  renderTable()
}

function updateSelectionUI() {
  const deleteBtn = document.getElementById('btn-delete-selected')
  const countEl = document.getElementById('delete-count')
  if (selectedIds.size > 0) {
    deleteBtn.classList.remove('admin-hidden')
    countEl.textContent = selectedIds.size
  } else {
    deleteBtn.classList.add('admin-hidden')
  }

  // Sync header checkbox
  const thCb = document.getElementById('th-select-all')
  const actionCb = document.getElementById('select-all')
  const allOnPage = document.querySelectorAll('.row-check')
  const allChecked = allOnPage.length > 0 && Array.from(allOnPage).every(cb => cb.checked)
  if (thCb) thCb.checked = allChecked
  if (actionCb) actionCb.checked = allChecked
}

function bindTableActions() {
  // Row checkboxes
  document.querySelectorAll('.row-check').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.dataset.id
      if (cb.checked) selectedIds.add(id)
      else selectedIds.delete(id)
      updateSelectionUI()
      // Highlight row
      cb.closest('tr').classList.toggle('admin-row-selected', cb.checked)
    })
  })

  // View buttons
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      navigate('/admin/user/' + btn.dataset.id, { participantId: btn.dataset.id })
    })
  })

  // Single delete buttons
  document.querySelectorAll('.delete-single-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const nome = btn.dataset.nome || 'este participante'
      if (!confirm(`Excluir "${nome}"? Esta ação não pode ser desfeita.`)) return
      deleteParticipants([btn.dataset.id])
    })
  })
}

// ─── Delete ──────────────────────────────────────
async function deleteParticipants(ids) {
  try {
    // Delete responses first (FK)
    const { error: rErr } = await supabase
      .from('quiz_responses')
      .delete()
      .in('participant_id', ids)

    if (rErr) throw rErr

    // Delete participants
    const { error: pErr } = await supabase
      .from('participants')
      .delete()
      .in('id', ids)

    if (pErr) throw pErr

    // Update local state
    allData = allData.filter(d => !ids.includes(d.participant_db_id))
    filteredData = filteredData.filter(d => !ids.includes(d.participant_db_id))
    ids.forEach(id => selectedIds.delete(id))

    renderKPIs()
    renderCharts()
    renderTable()
  } catch (err) {
    alert('Erro ao excluir: ' + err.message)
    console.error(err)
  }
}

// ─── Export ──────────────────────────────────────
function bindExport() {
  document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    exportTableToCSV(filteredData)
  })
}

// ─── Helpers ─────────────────────────────────────
function escHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function escAttr(str) {
  return (str || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
