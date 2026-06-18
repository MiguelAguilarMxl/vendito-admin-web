import apiClient from './axios'

export async function getSubscriptions() {
  const response = await apiClient.get('/platform/subscriptions')
  return response.data
}