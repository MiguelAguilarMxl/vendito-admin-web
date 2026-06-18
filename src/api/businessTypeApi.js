import apiClient from './axios'

export async function getBusinessTypes() {
  const response = await apiClient.get('/business-types')
  return response.data
}