export const RouteNotFoundError = {
  code: 'ERR_ROUTE_NOT_FOUND',
  message: 'The route you trying to access does not exists'
}

export const UserNotFoundError = {
  code: 'ERR_USER_NOT_FOUND',
  message: 'There\'s no user with this id, email or username'
}

export const PostNotFoundError = {
  code: 'ERR_POST_NOT_FOUND',
  message: 'There\'s no post with this id or reference'
}

export const TagNotFoundError = {
  code: 'ERR_TAG_NOT_FOUND',
  message: 'There\'s no tag with this id or reference'
}

export const RoleNotFoundError = {
  code: 'ERR_ROLE_NOT_FOUND',
  message: 'There\'s no role with this id or reference'
}

export const ValidationFailedError = {
  code: 'ERR_VALIDATION_FAILED',
  message: 'Some input data was failed on validation'
}

export const EmptyBodyRequestError = {
  code: 'ERR_EMPTY_BODY_REQUEST',
  message: 'This route needs at least one parameter'
}

export const SqlDuplicatedEntryError = {
  code: 'ERR_SQL_DUPLICATED_ENTRY',
  message: 'This entry can not be duplicated'
}

export const UnauthorizedError = {
  code: 'ERR_UNAUTHORIZED',
  message: 'You need authorization to access this endpoint'
}

export const AuthTokenInvalidError = {
  code: 'ERR_AUTH_TOKEN_INVALID',
  message: 'Your token is not valid'
}

export const AuthTokenExpiredError = {
  code: 'ERR_AUTH_TOKEN_EXPIRED',
  message: 'Your token expired'
}

export const DontHavePermissionError = {
  code: 'ERR_DONT_HAVE_PERMISSION',
  message: 'You don\'t have permission to proceed'
}

export const TooManyActiveSessions = {
  code: 'ERR_TOO_MANY_ACTIVE_SESSIONS',
  message: 'There is too many active sessions on different IPs'
}

export const HttpErrorCodes = {
  400: {
    title: "Parâmetros inválidos",
    message: "Não foi possivel encontrar o conteúdo requerido"
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
  const status_by_code = {
    'ERR_ROUTE_NOT_FOUND': 404,
    'ERR_USER_NOT_FOUND': 400,
    'ERR_POST_NOT_FOUND': 400,
    'ERR_TAG_NOT_FOUND': 400,
    'ERR_ROLE_NOT_FOUND': 400,
    'ERR_VALIDATION_FAILED': 400,
    'ERR_EMPTY_BODY_REQUEST': 400,
    'ERR_SQL_DUPLICATED_ENTRY': 400,
    'ERR_UNAUTHORIZED': 401,
    'ERR_AUTH_TOKEN_INVALID': 401,
    'ERR_AUTH_TOKEN_EXPIRED': 401,
    'ERR_DONT_HAVE_PERMISSION': 403,
    'ERR_TOO_MANY_ACTIVE_SESSIONS': 401
  };

  return status_by_code[code] || 500;
}

export default {
  status
}