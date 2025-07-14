export interface CountryCode {
  code: string
  name: string
  dialCode: string
  flag: string
}

export interface FormData {
  token: string
  finalKey: string
  phone: string
  countryCode: string
}

export interface ValidationError {
  field: string
  message: string
}

export interface CheckResult {
  number: string
  tags: string[]
}