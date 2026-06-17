import apiClient from './axios'

export async function getBusinesses() {
  const response = await apiClient.get('/platform/businesses')
  return response.data
}