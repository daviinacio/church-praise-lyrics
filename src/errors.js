export const RouteNotFoundError = {
  status: 404,
  code: 'ERR_ROUTE_NOT_FOUND',
  message: 'The route you trying to access does not exists'
}

export const UserNotFoundError = {
  status: 400,
  code: 'ERR_USER_NOT_FOUND',
  message: 'There\'s no user with this id, email or username',
  result: null
}

export const PostNotFoundError = {
  status: 400,
  code: 'ERR_POST_NOT_FOUND',
  message: 'There\'s no post with this id or reference',
  result: null
}

export const TagNotFoundError = {
  status: 400,
  code: 'ERR_TAG_NOT_FOUND',
  message: 'There\'s no tag with this id or reference',
  result: null
}

export const RoleNotFoundError = {
  status: 400,
  code: 'ERR_ROLE_NOT_FOUND',
  message: 'There\'s no role with this id or reference',
  result: null
}

export const ValidationFailedError = {
  status: 400,
  code: 'ERR_VALIDATION_FAILED',
  message: 'Some input data was failed on validation',
  result: null
}

export const EmptyBodyRequestError = {
  status: 400,
  code: 'ERR_EMPTY_BODY_REQUEST',
  message: 'This route needs at least one parameter',
  result: null
}

export const SqlDuplicatedEntryError = {
  status: 400,
  code: 'ERR_SQL_DUPLICATED_ENTRY',
  message: 'This entry can not be duplicated',
  result: null
}

export const UnauthorizedError = {
  status: 401,
  code: 'ERR_UNAUTHORIZED',
  message: 'Essa ação só é permitida para membros autenticados\nPor favor, faça login e tente novamente',
  result: null
}

export const AuthTokenInvalidError = {
  status: 401,
  code: 'ERR_AUTH_TOKEN_INVALID',
  message: 'Your token is not valid',
  result: null
}

export const AuthTokenExpiredError = {
  status: 401,
  code: 'ERR_AUTH_TOKEN_EXPIRED',
  message: 'Seu login expirou\nPor favor, efetue o login novamente caso queira efetuar alguma ação no aplicativo',
  result: null
}

export const TooManyActiveSessions = {
  status: 401,
  code: 'ERR_TOO_MANY_ACTIVE_SESSIONS',
  message: 'There is too many active sessions on different IPs',
  result: null
}

export const DontHavePermissionError = {
  status: 403,
  code: 'ERR_DONT_HAVE_PERMISSION',
  message: 'Infelizmente, você não tem permissão para realizar essa ação\nPor favor, entre em contato com o membro responsável pela administração do aplicativo',
  result: null
}

export const FutureFeatureError = {
  status: 501,
  code: 'ERR_FUTURE_FEATURE',
  message: 'Essa funcionalidade ainda não foi implementada',
  result: null
}

export const HttpErrorCodes = {
  400: {
    title: "Parâmetros inválidos",
    message: "Não foi possível encontrar o conteúdo requerido"
  },
  401: {
    title: "Autenticação necessária",
    message: "Você precisa estar autenticado para acessar essa página"
  },
  403: {
    title: "Acesso negado",
    message: "Você não tem permissão para acessar essa página"
  },
  404: {
    title: "Error 404",
    message: "Página não encontrada"
  },
  406: {
    title: "Error 406",
    message: "Conteúdo não encontrado"
  },
  500: {
    title: "Internal Server Error",
    message: "Um erro inesperado aconteceu ao requisitar o servidor"
  },
  501: {
    title: "Não implementado",
    message: "Essa parte ainda não foi implementada"
  }
}

const status = (code) => {
  const erros = [
    RouteNotFoundError,
    UserNotFoundError,
    PostNotFoundError,
    TagNotFoundError,
    RoleNotFoundError,
    ValidationFailedError,
    EmptyBodyRequestError,
    SqlDuplicatedEntryError,
    UnauthorizedError,
    AuthTokenInvalidError,
    AuthTokenExpiredError,
    TooManyActiveSessions,
    DontHavePermissionError,
    FutureFeatureError
  ]

  return (erros.filter(err => err.code === code)[0] || { status:  500 }).status
}

export default {
  status
}