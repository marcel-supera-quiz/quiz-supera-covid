import { supabase } from '../supabase.js'
import { navigate } from '../router.js'
import { exportSingleRecordToCSV } from '../utils/csv-export.js'
import { questions } from '../logic/questions.js'

export default function renderAdminUserDetail(state) {
  const container = document.createElement('div')
  container.className = 'admin-page'

  // Get participant ID from state or URL
  const participantId = state?.participantId || window.location.hash.split('/').pop()

  container.innerHTML = `
    <main class="admin-main admin-detail-main">
      <div id="detail-loading" class="admin-loading">
        <span class="admin-spinner-lg"></span>
        <p>Carregando ficha...</p>
      </div>
      <div id="detail-content" class="admin-detail-content hidden"></div>
    </main>
  `

  setTimeout(() => loadParticipant(participantId), 0)
  return container
}

async function loadParticipant(id) {
  const loadingEl = document.getElementById('detail-loading')
  const contentEl = document.getElementById('detail-content')

  try {
    // Fetch participant
    const { data: participant, error: pErr } = await supabase
      .from('participants')
      .select('*')
      .eq('id', id)
      .single()

    if (pErr) throw pErr

    // Fetch responses
    const { data: response, error: rErr } = await supabase
      .from('quiz_responses')
      .select('*')
      .eq('participant_id', id)
      .single()

    if (rErr && rErr.code !== 'PGRST116') throw rErr // PGRST116 = no rows

    const record = { ...participant, ...(response || {}) }

    loadingEl.classList.add('hidden')
    contentEl.classList.remove('hidden')
    renderDetail(contentEl, record, id)
  } catch (err) {
    console.error(err)
    loadingEl.innerHTML = `
      <span class="material-symbols-outlined" style="font-size:48px;color:#D94577;">error</span>
      <p>Erro ao carregar ficha: ${err.message}</p>
      <button onclick="location.hash='#/admin/dashboard'" class="admin-btn-secondary" style="margin-top:12px;">Voltar ao Dashboard</button>
    `
  }
}

function renderDetail(el, record, participantId) {
  const segColor = record.segmentacao === 'baixo' ? '#2D8B75' : record.segmentacao === 'medio' ? '#F4965B' : '#D94577'
  const segLabel = record.segmentacao === 'baixo' ? 'Baixo' : record.segmentacao === 'medio' ? 'Médio' : 'Alto'
  const segBadgeClass = record.segmentacao === 'baixo' ? 'admin-badge-success' : record.segmentacao === 'medio' ? 'admin-badge-warning' : 'admin-badge-danger'
  const dateStr = record.created_at ? new Date(record.created_at).toLocaleString('pt-BR') : '—'

  // Map question keys to their texts
  const questionMap = {}
  questions.forEach(q => { questionMap[q.key] = q.text })

  const answerKeys = [
    'p1_frequencia', 'p2_foco', 'p3_energia', 'p4_velocidade',
    'p5_localizacao', 'p6_causalidade', 'p7_sintomas', 'p8_internacao',
    'p9_escalabilidade', 'p10_relato'
  ]

  el.innerHTML = `
    <!-- Top bar -->
    <div class="admin-detail-topbar">
      <button id="back-btn" class="admin-btn-ghost">
        <span class="material-symbols-outlined">arrow_back</span>
        Voltar ao Dashboard
      </button>
      <div class="admin-detail-actions">
        <button id="export-single-btn" class="admin-btn-secondary">
          <span class="material-symbols-outlined">download</span>
          Exportar CSV
        </button>
        <button id="delete-single-btn" class="admin-btn-danger">
          <span class="material-symbols-outlined">delete</span>
          Excluir
        </button>
      </div>
    </div>

    <!-- Header card -->
    <div class="admin-detail-header-card">
      <div class="admin-detail-avatar">
        <span class="material-symbols-outlined">person</span>
      </div>
      <div class="admin-detail-header-info">
        <h1 class="admin-detail-name">${escHtml(record.nome || 'Sem nome')}</h1>
        <div class="admin-detail-meta">
          <span><span class="material-symbols-outlined">cake</span> ${record.idade || '—'} anos</span>
          <span><span class="material-symbols-outlined">location_on</span> ${escHtml(record.cidade_uf || '—')}</span>
          <span><span class="material-symbols-outlined">call</span> ${escHtml(record.whatsapp || '—')}</span>
          <span><span class="material-symbols-outlined">calendar_today</span> ${dateStr}</span>
        </div>
      </div>
    </div>

    <!-- Score card -->
    <div class="admin-detail-score-row">
      <div class="admin-detail-score-card">
        <div class="admin-detail-score-circle" style="border-color: ${segColor};">
          <span class="admin-detail-score-value" style="color: ${segColor};">${record.score_ig != null ? record.score_ig : '—'}%</span>
        </div>
        <div class="admin-detail-score-info">
          <span class="admin-detail-score-label">Score de Impacto Cognitivo (IG)</span>
          <span class="admin-badge ${segBadgeClass}">${segLabel}</span>
        </div>
      </div>
      <div class="admin-detail-score-card">
        <div class="admin-detail-neuro-icon ${record.fator_neuro_covid ? 'neuro-positive' : 'neuro-negative'}">
          <span class="material-symbols-outlined">${record.fator_neuro_covid ? 'warning' : 'check_circle'}</span>
        </div>
        <div class="admin-detail-score-info">
          <span class="admin-detail-score-label">Fator Neuro-Covid</span>
          <span class="admin-badge ${record.fator_neuro_covid ? 'admin-badge-danger' : 'admin-badge-success'}">
            ${record.fator_neuro_covid ? 'Positivo' : 'Negativo'}
          </span>
        </div>
      </div>
    </div>

    <!-- Quiz responses -->
    <div class="admin-detail-section">
      <h2 class="admin-detail-section-title">
        <span class="material-symbols-outlined">description</span>
        Ficha do Participante
      </h2>
      <div class="admin-detail-responses">
        ${answerKeys.map((key, i) => {
    let value = record[key]
    if (value === undefined || value === null) value = '—'
    if (Array.isArray(value)) value = value.join(', ')
    if (typeof value === 'boolean') value = value ? 'Sim' : 'Não'

    return `
            <div class="admin-detail-response-item">
              <div class="admin-detail-response-number">${i + 1}</div>
              <div class="admin-detail-response-body">
                <p class="admin-detail-response-q">${questionMap[key] || key}</p>
                <p class="admin-detail-response-a">${escHtml(String(value))}</p>
              </div>
            </div>
          `
  }).join('')}
      </div>
    </div>
  `

  // Bind actions
  document.getElementById('back-btn').addEventListener('click', () => {
    navigate('/admin/dashboard')
  })

  document.getElementById('export-single-btn').addEventListener('click', () => {
    exportSingleRecordToCSV(record)
  })

  document.getElementById('delete-single-btn').addEventListener('click', async () => {
    if (!confirm(`Excluir "${record.nome}"? Esta ação não pode ser desfeita.`)) return

    try {
      await supabase.from('quiz_responses').delete().eq('participant_id', participantId)
      await supabase.from('participants').delete().eq('id', participantId)
      alert('Registro excluído com sucesso.')
      navigate('/admin/dashboard')
    } catch (err) {
      alert('Erro ao excluir: ' + err.message)
    }
  })
}

function escHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}
