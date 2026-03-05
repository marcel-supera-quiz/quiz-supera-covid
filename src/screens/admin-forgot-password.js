import { resetPassword } from '../utils/admin-auth.js'
import logoImg from '../assets/logo-light.png'

export default function renderAdminForgotPassword() {
  const container = document.createElement('div')
  container.className = 'admin-login-page'

  container.innerHTML = `
    <div class="admin-login-bg">
      <div class="admin-login-card animate-fade-in-up">
        <!-- Logo -->
        <div class="admin-login-logo flex justify-center">
          <img src="${logoImg}" alt="Supera | Mente Ativa" class="admin-logo-img" />
        </div>

        <div class="admin-login-header">
          <span class="material-symbols-outlined admin-login-icon">lock_reset</span>
          <h1>Recuperar Senha</h1>
          <p>Informe seu email cadastrado e enviaremos um link para redefinir sua senha.</p>
        </div>

        <!-- Reset Form -->
        <form id="reset-form" class="admin-login-form">
          <div class="admin-input-group">
            <span class="material-symbols-outlined admin-input-icon">mail</span>
            <input type="email" id="reset-email" placeholder="Seu email de administrador" required autocomplete="email" />
          </div>

          <div id="reset-error" class="admin-error hidden"></div>
          <div id="reset-success" class="admin-success hidden"></div>

          <button type="submit" id="reset-submit-btn" class="admin-btn-primary">
            <span>ENVIAR LINK</span>
            <span class="material-symbols-outlined">send</span>
          </button>
        </form>

        <a href="#/admin/login" class="admin-forgot-link">
          <span class="material-symbols-outlined">arrow_back</span>
          Voltar para o login
        </a>

        <div class="admin-login-footer">
          <span class="material-symbols-outlined" style="font-size: 14px;">info</span>
          Verifique sua caixa de spam se não receber o email
        </div>
      </div>
    </div>
  `

  setTimeout(() => {
    document.getElementById('reset-form').addEventListener('submit', async (e) => {
      e.preventDefault()

      const email = document.getElementById('reset-email').value.trim()
      const errorEl = document.getElementById('reset-error')
      const successEl = document.getElementById('reset-success')
      const submitBtn = document.getElementById('reset-submit-btn')

      errorEl.classList.add('hidden')
      successEl.classList.add('hidden')
      submitBtn.disabled = true
      submitBtn.innerHTML = '<span class="admin-spinner"></span> Enviando...'

      const { error } = await resetPassword(email)

      if (error) {
        errorEl.textContent = error.message || 'Erro ao enviar email. Tente novamente.'
        errorEl.classList.remove('hidden')
        submitBtn.disabled = false
        submitBtn.innerHTML = '<span>ENVIAR LINK</span><span class="material-symbols-outlined">send</span>'
        return
      }

      successEl.innerHTML = `
        <span class="material-symbols-outlined" style="font-size: 20px; vertical-align: middle;">check_circle</span>
        Email enviado com sucesso! Verifique sua caixa de entrada de <strong>${email}</strong>.
      `
      successEl.classList.remove('hidden')
      submitBtn.disabled = true
      submitBtn.innerHTML = '<span class="material-symbols-outlined">check</span> Enviado'
    })
  }, 0)

  return container
}
