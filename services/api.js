import axios from "axios"
import { useAuth } from "../src/auth"
import { useRouter } from 'next/router'

const api = axios.create({
  baseURL: process.env.API_URL || '/api/v1'
})

export const useAPI = ({suppressAutoRedirect} = {}) => {
  const auth = useAuth()
  const router = useRouter()

  api.interceptors.request.use(async config => {
    if(auth.isAuthenticated())
      config.headers.Authorization = auth.getAuthorization()
    return config;
  }, error => Promise.reject(error));

  api.interceptors.response.use(
    response => response,
    error => {
      if (
        error.request._hasError === true &&
        error.request._response.includes('connect')
      ) {
        alert("Não foi possível conectar aos nossos servidores.\nPor favor, tente mais tarde");
      }
      else {
        const { code, message, status } = error.response.data
        const severity = (function(){
          if(status >= 400 && status < 500) return 'warning'; else
          if(status >= 500 && status < 600) return 'error'
        })()

        switch(code){
          case 'ERR_VALIDATION_FAILED': break;
          case 'ERR_AUTH_TOKEN_EXPIRED':
          case 'ERR_AUTH_TOKEN_INVALID':
            auth.clearCredentials()
            if(!suppressAutoRedirect)
              router.push('/member')

          default:
            snackbar(message , severity, 80 * message.length)
        }
      }
      return Promise.reject(error)
    }
  );

  return api
}

export default api