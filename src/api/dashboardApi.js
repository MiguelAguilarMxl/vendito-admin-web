import apiClient from './axios'

export async function getDashboard() {
  const response = await apiClient.get('/platform/dashboard')
  return response.data
}