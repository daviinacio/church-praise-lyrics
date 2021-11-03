import { PraiseStatus } from '.prisma/client'
import Validator from 'rest-payload-validator'
import { toneValues, transposeValues } from '../globals'

Validator.custom('includes', (key, value, param) => {
  if(param === 'transpose' && !transposeValues.includes(value))
    return `This field is not a valid transpose value`
  else
  if(param === 'tone' && !toneValues.includes(value))
    return `This field is not a valid tone value`
  else
  if(param === 'status' && !(value in PraiseStatus))
    return `This field is not a valid status value`
})

const messages = {
  'required': "Campo obrigatório",
  'name': {
    'required': "Informe o nome do louvor",
    'min': "Digite pelo menos 3 caracteres"
  },
  'artist': {
    'required': "Informe o nome do(a) cantor(a)",
    'min': "Digite pelo menos 3 caracteres"
  },
  'transpose': {
    'includes': "Informe um nível de transpose válido"
  },
  'tone': {
    'includes': "Informe um tom válido"
  },
  'status': {
    'includes': "Informe um status válido"
  }
}

export const newPraiseValidator = Validator.builder()
.messages(messages)
.rules({
  'name': "min:3|string|required",
  'artist': "min:3|string|required",
  'transpose': "includes:transpose|integer",
  'tone': "includes:tone|string"
})

export const editPraiseValidator = Validator.builder()
.messages(messages)
.rules({
  'name': "min:3|string",
  'artist': "min:3|string",
  'transpose': "includes:transpose|integer",
  'tone': "includes:tone|string",
  'status': "includes:status|string"
})