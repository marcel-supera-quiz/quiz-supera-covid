import { navigate } from '../router.js'
import headerComponent from '../components/header.js'

export default function renderOnboarding() {
  const container = document.createElement('div')
  container.className = 'w-full min-h-screen flex flex-col bg-background-light'

  container.appendChild(headerComponent())

  const main = document.createElement('main')
  main.className = 'flex-grow flex items-center justify-center w-full min-h-screen bg-split px-4 py-20 relative overflow-hidden'

  main.innerHTML = `
    <!-- Central Card -->
    <div class="w-full max-w-[520px] bg-white rounded-xl shadow-warm relative z-10 animate-fade-in-up mt-12">
      <!-- Progress Bar -->
      <div class="w-full h-2 bg-gray-100 rounded-t-xl overflow-hidden flex">
        <div class="h-full bg-primary w-[10%] transition-all duration-500 ease-out"></div>
      </div>
      
      <div class="p-8 md:p-10">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <span class="material-symbols-outlined text-primary">waving_hand</span>
          </div>
          <h1 class="text-3xl font-bold text-secondary mb-3 leading-tight">Vamos nos conhecer</h1>
          <p class="text-secondary-light text-base leading-relaxed max-w-sm mx-auto">
            Essas informações nos ajudam a comparar sua memória com a média da sua faixa etária.
          </p>
        </div>

        <!-- Form -->
        <form id="onboarding-form" class="space-y-6">
          <div class="relative group pt-4">
            <input type="text" id="fullname" placeholder="Nome Completo" required 
              class="floating-input block w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer text-secondary font-medium placeholder-transparent">
            <label for="fullname" class="absolute text-secondary-light duration-300 transform -translate-y-1.5 scale-75 top-7 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-10 cursor-text">
              Nome Completo
            </label>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="relative pt-4">
              <input type="number" id="age" min="18" max="120" placeholder="Idade" required 
                class="floating-input block w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer text-secondary font-medium placeholder-transparent">
              <label for="age" class="absolute text-secondary-light duration-300 transform -translate-y-1.5 scale-75 top-7 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-10 cursor-text">
                Idade (anos)
              </label>
            </div>
            
            <div class="relative pt-4">
              <select id="city" required 
                class="floating-input block w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer text-secondary font-medium cursor-pointer">
                <option value="" disabled selected class="text-gray-400"></option>
                <option value="americana">Americana, SP</option>
                <option value="nova_odessa">Nova Odessa, SP</option>
                <option value="sbo">Santa Bárbara d'Oeste, SP</option>
                <option value="other">Outras Cidades</option>
              </select>
              <label for="city" class="absolute text-secondary-light duration-300 transform -translate-y-1.5 scale-75 top-7 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-10 pointer-events-none">
                Cidade / UF
              </label>
            </div>
          </div>

          <div class="relative pt-4 group">
            <div class="flex items-center border-b-2 border-gray-200 focus-within:border-primary transition-colors relative">
              <span class="material-symbols-outlined text-secondary-light group-focus-within:text-primary transition-colors text-xl mr-2">call</span>
              <input type="tel" id="phone" placeholder="(00) 00000-0000" required maxlength="15"
                class="floating-input block w-full py-3 bg-transparent border-0 appearance-none focus:outline-none focus:ring-0 peer text-secondary font-medium placeholder-transparent">
              <label for="phone" class="absolute left-8 text-secondary-light duration-300 transform -translate-y-1.5 scale-75 top-3 -z-10 origin-[0] peer-focus:left-8 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-10 cursor-text">
                WhatsApp (para o certificado)
              </label>
            </div>
            <p class="mt-1 text-xs text-secondary-light/70 flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">lock</span>
              Não enviamos spam. Seus dados estão seguros.
            </p>
          </div>

          <div class="pt-2">
            <label class="flex items-start gap-3 cursor-pointer group">
              <div class="relative flex items-center justify-center mt-0.5">
                <input type="checkbox" id="lgpd-consent" required class="peer sr-only">
                <div class="size-5 rounded border-2 border-gray-300 peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                  <span class="material-symbols-outlined text-white text-[14px] opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
                </div>
              </div>
              <span class="text-xs text-secondary-light leading-snug">
                Eu li e concordo com os <a href="#/terms" target="_blank" class="text-primary font-bold hover:underline">Termos de Uso e Política de Privacidade</a>, autorizando a coleta e tratamento dos meus dados conforme a LGPD.
              </span>
            </label>
          </div>

          <div class="pt-4">
            <button type="submit" class="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-primary hover:bg-primary-hover shadow-warm transition-all duration-300 transform hover:-translate-y-0.5">
              CONTINUAR
              <span class="material-symbols-outlined ml-2 text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>
      
      <!-- Footer of card -->
      <div class="bg-gray-50 rounded-b-xl px-8 py-4 border-t border-gray-100 flex justify-between items-center text-xs text-secondary-light/80">
        <span>Passo 1 de 4</span>
      </div>
    </div>
  `
  container.appendChild(main)

  setTimeout(() => {
    const phoneInput = document.getElementById('phone')

    // Mask logic
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '')
      if (value.length > 11) value = value.slice(0, 11)

      let formatted = ''
      if (value.length > 0) {
        formatted = '(' + value.slice(0, 2)
        if (value.length > 2) {
          formatted += ') ' + value.slice(2, 7)
          if (value.length > 7) {
            formatted += '-' + value.slice(7, 11)
          }
        }
      }
      e.target.value = formatted
    })

    document.getElementById('onboarding-form').addEventListener('submit', (e) => {
      e.preventDefault()

      const phoneRaw = phoneInput.value.replace(/\D/g, '')
      if (phoneRaw.length < 11) {
        alert('Por favor, insira um número de WhatsApp válido com DDD e 9 dígitos.')
        phoneInput.focus()
        return
      }

      const lgpdCheckbox = document.getElementById('lgpd-consent')
      if (!lgpdCheckbox.checked) {
        alert('Para continuar, você precisa aceitar os Termos de Uso e a Política de Privacidade.')
        return
      }

      const participant = {
        nome: document.getElementById('fullname').value,
        idade: parseInt(document.getElementById('age').value, 10),
        cidade_uf: document.getElementById('city').options[document.getElementById('city').selectedIndex].text,
        whatsapp: phoneInput.value,
        lgpd_accepted: true,
        lgpd_timestamp: new Date().toISOString()
      }

      localStorage.setItem('supera_participant', JSON.stringify(participant))
      navigate('/quiz')
    })
  }, 0)

  return container
}