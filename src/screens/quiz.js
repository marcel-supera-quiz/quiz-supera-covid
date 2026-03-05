import { navigate } from '../router.js'
import { questions } from '../logic/questions.js'
import brainIcon from '../assets/favicon.png'
import headerComponent from '../components/header.js'

export default function renderQuiz() {
  const container = document.createElement('div')
  container.className = 'w-full min-h-screen flex flex-col bg-background-light'

  container.appendChild(headerComponent('light'))

  const main = document.createElement('main')
  main.className = 'flex-1 flex flex-col items-center justify-center px-4 py-8 md:px-6 w-full max-w-4xl mx-auto'
  container.appendChild(main)

  let currentIndex = 0
  const total = questions.length
  const responses = {} // key: val

  function renderQuestion() {
    const q = questions[currentIndex]
    const percent = Math.round((currentIndex / total) * 100)

    // Clear main
    main.innerHTML = ''

    // Progress
    main.innerHTML += `
      <div class="w-full max-w-2xl mb-8 md:mb-12">
        <div class="flex justify-between items-end mb-3 px-1">
          <span class="text-secondary font-bold text-lg">Questão ${currentIndex + 1} de ${total}</span>
          <span class="text-secondary-light text-sm font-medium">${percent}% concluído</span>
        </div>
        <div class="h-3 w-full bg-[#e8d7ce] rounded-full overflow-hidden">
          <div class="h-full bg-primary rounded-full transition-all duration-500 ease-out" style="width: ${percent === 0 ? 5 : percent}%"></div>
        </div>
      </div>
    `

    // Question Box
    const qContainer = document.createElement('div')
    qContainer.className = 'w-full max-w-2xl animate-fade-in transition-opacity'

    let answerHtml = ''
    if (q.type === 'scale') {
      answerHtml = `
        <div class="flex flex-col items-center gap-8">
          <div class="flex flex-wrap justify-center gap-3 md:gap-6 w-full">
            ${[1, 2, 3, 4, 5].map(v => `
              <label class="cursor-pointer group">
                <input type="radio" name="${q.key}" value="${v}" class="peer sr-only radio-circle" ${responses[q.key] === v ? 'checked' : ''}>
                <div class="size-12 md:size-16 rounded-full border-2 border-orange-200 bg-white text-secondary font-bold text-lg md:text-xl flex items-center justify-center transition-all duration-200 hover:border-primary peer-focus:ring-2 peer-focus:ring-primary/50 group-hover:scale-105 shadow-sm">
                    ${v}
                </div>
              </label>
            `).join('')}
          </div>
        </div>
      `
    } else if (q.type === 'multi') {
      const selectedArr = responses[q.key] || []
      answerHtml = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-6">
          ${q.options.map(opt => `
            <label class="cursor-pointer group">
              <input type="checkbox" name="${q.key}" value="${opt}" class="peer sr-only checkbox-pill" ${selectedArr.includes(opt) ? 'checked' : ''}>
              <div class="bg-background-light border-2 border-transparent hover:border-primary/30 text-secondary font-medium px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)] peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary">
                <span>${opt}</span>
              </div>
            </label>
          `).join('')}
        </div>
      `
    } else if (q.type === 'yesno') {
      answerHtml = `
        <div class="flex justify-center gap-6 w-full mt-6">
          ${['Sim', 'Não'].map(opt => `
            <label class="cursor-pointer group w-32">
              <input type="radio" name="${q.key}" value="${opt === 'Sim' ? 'true' : 'false'}" class="peer sr-only radio-circle" ${responses[q.key] === (opt === 'Sim') ? 'checked' : ''}>
              <div class="bg-white border-2 border-orange-200 text-secondary font-bold px-6 py-4 rounded-xl flex justify-center transition-all duration-200 shadow-sm hover:border-primary peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary group-hover:scale-105">
                ${opt}
              </div>
            </label>
          `).join('')}
        </div>
      `
    } else if (q.type === 'select') {
      answerHtml = `
        <div class="flex flex-col gap-4 w-full mt-6">
          ${q.options.map(opt => `
            <label class="cursor-pointer group">
              <input type="radio" name="${q.key}" value="${opt.value}" class="peer sr-only radio-circle" ${responses[q.key] === opt.value ? 'checked' : ''}>
              <div class="bg-white border-2 border-orange-200 text-secondary font-medium px-6 py-4 rounded-xl flex items-center transition-all duration-200 shadow-sm hover:border-primary peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary">
                ${opt.label}
              </div>
            </label>
          `).join('')}
        </div>
      `
    } else if (q.type === 'text') {
      answerHtml = `
        <div class="w-full mt-6">
          <textarea id="textResponse" rows="4" class="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary resize-none" placeholder="Digite aqui sua resposta livre...">${responses[q.key] || ''}</textarea>
        </div>
      `
    }

    qContainer.innerHTML = `
      <div class="bg-surface rounded-2xl md:rounded-[2rem] shadow-warm p-6 md:p-12 mb-8 border border-orange-100/50">
        <h1 class="text-2xl md:text-3xl font-bold text-secondary text-center mb-4 leading-tight">${q.text}</h1>
        <p class="text-secondary-light text-center mb-10 text-lg">${q.subtitle}</p>
        ${answerHtml}
      </div>
      <div class="flex items-center justify-between mt-8 px-2 md:px-0">
        <button id="prev-btn" class="flex items-center gap-2 text-secondary-light hover:text-secondary font-bold px-4 py-2 rounded-lg transition-colors group ${currentIndex === 0 ? 'invisible' : ''}">
          <span class="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-1">arrow_back</span>
          <span>Anterior</span>
        </button>
        <button id="next-btn" class="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200">
          <span>${currentIndex === total - 1 ? 'FINALIZAR' : 'PRÓXIMO'}</span>
          <span class="material-symbols-outlined text-xl">${currentIndex === total - 1 ? 'check' : 'arrow_forward'}</span>
        </button>
      </div>
    `
    main.appendChild(qContainer)

    // Handlers
    setTimeout(() => {
      document.getElementById('prev-btn')?.addEventListener('click', () => {
        saveCurrentResponse()
        if (currentIndex > 0) currentIndex--
        renderQuestion()
      })

      document.getElementById('next-btn')?.addEventListener('click', () => {
        const hasAnswered = saveCurrentResponse()
        // Require answer
        if (!hasAnswered && q.type !== 'text') {
          alert("Por favor, selecione uma resposta para continuar.")
          return
        }

        if (currentIndex < total - 1) {
          currentIndex++
          renderQuestion()
        } else {
          // Finish quiz
          localStorage.setItem('supera_responses', JSON.stringify(responses))
          navigate('/analysis')
        }
      })
    }, 0)
  }

  function saveCurrentResponse() {
    const q = questions[currentIndex]
    let answered = false

    if (q.type === 'multi') {
      const inputs = document.querySelectorAll(`input[name="${q.key}"]:checked`)
      responses[q.key] = Array.from(inputs).map(i => i.value)
      if (responses[q.key].length > 0) answered = true
    } else if (q.type === 'text') {
      const val = document.getElementById('textResponse').value
      responses[q.key] = val
      answered = true // Text is optional
    } else {
      const input = document.querySelector(`input[name="${q.key}"]:checked`)
      if (input) {
        let val = input.value
        if (q.type === 'scale') val = parseInt(val, 10)
        else if (q.type === 'yesno') val = (val === 'true')
        responses[q.key] = val
        answered = true
      }
    }
    return answered
  }

  setTimeout(() => {
    document.getElementById('sair-btn').addEventListener('click', () => {
      if (confirm("Deseja cancelar o teste? Suas respostas serão perdidas.")) {
        localStorage.clear()
        navigate('/')
      }
    })
  }, 0)

  // Initial render
  renderQuestion()

  return container
}
