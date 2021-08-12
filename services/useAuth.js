const useAuth = () => {
  const getUser = () => {
    return JSON.parse(localStorage.getItem('auth_user'))
  }

  const saveCredentials = (user, token) => {
    localStorage.setItem('auth_user', JSON.stringify(user))
    localStorage.setItem('auth_token', JSON.stringify(token))
  }

  const clearCredentials = () => {
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  const getAuthorization = () => {
    const token = JSON.parse(localStorage.getItem('auth_token'))
    
    return `${token.type} ${token.assess_token}`
  }

  const isAuthenticated = () => {
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

export default useAuth