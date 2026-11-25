import apiClient from '../../../shared/api/apiClient'
import type { Permission } from '../types'

export async function getPermissions(): Promise<Permission[]> {
  const response = await apiClient.get<Permission[]>('/permissions/')

  return response.data
}

export async function getPermission(permissionId: string): Promise<Permission> {
  const response = await apiClient.get<Permission>(
    `/permissions/${permissionId}`,
  )

  return response.data
}
