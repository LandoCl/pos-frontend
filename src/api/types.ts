export type User = {
  auth0Id: string
  email: string
  username: string
}

export type UpdateUser = {
  name: string
  username: string
  rol: string
}

export type CreateUserRequestType = {
  email: string
  name: string
  username: string
  rol: string
}
