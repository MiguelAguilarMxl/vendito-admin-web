import apiClient from './axios'

export async function getBusinesses() {
  const response = await apiClient.get('/platform/businesses')
  return response.data
}

export async function getBusinessById(id) {
  const response = await apiClient.get(`/platform/businesses/${id}`)
  return response.data
}