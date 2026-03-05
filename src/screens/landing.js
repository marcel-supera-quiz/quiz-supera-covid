import { navigate } from '../router.js'
import heroImg from '../assets/hero-image.webp.png'
import logoImg from '../assets/logo-orange.png'

export default function renderLanding() {
  const container = document.createElement('div')
  container.className = 'w-full min-h-screen flex flex-col'

  container.innerHTML = `
    <!-- Navigation -->
    <header class="relative z-10 w-full px-6 py-6 md:px-12 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img src="${logoImg}" alt="Logo Projeto: Mente Ativa" class="h-20 md:h-24 w-auto object-contain">
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="relative z-10 flex-grow flex flex-col justify-center px-6 md:px-12 py-8 lg:py-0">
      <div class="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-center h-full">
        <!-- Left Column: Copy & CTA -->
        <div class="flex flex-col items-start gap-8 max-w-xl animate-fade-in-up order-2 lg:order-1">
          <div class="space-y-6">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-primary text-xs font-bold uppercase tracking-wider">
              <span class="material-symbols-outlined text-[16px]">health_and_safety</span>
              Saúde Cognitiva Pós-Pandemia
            </div>
            
            <h1 class="font-vag font-extrabold text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.1] text-secondary tracking-tight">
              A Covid passou. <br/>
              <span class="text-primary italic">As sequelas ficaram?</span>
            </h1>
            
            <p class="text-lg md:text-xl text-secondary-light leading-relaxed max-w-lg">
              Participe da Pesquisa de Impacto Cognitivo e descubra como está sua memória comparada à média nacional.
            </p>
          </div>

          <!-- CTA Section (Desktop Only) -->
          <div class="hidden lg:flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
            <button class="start-btn group relative flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-white font-bold text-base uppercase tracking-wider py-4 px-8 rounded-full shadow-[0_10px_30px_-10px_rgba(234,91,12,0.4)] transition-all duration-300 transform hover:scale-105 animate-subtle-pulse w-full sm:w-auto">
              <span>Iniciar Avaliação</span>
              <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <div class="flex items-center gap-2 text-secondary-light text-sm sm:hidden mt-2 justify-center w-full">
              <span class="material-symbols-outlined text-[18px]">timer</span>
              <span>Duração: 3 min</span>
            </div>
          </div>

          <!-- Trust Badges -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-secondary/10 w-full">
            <div class="flex items-center gap-3">
              <div class="bg-orange-50 p-2 rounded-lg text-primary">
                <span class="material-symbols-outlined">psychology</span>
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-secondary text-sm leading-tight">Baseado em neurociência</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="bg-orange-50 p-2 rounded-lg text-primary">
                <span class="material-symbols-outlined">bolt</span>
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-secondary text-sm leading-tight">Resultados imediatos</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="bg-orange-50 p-2 rounded-lg text-primary">
                <span class="material-symbols-outlined">lock</span>
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-secondary text-sm leading-tight">100% Gratuito e Seguro</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Hero Illustration -->
        <div class="relative w-full h-full min-h-[400px] lg:min-h-[600px] flex flex-col items-center justify-center lg:justify-end order-1 lg:order-2 gap-8">
          <div class="absolute inset-0 flex items-center justify-center lg:justify-end opacity-20 pointer-events-none">
            <div class="w-[120%] h-[120%] bg-gradient-to-br from-orange-200 to-transparent rounded-full blur-3xl transform translate-x-10 translate-y-10"></div>
          </div>
          
          <div class="relative z-10 w-full max-w-lg aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(89,28,11,0.15)] bg-surface transform rotate-1 hover:rotate-0 transition-transform duration-700 ease-out group">
            <div class="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent mix-blend-multiply z-10"></div>
            <img src="${heroImg}" alt="Pessoa idosa ativa e saudável" class="w-full h-full object-cover">

            <div class="absolute bottom-8 left-8 right-8 z-20 bg-surface/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 flex items-center gap-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <div class="bg-green-100 text-green-700 p-2 rounded-full">
                <span class="material-symbols-outlined text-xl">check_circle</span>
              </div>
              <div>
                <p class="text-xs font-bold text-secondary-light uppercase tracking-wide">Status da Memória</p>
                <p class="font-display font-bold text-secondary text-lg">Análise Detalhada</p>
              </div>
              <div class="ml-auto">
                <div class="h-10 w-10 rounded-full border-4 border-green-500 flex items-center justify-center text-[10px] font-bold text-secondary bg-white">
                  98%
                </div>
              </div>
            </div>
          </div>

          <!-- CTA Section (Mobile Only) -->
          <div class="flex lg:hidden flex-col gap-4 w-full pt-2">
            <button class="start-btn group relative flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-white font-bold text-base uppercase tracking-wider py-4 px-8 rounded-full shadow-[0_10px_30px_-10px_rgba(234,91,12,0.4)] transition-all duration-300 transform hover:scale-105 animate-subtle-pulse w-full">
              <span>Iniciar Avaliação</span>
              <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <div class="flex items-center gap-2 text-secondary-light text-sm mt-2 justify-center w-full">
              <span class="material-symbols-outlined text-[18px]">timer</span>
              <span>Duração: 3 min</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Simple Footer for Context -->
    <footer class="relative z-10 py-6 text-center text-secondary-light/60 text-xs font-medium">
      <p>© 2024 Projeto: Mente Ativa. Todos os direitos reservados.</p>
    </footer>
  `

  setTimeout(() => {
    const startBtns = document.querySelectorAll('.start-btn')
    startBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        navigate('/onboarding')
      })
    })
  }, 0)

  return container
}
