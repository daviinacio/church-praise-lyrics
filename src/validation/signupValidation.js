import Validator from 'rest-payload-validator'

const signupValidation = Validator.builder()
.rules({
  'name': "min:4|max:128|required",
  'username': "min:4|max:64|required",
  'email': "max:128|email|required",
  "password": "min:6|required"
})
.messages({
  'required': "Campo obrigatório",

  'name': {
    'min': "Informe um nome com no mínimo 4 caracteres",
    'max': "O nome pode ter no máximo 128 caracteres",
  },
  'username': {
    'min': "A senha deve der no mínimo 4 caracteres",
    'max': "A senha deve der no máximo 64 caracteres",
  },
  'email': {
    'email': "Digite um email válido",
    'max': "O endereço de email deve ter no máximo 128 caracteres"
  },
  'password': {
    'min': "A senha deve der no mínimo 6 caracteres"
  }
})

export default signupValidation