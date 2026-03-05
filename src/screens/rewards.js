import headerComponent from '../components/header.js'
import { generateCertificate } from '../utils/certificate.js'
import { shareOnWhatsApp } from '../utils/whatsapp.js'
import { navigate } from '../router.js'
import squeezeImg from '../assets/squeeze.png'
import atendimentoImg from '../assets/atendimento.png'

export default function renderRewards() {
  const container = document.createElement('div')
  container.className = 'w-full min-h-screen flex flex-col bg-background-light'

  container.appendChild(headerComponent())

  const main = document.createElement('main')
  main.className = 'flex-grow flex flex-col items-center justify-start py-8 px-4 md:py-12 mt-16 max-w-[960px] mx-auto w-full'

  let resultData = { score_ig: 0, segmentacao: 'baixo' }
  let participantData = { nome: 'Participante' }

  try {
    resultData = JSON.parse(localStorage.getItem('supera_final_results') || '{}')
    participantData = JSON.parse(localStorage.getItem('supera_participant') || '{"nome": "Participante"}')
  } catch (e) { }

  let segmentText = ''
  let segmentColor = ''
  if (resultData.segmentacao === 'baixo') {
    segmentText = 'Excelente potencial. Sua memória está em boas condições comparada à média.'
    segmentColor = 'text-green-600'
  } else if (resultData.segmentacao === 'medio') {
    segmentText = 'Atenção! Identificamos um impacto mediano na sua agilidade cognitiva.'
    segmentColor = 'text-yellow-600'
  } else {
    segmentText = 'Alerta: Os resultados apontam um impacto significativo que merece acompanhamento especializado.'
    segmentColor = 'text-red-600'
  }

  let ctaTitle = 'PARABÉNS POR CONCLUIR A PESQUISA!'

  main.innerHTML = `
    <div class="flex flex-col gap-4 text-center md:text-left animate-fade-in-up mb-8">
      <div class="inline-flex items-center gap-2 self-center md:self-start bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        <span class="material-symbols-outlined text-sm">check_circle</span>
        Análise Concluída
      </div>
      <h1 class="text-secondary text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight uppercase w-full">
        ${ctaTitle}
      </h1>
      <div class="flex flex-col items-center justify-center my-6 md:my-10 w-full">
        <h2 class="text-secondary-light text-xl md:text-2xl font-bold mb-2">Impacto cognitivo:</h2>
        <div class="${segmentColor} text-7xl md:text-8xl font-black leading-none">${resultData.score_ig}%</div>
      </div>
      <p class="text-secondary text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto text-center w-full">
        ${segmentText}
      </p>
      <h2 class="text-[#FF6B00] text-2xl md:text-3xl font-extrabold mt-12 mb-2 text-center w-full">
        Escolha seu presente exclusivo de conclusão:
      </h2>
    </div>

    <form id="rewards-form" class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full group cards-group mb-20 animate-fade-in-up" style="animation-delay: 0.2s;">
      
      <!-- Card 1: Squeeze -->
      <label class="relative cursor-pointer group/card w-full">
        <input type="radio" name="reward" value="squeeze" class="peer sr-only" required>
        <div class="reward-card h-full flex flex-col bg-white rounded-2xl shadow-warm hover:shadow-warm-hover overflow-hidden p-1 border-4 border-transparent peer-checked:border-primary peer-checked:-translate-y-1">
          <div class="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-xl bg-orange-50">
            <img src="${squeezeImg}" alt="Squeeze Mente Ativa" class="w-full h-full object-cover">
          </div>
          <div class="flex flex-col flex-1 p-5 gap-3">
            <div class="flex items-start justify-between">
              <h3 class="text-xl md:text-2xl font-bold text-secondary font-display">Squeeze Exclusivo Mente Ativa</h3>
              <div class="size-6 rounded-full border-2 border-gray-300 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-colors">
                <div class="size-3 rounded-full bg-primary opacity-0 peer-checked:opacity-100"></div>
              </div>
            </div>
            <p class="text-secondary-light leading-relaxed">
              Ideal para manter a hidratação e o foco durante seus treinos cognitivos diários.
            </p>
          </div>
        </div>
      </label>

      <!-- Card 2: Evaluation -->
      <label class="relative cursor-pointer group/card w-full">
        <input type="radio" name="reward" value="evaluation" class="peer sr-only" required>
        <div class="reward-card h-full flex flex-col bg-white rounded-2xl shadow-warm hover:shadow-warm-hover overflow-hidden p-1 border-4 border-transparent peer-checked:border-primary peer-checked:-translate-y-1">
          <div class="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-xl bg-blue-50">
            <img src="${atendimentoImg}" alt="Avaliação Gratuita" class="w-full h-full object-cover">
            <div class="absolute bottom-4 left-4 text-white flex items-center gap-2">
              <span class="bg-blue-600 px-2 py-1 rounded text-xs font-bold uppercase">Recomendado</span>
            </div>
          </div>
          <div class="flex flex-col flex-1 p-5 gap-3">
            <div class="flex items-start justify-between">
              <h3 class="text-xl md:text-2xl font-bold text-secondary font-display">Avaliação Gratuita</h3>
              <div class="size-6 rounded-full border-2 border-gray-300 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-colors">
                <div class="size-3 rounded-full bg-primary opacity-0 peer-checked:opacity-100"></div>
              </div>
            </div>
            <p class="text-secondary-light leading-relaxed">
              Sessão presencial gratuita com especialista para uma análise profunda da sua memória e atenção.
            </p>
          </div>
        </div>
      </label>

      <div class="md:col-span-2 flex justify-center gap-4 mt-8 flex-col sm:flex-row">
        <button type="button" id="cert-btn" class="flex-1 flex items-center justify-center gap-2 border-2 border-orange-200 text-primary font-bold py-3 mx-4 sm:mx-0 rounded-full hover:bg-orange-50 transition-colors">
          <span class="material-symbols-outlined">download</span>
          Baixar Certificado
        </button>
        <button type="submit" id="wa-btn" class="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 mx-4 sm:mx-0 rounded-full hover:opacity-90 transition-opacity">
          Confirmar e Enviar no WhatsApp
        </button>
      </div>
    </form>
  `
  container.appendChild(main)

  setTimeout(() => {
    // Add logic to toggle 'has-selection' class visually on the group
    const inputs = document.querySelectorAll('input[name="reward"]')
    const group = document.querySelector('.cards-group')
    inputs.forEach(input => {
      input.addEventListener('change', () => group.classList.add('has-selection'))
    })

    document.getElementById('cert-btn').addEventListener('click', () => {
      generateCertificate(resultData, participantData.nome)
    })

    document.getElementById('rewards-form').addEventListener('submit', (e) => {
      e.preventDefault()
      const selected = document.querySelector('input[name="reward"]:checked').value

      // 1. Opens WhatsApp in a new tab/app (via window.open)
      shareOnWhatsApp(participantData, resultData, selected)

      // 2. Immediately navigates the current tab to the thank you page
      navigate('/thank-you')
    })

  }, 0)

  return container
}
