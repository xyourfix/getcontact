import { FormData } from '../types'

const STORAGE_KEY = 'getcontact_form_data'

export const saveFormData = (data: Partial<FormData>): void => {
  try {
    const existingData = getFormData()
    const mergedData = { ...existingData, ...data }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData))
  } catch (error) {
    console.warn('Failed to save form data to localStorage:', error)
  }
}

export const getFormData = (): Partial<FormData> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.warn('Failed to load form data from localStorage:', error)
    return {}
  }
}

export const clearFormData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear form data from localStorage:', error)
  }
}

export const saveCredentials = (token: string, finalKey: string): void => {
  saveFormData({ token, finalKey })
}

export const getCredentials = (): { token: string; finalKey: string } => {
  const data = getFormData()
  return {
    token: data.token || '',
    finalKey: data.finalKey || ''
  }
}