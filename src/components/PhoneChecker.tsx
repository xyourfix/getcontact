import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, PhoneIcon, TagIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'
import { checkPhoneNumber } from '../services/api'

interface CheckResult {
  number: string
  tags: string[]
}

const PhoneChecker: React.FC = () => {
  const [phone, setPhone] = useState('')
  const [token, setToken] = useState('')
  const [finalKey, setFinalKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [showCredentials, setShowCredentials] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phone.trim()) {
      toast.error('Please enter a phone number')
      return
    }
    
    if (!token.trim() || !finalKey.trim()) {
      toast.error('Please enter your GetContact credentials')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const data = await checkPhoneNumber(phone, token, finalKey)
      setResult(data)
      toast.success('Phone number checked successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to check phone number')
    } finally {
      setLoading(false)
    }
  }

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.startsWith('62')) {
      return '+' + cleaned
    }
    if (cleaned.startsWith('0')) {
      return '+62' + cleaned.substring(1)
    }
    return cleaned.startsWith('+') ? value : '+' + cleaned
  }

  return (
    <div className="space-y-8">
      <div className="card animate-slide-up">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                placeholder="+62 or 0 followed by number"
                className="input-field pl-12"
                required
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <button
              type="button"
              onClick={() => setShowCredentials(!showCredentials)}
              className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <span>GetContact Credentials</span>
              <motion.div
                animate={{ rotate: showCredentials ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▼
              </motion.div>
            </button>
            
            <AnimatePresence>
              {showCredentials && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Token
                    </label>
                    <input
                      type="password"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Your GetContact token"
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Final Key
                    </label>
                    <input
                      type="password"
                      value={finalKey}
                      onChange={(e) => setFinalKey(e.target.value)}
                      placeholder="Your GetContact final key"
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <p>Need help getting credentials? Check the tutorial video in the documentation.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center space-x-2"
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
        </form>
      </div>

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
              <h3 className="text-2xl font-bold text-gray-900">Results</h3>
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
                  <p className="text-sm font-medium text-gray-600">Associated Tags</p>
                </div>
                
                {result.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PhoneChecker