import apiClient from './axios'

export async function getBusinesses(filters = {}) {
  const params = {}

  if (filters.search) {
    params.search = filters.search
  }

  if (filters.plan) {
    params.plan = filters.plan
  }

  if (filters.active !== null && filters.active !== undefined) {
    params.active = filters.active
  }

  const response = await apiClient.get('/platform/businesses', { params })
  return response.data
}

export async function getBusinessById(id) {
  const response = await apiClient.get(`/platform/businesses/${id}`)
  return response.data
}

export async function getBusinessUsers(id) {
  const response = await apiClient.get(`/platform/businesses/${id}/users`)
  return response.data
}

export async function getBusinessSubscription(id) {
  const response = await apiClient.get(`/platform/businesses/${id}/subscription`)
  return response.data
}

export async function getBusinessMetrics(id) {
  const response = await apiClient.get(`/platform/businesses/${id}/metrics`)
  return response.data
}