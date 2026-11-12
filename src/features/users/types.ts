import type { Pagination } from '../../shared/api/types'
import type { Role } from '../access-control/types'

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  is_active: boolean
  role: Role
}
export interface UserEditRequest {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string | null
}

export interface UserRequest {
  first_name: string
  last_name: string
  email: string
  password: string
  phone: string | null
  role_id: string
}
export interface UsersResponse {
  items: User[]
  pagination: Pagination
}

export interface UsersQueryParams {
  page?: number
  page_size?: number
  search?: string
  sort?: string
  is_active?: boolean
  role?: string
}
