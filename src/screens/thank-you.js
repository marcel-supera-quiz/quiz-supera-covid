import headerComponent from '../components/header.js'
import { navigate } from '../router.js'
import logoImg from '../assets/logo-orange.png'

export default function renderThankYou() {
  const container = document.createElement('div')
  container.className = 'w-full min-h-screen flex flex-col bg-background-light'

  container.appendChild(headerComponent())

  // Retrieve participant data for personalization
  let participantData = { nome: 'Participante' }
  try {
    participantData = JSON.parse(localStorage.getItem('supera_participant') || '{"nome": "Participante"}')
  } catch (e) { }

  const main = document.createElement('main')
  main.className = 'flex-grow flex flex-col items-center justify-start py-8 px-4 md:py-12 mt-16 max-w-[800px] mx-auto w-full'

  main.innerHTML = `
    <!-- Success Badge -->
    <div class="flex flex-col items-center gap-6 text-center animate-fade-in-up mb-10">
      <div class="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-2">
        <span class="material-symbols-outlined text-green-600" style="font-size: 56px;">check_circle</span>
      </div>
      <h1 class="text-secondary text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
        Obrigado, ${participantData.nome}!
      </h1>
      <p class="text-secondary-light text-lg md:text-xl leading-relaxed max-w-lg">
        Sua participação foi registrada com sucesso. Confira abaixo seu presente exclusivo!
      </p>
    </div>

    <!-- E-Book Card -->
    <div class="w-full bg-white rounded-3xl shadow-warm p-8 md:p-10 flex flex-col items-center gap-6 animate-fade-in-up mb-8" style="animation-delay: 0.15s;">
      <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
        <span class="material-symbols-outlined text-primary" style="font-size: 44px;">menu_book</span>
      </div>
      <div class="text-center">
        <h2 class="text-secondary text-2xl md:text-3xl font-extrabold mb-2">E-Book Gratuito</h2>
        <p class="text-secondary-light text-base md:text-lg leading-relaxed max-w-md">
          <strong class="text-primary">Como Vencer o Brain Fog</strong> — Guia completo com estratégias comprovadas pela neurociência para recuperar sua clareza mental.
        </p>
      </div>
      <button id="btn-download-ebook" class="group flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-white font-bold text-base uppercase tracking-wider py-4 px-10 rounded-full shadow-[0_10px_30px_-10px_rgba(234,91,12,0.4)] transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
        <span class="material-symbols-outlined group-hover:translate-y-0.5 transition-transform">download</span>
        <span>Baixar E-Book (PDF)</span>
      </button>
      <p id="ebook-status" class="text-secondary-light text-sm hidden"></p>
    </div>

    <!-- Share & Home Buttons -->
    <div class="w-full flex flex-col sm:flex-row gap-4 animate-fade-in-up mb-12" style="animation-delay: 0.3s;">
      <button id="btn-share-friends" class="flex-1 flex items-center justify-center gap-3 bg-[#25D366] hover:opacity-90 text-white font-bold text-base py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
        <span class="material-symbols-outlined">share</span>
        <span>Indicar para Amigos e Família</span>
      </button>
      <button id="btn-go-home" class="flex-1 flex items-center justify-center gap-3 border-2 border-secondary/20 text-secondary font-bold text-base py-4 px-6 rounded-full hover:bg-secondary/5 transition-all duration-300">
        <span class="material-symbols-outlined">home</span>
        <span>Voltar ao Início</span>
      </button>
    </div>

    <!-- Footer message -->
    <div class="text-center text-secondary-light/60 text-sm pb-8 animate-fade-in-up" style="animation-delay: 0.45s;">
      <p>Supera | Mente Ativa — Desenvolvendo mentes mais fortes desde 2006.</p>
    </div>
  `

  container.appendChild(main)

  setTimeout(() => {
    // E-Book download
    document.getElementById('btn-download-ebook')?.addEventListener('click', () => {
      const ebookUrl = localStorage.getItem('supera_ebook_url')
      if (ebookUrl) {
        const link = document.createElement('a')
        link.href = ebookUrl
        link.download = 'Como_Vencer_o_Brain_Fog_Supera.pdf'
        link.target = '_blank'
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        setTimeout(() => document.body.removeChild(link), 100)
      } else {
        // Fallback: show message that PDF is not yet configured
        const statusEl = document.getElementById('ebook-status')
        statusEl.textContent = '⚠️ O PDF do e-book ainda não foi cadastrado. Em breve estará disponível!'
        statusEl.classList.remove('hidden')
      }
    })

    // Share with friends via WhatsApp
    document.getElementById('btn-share-friends')?.addEventListener('click', () => {
      const shareMessage = `🧠 Fiz a Avaliação Cognitiva Pós-Covid do Supera e descobri como está minha memória comparada à média nacional! Faça a sua também, é gratuito: ${window.location.origin}/`
      const encodedMsg = encodeURIComponent(shareMessage)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      if (isMobile) {
        window.open(`whatsapp://send?text=${encodedMsg}`)
      } else {
        window.open(`https://web.whatsapp.com/send?text=${encodedMsg}`, '_blank')
      }
    })

    // Go home
    document.getElementById('btn-go-home')?.addEventListener('click', () => {
      navigate('/')
    })
  }, 0)

  return container
}
