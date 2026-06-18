import apiClient from './axios'

export async function getActivityLogs() {
  const response = await apiClient.get(
    '/platform/activity-logs'
  )

  return response.data
}