import axios from "axios"
import useAuth from "./useAuth"
import { useRouter } from 'next/router'

const useAPI = ({suppressRedirect = false} = {}) => {
  const auth = useAuth()
  const router = useRouter()

  const api = axios.create({
    baseURL: process.env.API_URL || '/api/v1'
  })

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
      else
      if(error.response.status === 401){
        if(auth.isAuthenticated()){
          snackbar("O seu token expirou\nPor favor, efetue o login novamente", "error", 5000)
          auth.clearCredentials();
        }
        else{
          snackbar("Por favor, efetue o login para continuar", "error", 5000)
        }

        if(!suppressRedirect){
          sessionStorage.setItem('redirectPostLogin', router.pathname)
          router.push('/login')
        }
      }
      return Promise.reject(error)
    }
  );

  return api
}

export default useAPI