import apiClient from '../../../shared/api/apiClient'
import type { Role } from '../types'

export async function getRoles(): Promise<Role[]> {
  const response = await apiClient.get<Role[]>('/roles/')

  return response.data
}

export async function getRole(roleId: string): Promise<Role> {
  const response = await apiClient.get<Role>(`/roles/${roleId}`)

  return response.data
}

export async function createRole(payload: {
  name: string
  description: string
  level: number
}) {
  const response = await apiClient.post<Role>('/roles/', payload)
  return response.data
}

export async function editRole(
  roleId: string,
  payload: {
    name?: string
    description?: string
    level?: number
  },
): Promise<Role> {
  const response = await apiClient.patch<Role>(`/roles/${roleId}`, payload)
  return response.data
}
export async function addPermissionToRole(
  roleId: string,
  permissionId: string,
): Promise<Role> {
  const response = await apiClient.post<Role>(`/roles/${roleId}/permissions`, {
    permission_id: permissionId,
  })
  return response.data
}

export async function removePermissionFromRole(
  roleId: string,
  permissionId: string,
): Promise<Role> {
  const response = await apiClient.delete<Role>(
    `/roles/${roleId}/permissions/${permissionId}`,
  )
  return response.data
}

export async function deleteRole(roleId: string): Promise<void> {
  await apiClient.delete(`/roles/${roleId}`)
}
