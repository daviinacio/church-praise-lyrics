export const useAuth = () => {
  const getUser = () => {
    if(typeof localStorage === 'undefined') return null
    return JSON.parse(localStorage.getItem('auth_user'))
  }

  const saveCredentials = (user, token) => {
    if(typeof localStorage === 'undefined') return;
    localStorage.setItem('auth_user', JSON.stringify(user))
    localStorage.setItem('auth_token', JSON.stringify(token))
  }

  const clearCredentials = () => {
    if(typeof localStorage === 'undefined') return;
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  const getAuthorization = () => {
    if(typeof localStorage === 'undefined') return ''
    const token = JSON.parse(localStorage.getItem('auth_token'))
    
    return `${token.type} ${token.assess_token}`
  }

  const isAuthenticated = () => {
    if(typeof localStorage === 'undefined') return false
    const user = getUser()
    return user ? true : false
  }

  return {
    getUser,
    saveCredentials,
    clearCredentials,
    getAuthorization,
    isAuthenticated
  }
}