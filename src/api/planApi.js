import apiClient from './axios'

export async function getPlans() {
  const response = await apiClient.get('/platform/plans')
  return response.data
}