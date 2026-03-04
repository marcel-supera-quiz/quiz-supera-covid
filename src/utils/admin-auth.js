import { supabase } from '../supabase.js'

/**
 * Sign in an admin user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object|null, error: object|null}>}
 */
export async function adminLogin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { user: data?.user || null, error }
}

/**
 * Sign out the current admin user.
 */
export async function adminLogout() {
    await supabase.auth.signOut()
}

/**
 * Check if there is an active admin session.
 * @returns {Promise<{session: object|null, user: object|null}>}
 */
export async function checkAdminSession() {
    const { data } = await supabase.auth.getSession()
    return {
        session: data?.session || null,
        user: data?.session?.user || null
    }
}

/**
 * Send a password reset email.
 * @param {string} email
 * @returns {Promise<{error: object|null}>}
 */
export async function resetPassword(email) {
    const redirectUrl = import.meta.env.VITE_ADMIN_REDIRECT_URL || window.location.origin + '/#/admin/login'
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
    })
    return { error }
}
