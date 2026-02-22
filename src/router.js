import renderLanding from './screens/landing.js'
import renderOnboarding from './screens/onboarding.js'
import renderQuiz from './screens/quiz.js'
import renderAnalysis from './screens/analysis.js'
import renderRewards from './screens/rewards.js'

const routes = {
    '/': renderLanding,
    '/onboarding': renderOnboarding,
    '/quiz': renderQuiz,
    '/analysis': renderAnalysis,
    '/rewards': renderRewards
}

export function navigate(path, data = null) {
    window.history.pushState(data, '', '#' + path)
    handleRoute()
}

export function handleRoute() {
    const path = window.location.hash.replace('#', '') || '/'
    const appHandle = document.getElementById('app')

    const renderFn = routes[path]
    if (renderFn) {
        appHandle.innerHTML = ''
        appHandle.appendChild(renderFn(window.history.state))
    } else {
        navigate('/')
    }
}

export function initRouter() {
    window.addEventListener('popstate', handleRoute)
    handleRoute()
}