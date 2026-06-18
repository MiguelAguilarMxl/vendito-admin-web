import apiClient from './axios'

export async function getPlatformUsers(filters = {}) {
  const params = {}

  if (filters.role) {
    params.role = filters.role
  }

  if (filters.active !== null && filters.active !== undefined) {
    params.active = filters.active
  }

  const response = await apiClient.get('/platform/users', { params })
  return response.data
}