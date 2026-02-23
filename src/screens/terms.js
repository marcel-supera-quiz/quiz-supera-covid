import { navigate } from '../router.js'
import headerComponent from '../components/header.js'

export default function renderTerms() {
  const container = document.createElement('div')
  container.className = 'w-full min-h-screen flex flex-col bg-background-light'

  container.appendChild(headerComponent())

  const main = document.createElement('main')
  main.className = 'flex-grow flex flex-col items-center justify-start py-8 px-4 md:py-12 mt-16 max-w-[960px] mx-auto w-full'

  main.innerHTML = `
    <div class="bg-white rounded-2xl shadow-warm p-6 md:p-10 w-full animate-fade-in-up mb-8">
      <h1 class="text-secondary text-2xl md:text-3xl font-extrabold mb-6 uppercase tracking-tight">Termos de Uso e Política de Privacidade (LGPD)</h1>
      
      <div class="prose prose-orange max-w-none text-secondary-light space-y-4">
        <p><strong>Última atualização: Fevereiro de 2026</strong></p>
        
        <h2 class="text-xl font-bold text-secondary mt-6">1. Aceitação dos Termos</h2>
        <p>Ao utilizar o Quiz do Método Supera, você concorda com a coleta e uso das suas informações pessoais e resultados cognitivos conforme descrito nesta política. Nossa plataforma preza pela segurança dos seus dados em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>

        <h2 class="text-xl font-bold text-secondary mt-6">2. Coleta de Dados</h2>
        <p>Coletamos as seguintes informações para viabilizar nossa avaliação e a emissão do seu certificado ou agendamento de atendimento na unidade do Método Supera mais próxima de você: </p>
        <ul class="list-disc pl-5">
            <li><strong>Dados Pessoais Iniciais:</strong> Nome completo, Idade, Cidade e Estado.</li>
            <li><strong>Contato:</strong> Número de WhatsApp.</li>
            <li><strong>Dados Sensíveis de Saúde:</strong> Respostas às perguntas sobre o impacto cognitivo e físico percebido após a infecção pela Covid-19, incluindo fadiga, foco, memória e histórico de sintomas/internação.</li>
        </ul>

        <h2 class="text-xl font-bold text-secondary mt-6">3. Finalidade do Uso dos Dados</h2>
        <p>Utilizamos os dados coletados exclusivamente para:</p>
        <ul class="list-disc pl-5">
            <li>Gerar a sua análise de impacto cognitivo e seu certificado digital de participação de maneira personalizada.</li>
            <li>Permitir o contato da equipe do Método Supera com o objetivo de agendar um atendimento com um especialista para uma avaliação gratuita presencial, se você tiver optado por isso.</li>
            <li>Melhorar continuamente a eficácia da nossa ferramenta.</li>
        </ul>

        <h2 class="text-xl font-bold text-secondary mt-6">4. Compartilhamento e Segurança</h2>
        <p>Seus dados são armazenados de forma segura em nossos servidores. Não comercializamos, vendemos ou compartilhamos seus dados com terceiros além dos desenvolvedores e da equipe interna de especialistas Supera. Todas as transferências de dados são criptografadas (SSL/HTTPS).</p>

        <h2 class="text-xl font-bold text-secondary mt-6">5. Seus Direitos (LGPD)</h2>
        <p>Conforme o Artigo 18 da LGPD, garantimos a você o direito de:</p>
        <ul class="list-disc pl-5">
            <li>Confirmar a existência de tratamento de seus dados.</li>
            <li>Acessar ou corrigir dados incompletos, inexatos ou desatualizados.</li>
            <li>Solicitar a anonimização, bloqueio ou eliminação de seus dados através do nosso suporte.</li>
            <li>Revogar seu consentimento a qualquer momento de forma expressa.</li>
        </ul>
        
        <p class="mt-8 font-bold">Contato do Encarregado (DPO):<br> <a href="mailto: marcel.superanovaodessa@metodosupera.com.br" class="text-primary underline">marcel.superanovaodessa@metodosupera.com.br</a></p>
      </div>
      
      <div class="mt-10 pt-6 border-t border-gray-100 flex justify-center">
        <button id="back-btn" class="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5">
          <span class="material-symbols-outlined">arrow_back</span>
          Voltar para Início
        </button>
      </div>
    </div>
  `
  container.appendChild(main)

  setTimeout(() => {
    document.getElementById('back-btn').addEventListener('click', () => {
      navigate('/')
    })
  }, 0)

  return container
}