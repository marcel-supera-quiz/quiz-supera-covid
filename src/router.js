import renderLanding from './screens/landing.js'
import renderOnboarding from './screens/onboarding.js'
import renderQuiz from './screens/quiz.js'
import renderAnalysis from './screens/analysis.js'
import renderRewards from './screens/rewards.js'
import renderThankYou from './screens/thank-you.js'
import renderTerms from './screens/terms.js'
import renderAdminLogin from './screens/admin-login.js'
import renderAdminForgotPassword from './screens/admin-forgot-password.js'
import renderAdminDashboard from './screens/admin-dashboard.js'
import renderAdminUserDetail from './screens/admin-user-detail.js'
import { checkAdminSession } from './utils/admin-auth.js'

// Public routes (no auth required)
const publicRoutes = {
    '/': renderLanding,
    '/onboarding': renderOnboarding,
    '/quiz': renderQuiz,
    '/analysis': renderAnalysis,
    '/rewards': renderRewards,
    '/thank-you': renderThankYou,
    '/terms': renderTerms,
    '/admin/login': renderAdminLogin,
    '/admin/forgot-password': renderAdminForgotPassword
}

// Protected admin routes (require authentication)
const protectedRoutes = {
    '/admin/dashboard': renderAdminDashboard,
    // '/admin/user/:id' is handled dynamically below
}

export function navigate(path, data = null) {
    window.history.pushState(data, '', '#' + path)
    handleRoute()
}

export async function handleRoute() {
    const hash = window.location.hash.replace('#', '') || '/'
    const appHandle = document.getElementById('app')

    // Check for dynamic admin user detail route: /admin/user/<id>
    const userDetailMatch = hash.match(/^\/admin\/user\/(.+)$/)

    // --- Public routes ---
    if (publicRoutes[hash]) {
        appHandle.innerHTML = ''
        appHandle.appendChild(publicRoutes[hash](window.history.state))
        return
    }

    // --- Protected routes ---
    const isProtected = protectedRoutes[hash] || userDetailMatch

    if (isProtected) {
        const { session } = await checkAdminSession()
        if (!session) {
            navigate('/admin/login')
            return
        }

        appHandle.innerHTML = ''

        if (userDetailMatch) {
            const participantId = userDetailMatch[1]
            appHandle.appendChild(renderAdminUserDetail({ participantId }))
        } else {
            appHandle.appendChild(protectedRoutes[hash](window.history.state))
        }
        return
    }

    // --- Fallback ---
    navigate('/')
}

export function initRouter() {
    window.addEventListener('popstate', handleRoute)
    handleRoute()
}