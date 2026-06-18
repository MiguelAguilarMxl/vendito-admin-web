import apiClient from './axios'

export async function getActivityLogs(filters = {}) {
  const params = {}

  if (filters.action) {
    params.action = filters.action
  }

  if (filters.entity) {
    params.entity = filters.entity
  }

  if (filters.search) {
    params.search = filters.search
  }

  const response = await apiClient.get(
    '/platform/activity-logs',
    { params }
  )

  return response.data
}