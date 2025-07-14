import { ValidationError } from '../types'

export const validateToken = (token: string): ValidationError | null => {
  if (!token.trim()) {
    return { field: 'token', message: 'GetContact Token is required' }
  }
  
  // Token should be a long alphanumeric string (typically 32+ characters)
  if (token.length < 20) {
    return { field: 'token', message: 'Token appears to be too short. Expected at least 20 characters.' }
  }
  
  // Check if it contains only valid characters (alphanumeric, hyphens, underscores)
  const tokenPattern = /^[a-zA-Z0-9_-]+$/
  if (!tokenPattern.test(token)) {
    return { field: 'token', message: 'Token contains invalid characters. Only alphanumeric, hyphens, and underscores are allowed.' }
  }
  
  return null
}

export const validateFinalKey = (finalKey: string): ValidationError | null => {
  if (!finalKey.trim()) {
    return { field: 'finalKey', message: 'Final Key is required' }
  }
  
  // Final key should be a hexadecimal string (typically 32-64 characters)
  if (finalKey.length < 16) {
    return { field: 'finalKey', message: 'Final Key appears to be too short. Expected at least 16 characters.' }
  }
  
  // Check if it's a valid hexadecimal string
  const hexPattern = /^[0-9a-fA-F]+$/
  if (!hexPattern.test(finalKey)) {
    return { field: 'finalKey', message: 'Final Key must be a valid hexadecimal string (0-9, A-F only).' }
  }
  
  return null
}

export const validatePhoneNumber = (phone: string, countryCode: string): ValidationError | null => {
  if (!phone.trim()) {
    return { field: 'phone', message: 'Phone number is required' }
  }
  
  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '')
  
  if (cleanPhone.length < 7) {
    return { field: 'phone', message: 'Phone number is too short' }
  }
  
  if (cleanPhone.length > 15) {
    return { field: 'phone', message: 'Phone number is too long' }
  }
  
  // Country-specific validation
  if (countryCode === '+62') { // Indonesia
    if (cleanPhone.startsWith('0') && cleanPhone.length < 10) {
      return { field: 'phone', message: 'Indonesian phone number should be at least 10 digits' }
    }
  }
  
  return null
}

export const sanitizeInput = (input: string): string => {
  // Remove potentially dangerous characters while preserving valid input
  return input.replace(/[<>"/\\&]/g, '').trim()
}

export const formatPhoneNumber = (phone: string, countryCode: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  
  if (countryCode === '+62') { // Indonesia
    if (cleaned.startsWith('0')) {
      return `+62${cleaned.substring(1)}`
    }
    if (cleaned.startsWith('62')) {
      return `+${cleaned}`
    }
    return cleaned.startsWith('+') ? phone : `+62${cleaned}`
  }
  
  // Default formatting
  return cleaned.startsWith('+') ? phone : `${countryCode}${cleaned}`
}