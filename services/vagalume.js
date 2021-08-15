import axios from "axios"

const vagalume = axios.create({
  baseURL: 'https://api.vagalume.com.br/'
})

export const useVagalume = () => {
  return vagalume
}

export default vagalume