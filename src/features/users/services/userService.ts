import apiClient from '../../../shared/api/apiClient'
import type {
  User,
  UserEditRequest,
  UserRequest,
  UsersQueryParams,
  UsersResponse,
} from '../types'

export async function getUsers(
  params: UsersQueryParams,
  signal: AbortSignal,
): Promise<UsersResponse> {
  const response = await apiClient.get<UsersResponse>('/users/', {
    params,
    signal,
  })
  return response.data
}
export async function getUser(
  userId: string,
  signal: AbortSignal,
): Promise<User> {
  const response = await apiClient.get<User>(`/users/${userId}`, {
    signal,
  })

  return response.data
}
export async function createUser(payload: UserRequest): Promise<User> {
  const response = await apiClient.post<User>('/users/', payload)
  return response.data
}

export async function editUser(userId: string, payload: UserEditRequest) {
  const response = await apiClient.patch<User>(`/users/${userId}`, payload)
  return response.data
}
export async function changeUserStatus(
  userId: string,
  isActive: boolean,
): Promise<User> {
  const response = await apiClient.patch<User>(`/users/${userId}/status`, {
    is_active: isActive,
  })
  return response.data
}
export async function changeRole(
  userId: string,
  roleId: string,
): Promise<User> {
  const response = await apiClient.patch<User>(`/users/${userId}/role`, {
    role_id: roleId,
  })
  return response.data
}

export async function deleteUser(userId: string): Promise<void> {
  await apiClient.delete(`/users/${userId}`)
}
