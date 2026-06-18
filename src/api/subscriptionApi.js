import apiClient from './axios'

export async function getSubscriptions(filters = {}) {
  const params = {}

  if (filters.plan) {
    params.plan = filters.plan
  }

  if (filters.status) {
    params.status = filters.status
  }

  const response = await apiClient.get('/platform/subscriptions', { params })
  return response.data
}