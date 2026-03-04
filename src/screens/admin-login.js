import { adminLogin } from '../utils/admin-auth.js'
import { navigate } from '../router.js'
import logoImg from '../assets/logo.png'

export default function renderAdminLogin() {
    const container = document.createElement('div')
    container.className = 'admin-login-page'

    container.innerHTML = `
    <div class="admin-login-bg">
      <div class="admin-login-card animate-fade-in-up">
        <!-- Logo -->
        <div class="admin-login-logo">
          <img src="${logoImg}" alt="Supera" class="admin-logo-img" />
        </div>

        <div class="admin-login-header">
          <span class="material-symbols-outlined admin-login-icon">shield_person</span>
          <h1>Painel Administrativo</h1>
          <p>Acesse com suas credenciais de administrador</p>
        </div>

        <form id="admin-login-form" class="admin-login-form">
          <div class="admin-input-group">
            <span class="material-symbols-outlined admin-input-icon">mail</span>
            <input type="email" id="admin-email" placeholder="Email" required autocomplete="email" />
          </div>

          <div class="admin-input-group">
            <span class="material-symbols-outlined admin-input-icon">lock</span>
            <input type="password" id="admin-password" placeholder="Senha" required autocomplete="current-password" />
            <button type="button" id="toggle-pw" class="admin-pw-toggle" tabindex="-1">
              <span class="material-symbols-outlined">visibility</span>
            </button>
          </div>

          <div id="login-error" class="admin-error hidden"></div>

          <button type="submit" id="login-submit-btn" class="admin-btn-primary">
            <span>ENTRAR</span>
            <span class="material-symbols-outlined">login</span>
          </button>
        </form>

        <a href="#/admin/forgot-password" class="admin-forgot-link">
          <span class="material-symbols-outlined">help</span>
          Esqueci minha senha
        </a>

        <div class="admin-login-footer">
          <span class="material-symbols-outlined" style="font-size: 14px;">lock</span>
          Acesso restrito a administradores autorizados
        </div>
      </div>
    </div>
  `

    setTimeout(() => {
        // Toggle password visibility
        const pwInput = document.getElementById('admin-password')
        document.getElementById('toggle-pw').addEventListener('click', () => {
            const isPassword = pwInput.type === 'password'
            pwInput.type = isPassword ? 'text' : 'password'
            document.querySelector('#toggle-pw .material-symbols-outlined').textContent =
                isPassword ? 'visibility_off' : 'visibility'
        })

        // Form submit
        document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
            e.preventDefault()

            const email = document.getElementById('admin-email').value.trim()
            const password = document.getElementById('admin-password').value
            const errorEl = document.getElementById('login-error')
            const submitBtn = document.getElementById('login-submit-btn')

            errorEl.classList.add('hidden')
            submitBtn.disabled = true
            submitBtn.innerHTML = '<span class="admin-spinner"></span> Entrando...'

            const { user, error } = await adminLogin(email, password)

            if (error) {
                errorEl.textContent = error.message === 'Invalid login credentials'
                    ? 'Email ou senha inválidos. Tente novamente.'
                    : error.message || 'Erro ao fazer login. Tente novamente.'
                errorEl.classList.remove('hidden')
                submitBtn.disabled = false
                submitBtn.innerHTML = '<span>ENTRAR</span><span class="material-symbols-outlined">login</span>'
                return
            }

            if (user) {
                navigate('/admin/dashboard')
            }
        })
    }, 0)

    return container
}
