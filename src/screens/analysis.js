import { navigate } from '../router.js'
import { calculateIG, getSegmentation, hasNeuroCovid } from '../logic/scoring.js'
import { supabase } from '../supabase.js'

export default function renderAnalysis() {
  const container = document.createElement('div')
  container.className = 'w-full min-h-screen flex flex-col bg-background-light overflow-hidden relative'

  // Minimal static HTML for the animation
  container.innerHTML = `
    <!-- Header -->
    <header class="relative z-10 flex items-center justify-center pt-8 pb-4">
      <div class="flex items-center gap-3">
        <div class="size-8 text-primary">
          <span class="material-symbols-outlined text-4xl">psychology</span>
        </div>
        <h1 class="text-secondary font-display text-xl font-bold tracking-tight">Supera Vitality</h1>
      </div>
    </header>

    <main class="relative z-10 flex-grow flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto">
      <div class="flex flex-col items-center justify-center w-full max-w-lg">
        <!-- Brain Animation Area -->
        <div class="relative w-64 h-64 sm:w-80 sm:h-80 mb-12 flex items-center justify-center">
          <div class="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
          
          <div class="relative w-full h-full bg-white rounded-full shadow-warm flex items-center justify-center border-4 border-orange-100 overflow-hidden">
            <div class="absolute bottom-0 w-full bg-orange-200 opacity-50 animate-fill-up"></div>
            <span class="material-symbols-outlined text-[100px] text-primary z-10 animate-bounce">
              neurology
            </span>
          </div>
        </div>

        <div aria-live="polite" class="text-center space-y-2 h-20">
          <h2 id="analysis-msg" class="text-2xl sm:text-3xl font-bold text-secondary animate-fade-in-out transition-opacity duration-500">
            Analisando padrões de resposta...
          </h2>
          <p class="text-secondary-light text-base sm:text-lg">
            Isso levará apenas alguns segundos
          </p>
        </div>

        <!-- Progress Indicator -->
        <div class="w-full max-w-xs mt-10 space-y-3">
          <div class="flex justify-between items-end px-1">
            <span class="text-sm font-bold text-secondary-light uppercase tracking-widest">Processando</span>
            <span id="progress-text" class="font-mono text-primary font-bold text-xl">0%</span>
          </div>
          <div class="h-3 w-full bg-white rounded-full border border-gray-100 shadow-inner overflow-hidden relative">
            <div class="h-full bg-primary rounded-full relative w-0 animate-fill-up"></div>
          </div>
        </div>
      </div>
    </main>
  `

  setTimeout(() => {
    processDataAndProgress()
  }, 0)

  return container
}

async function processDataAndProgress() {
  const duration = 6000 // 6 seconds minimum animation
  const startTime = Date.now()
  const progressText = document.getElementById('progress-text')

  // 1. Start UI Animation
  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime
    const percent = Math.min(Math.round((elapsed / duration) * 100), 99)
    progressText.innerText = Math.round(percent) + '%'
  }, 50)

  const messages = [
    "Testando velocidade de raciocínio...",
    "Apurando indicadores neurológicos...",
    "Comparando com médias regionais...",
    "Gerando seu perfil cognitivo..."
  ]
  const titleElement = document.getElementById('analysis-msg')
  let msgIdx = 0
  const msgInterval = setInterval(() => {
    msgIdx = (msgIdx + 1) % messages.length
    if (titleElement) titleElement.innerText = messages[msgIdx]
  }, 1500)

  let hasError = false

  // 2. Data Processing Logic
  try {
    const participantRaw = localStorage.getItem('supera_participant')
    const responsesRaw = localStorage.getItem('supera_responses')

    if (!participantRaw || !responsesRaw) throw new Error('Missing data')

    const partData = JSON.parse(participantRaw)
    const respData = JSON.parse(responsesRaw)

    // Calculate Scores
    const scoreIG = calculateIG(
      respData.p1_frequencia || 1,
      respData.p2_foco || 1,
      respData.p3_energia || 1,
      respData.p4_velocidade || 1,
      respData.p5_localizacao || 1,
      respData.p6_causalidade || 1
    )

    const segmentacao = getSegmentation(scoreIG)
    const neuroInfo = hasNeuroCovid(respData.p6_causalidade || 1, respData.p7_sintomas || [])

    const finalData = {
      ...respData,
      score_ig: scoreIG,
      segmentacao: segmentacao,
      fator_neuro_covid: neuroInfo.isNeuroCovid
    }

    // Storage update for later use in Rewards
    localStorage.setItem('supera_final_results', JSON.stringify(finalData))

    // Supabase Insert - Participant
    const { data: partResult, error: partError } = await supabase
      .from('participants')
      .insert([{
        nome: partData.nome,
        idade: partData.idade || 0,
        cidade_uf: partData.cidade_uf || 'ND',
        whatsapp: partData.whatsapp || 'ND'
      }])
      .select('id')
      .single()

    if (partError) throw partError

    // Supabase Insert - Responses
    const respPayload = {
      participant_id: partResult.id,
      ...finalData
    }

    const { error: respError } = await supabase
      .from('quiz_responses')
      .insert([respPayload])

    if (respError) throw respError

  } catch (err) {
    hasError = true
    console.error("Failed to process data:", err)
    clearInterval(interval)
    clearInterval(msgInterval)
    const msgEl = document.getElementById('analysis-msg')
    if (msgEl) {
      msgEl.className = "text-red-500 font-bold text-sm text-left whitespace-pre-wrap mt-4"
      msgEl.innerText = `Erro ao salvar no banco de dados:\n\n${err.message || JSON.stringify(err)}\n\nPor favor, tire um print desta tela e envie ao suporte.`
    }
    document.getElementById('progress-text').innerText = 'Erro'
  }

  if (hasError) return; // Halt execution, do not redirect!

  // 3. Ensure minimum waiting time finishes before redirecting
  const remainingTime = duration - (Date.now() - startTime)
  setTimeout(() => {
    clearInterval(interval)
    clearInterval(msgInterval)
    progressText.innerText = '100%'
    navigate('/rewards')
  }, Math.max(remainingTime, 500))
}
