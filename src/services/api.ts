import axios from 'axios'

const API_BASE_URL = './api'

export interface CheckPhoneResponse {
  number: string
  tags: string[]
}

export const checkPhoneNumber = async (
  phone: string,
  token: string,
  finalKey: string
): Promise<CheckPhoneResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/check-number`, {
      phone,
      token,
      finalKey
    })
    
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to check phone number')
    }
    throw new Error('Network error occurred')
  }
}