import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, PhoneIcon, TagIcon, KeyIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'
import { checkPhoneNumber } from '../services/api'
import { FormData, ValidationError, CheckResult, CountryCode } from '../types'
import { validateToken, validateFinalKey, validatePhoneNumber, sanitizeInput, formatPhoneNumber } from '../utils/validation'
import { saveFormData, getFormData, clearFormData, saveCredentials } from '../utils/localStorage'
import { countryCodes, getCountryByDialCode } from '../data/countryCodes'
import CountryCodeSelector from './CountryCodeSelector'

const PhoneChecker: React.FC = () => {
  // Load initial data from localStorage
  const initialData = getFormData()
  const initialCountry = getCountryByDialCode(initialData.countryCode || '+62') || countryCodes[0]
  
  const [formData, setFormData] = useState<FormData>({
    token: initialData.token || '',
    finalKey: initialData.finalKey || '',
    phone: initialData.phone || '',
    countryCode: initialData.countryCode || '+62'
  })
  
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(initialCountry)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [showCredentials, setShowCredentials] = useState(false)

  // Auto-save form data to localStorage
  const updateFormData = (updates: Partial<FormData>) => {
    const newData = { ...formData, ...updates }
    setFormData(newData)
    saveFormData(newData)
  }

  const validateForm = (): ValidationError[] => {
    const validationErrors: ValidationError[] = []
    
    const tokenError = validateToken(formData.token)
    if (tokenError) validationErrors.push(tokenError)
    
    const finalKeyError = validateFinalKey(formData.finalKey)
    if (finalKeyError) validationErrors.push(finalKeyError)
    
    const phoneError = validatePhoneNumber(formData.phone, formData.countryCode)
    if (phoneError) validationErrors.push(phoneError)
    
    return validationErrors
  }

  const getErrorMessage = (field: string): string | undefined => {
    const error = errors.find(e => e.field === field)
    return error?.message
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    const sanitizedValue = sanitizeInput(value)
    updateFormData({ [field]: sanitizedValue })
    
    // Clear specific field error when user starts typing
    if (errors.length > 0) {
      setErrors(prev => prev.filter(e => e.field !== field))
    }
  }

  const handleCountryChange = (country: CountryCode) => {
    setSelectedCountry(country)
    updateFormData({ countryCode: country.dialCode })
  }

  const handlePhoneChange = (value: string) => {
    // Allow only digits, spaces, hyphens, and parentheses for phone input
    const cleanValue = value.replace(/[^\d\s\-\(\)]/g, '')
    updateFormData({ phone: cleanValue })
    
    // Clear phone error when user starts typing
    if (errors.length > 0) {
      setErrors(prev => prev.filter(e => e.field !== 'phone'))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    setErrors(validationErrors)
    
    if (validationErrors.length > 0) {
      toast.error('Please fix the validation errors before submitting')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const formattedPhone = formatPhoneNumber(formData.phone, formData.countryCode)
      const data = await checkPhoneNumber(formattedPhone, formData.token, formData.finalKey)
      setResult(data)
      
      // Save credentials for future use
      saveCredentials(formData.token, formData.finalKey)
      
      toast.success('Phone number successfully checked!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to check phone number')
    } finally {
      setLoading(false)
    }
  }

  const clearForm = () => {
    const clearedData: FormData = {
      token: '',
      finalKey: '',
      phone: '',
      countryCode: '+62'
    }
    setFormData(clearedData)
    setSelectedCountry(countryCodes[0])
    setErrors([])
    setResult(null)
    clearFormData()
    toast.success('Form cleared successfully')
  }

  return (
    <div className="space-y-8">
      {/* Instruction Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">How to Use</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Enter your <strong>GetContact Token</strong> and <strong>Final Key</strong> from the Android app</li>
              <li>2. Select the country code and enter the <strong>phone number</strong> to search</li>
              <li>3. Click <strong>"Check Phone Number"</strong> to get the results</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="card animate-slide-up">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">GetContact Lookup</h2>
          <p className="text-gray-600">Enter your credentials and phone number for lookup</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Credentials Section */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4 relative">
            <div className="flex items-center space-x-2 mb-4">
              <ShieldCheckIcon className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">GetContact Credentials</h3>
              <button
                type="button"
                onClick={() => setShowCredentials(!showCredentials)}
                className="ml-auto text-sm text-blue-600 hover:text-blue-800"
              >
                {showCredentials ? 'Hide' : 'Show'} Credentials
              </button>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ${showCredentials ? 'opacity-100' : 'opacity-50'}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <KeyIcon className="inline h-4 w-4 mr-1" />
                  GetContact Token
                </label>
                <input
                  type={showCredentials ? "text" : "password"}
                  value={formData.token}
                  onChange={(e) => handleInputChange('token', e.target.value)}
                  placeholder="Enter your GETCONTACT_TOKEN"
                  className={`input-field font-mono text-sm ${getErrorMessage('token') ? 'border-red-500 focus:ring-red-500' : ''}`}
                  required
                />
                {getErrorMessage('token') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('token')}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  A long alphanumeric string (20+ characters)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <KeyIcon className="inline h-4 w-4 mr-1" />
                  Final Key
                </label>
                <input
                  type={showCredentials ? "text" : "password"}
                  value={formData.finalKey}
                  onChange={(e) => handleInputChange('finalKey', e.target.value)}
                  placeholder="Enter your GETCONTACT_KEY (FINAL_KEY)"
                  className={`input-field font-mono text-sm ${getErrorMessage('finalKey') ? 'border-red-500 focus:ring-red-500' : ''}`}
                  required
                />
                {getErrorMessage('finalKey') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('finalKey')}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  A hexadecimal string (16+ characters, 0-9 and A-F only)
                </p>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 bg-white p-3 rounded border">
              <p><strong>How to get credentials:</strong></p>
              <p>1. Install GetContact on Android with ROOT access</p>
              <p>2. Open: <code>/data/data/app.source.getcontact/shared_prefs/GetContactSettingsPref.xml</code></p>
              <p>3. Find values: <code>TOKEN</code> and <code>FINAL_KEY</code></p>
            </div>
          </div>

          {/* Phone Number Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <PhoneIcon className="inline h-4 w-4 mr-1" />
              Phone Number
            </label>
            <div className="flex">
              <CountryCodeSelector
                selectedCountry={selectedCountry}
                onSelect={handleCountryChange}
              />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="Enter phone number (e.g., 081234567890)"
                className={`input-field rounded-l-none text-lg flex-1 ${getErrorMessage('phone') ? 'border-red-500 focus:ring-red-500' : ''}`}
                required
              />
            </div>
            {getErrorMessage('phone') && (
              <p className="text-red-500 text-xs mt-1">{getErrorMessage('phone')}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: 0812345678 or 812345678 (country code will be added automatically)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center space-x-2 py-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  <span>Check Phone Number</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={clearForm}
              className="btn-secondary flex items-center justify-center space-x-2 py-3"
            >
              <span>Clear Form</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
              <h3 className="text-2xl font-bold text-gray-900">Search Results</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <PhoneIcon className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone Number</p>
                  <p className="text-lg font-semibold text-gray-900">{result.number}</p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <TagIcon className="h-5 w-5 text-gray-600" />
                  <p className="text-sm font-medium text-gray-600">Tags Found</p>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {result.tags.length} tags
                  </span>
                </div>
                
                {result.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <ExclamationCircleIcon className="h-5 w-5" />
                    <span>No tags found for this number</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setResult(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Close results
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PhoneChecker