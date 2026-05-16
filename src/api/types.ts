export type User = {
  auth0Id: string
  email: string
  name?: string
  username: string
  rol?: string
}

export type UpdateUser = {
  name: string
  username: string
  rol: string
}

// Usado por el formulario admin (backend obtiene auth0Id del JWT)
export type CreateUserRequestType = {
  email: string
  name: string
  username: string
  rol: string
}

// Usado por AuthCallBackPage tras el primer login de Auth0
export type AuthCallbackUserType = {
  auth0Id: string
  email: string
  username: string
}
