import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, PhoneIcon, TagIcon, KeyIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phone.trim()) {
      toast.error('Silakan masukkan nomor telepon')
      return
    }
    
    if (!token.trim()) {
      toast.error('Silakan masukkan GetContact Token')
      return
    }
    
    if (!finalKey.trim()) {
      toast.error('Silakan masukkan GetContact Final Key')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const data = await checkPhoneNumber(phone, token, finalKey)
      setResult(data)
      toast.success('Nomor telepon berhasil dicek!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal mengecek nomor telepon')
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

  const clearForm = () => {
    setPhone('')
    setToken('')
    setFinalKey('')
    setResult(null)
  }

  return (
    <div className="space-y-8">
      {/* Instruction Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Cara Menggunakan</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Masukkan <strong>GetContact Token</strong> dan <strong>Final Key</strong> dari aplikasi Android</li>
              <li>2. Masukkan <strong>nomor telepon</strong> yang ingin dicari</li>
              <li>3. Klik <strong>"Cek Nomor Telepon"</strong> untuk mendapatkan hasil</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="card animate-slide-up">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">GetContact Lookup</h2>
          <p className="text-gray-600">Masukkan kredensial dan nomor telepon untuk pencarian</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Credentials Section */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <ShieldCheckIcon className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Kredensial GetContact</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <KeyIcon className="inline h-4 w-4 mr-1" />
                  GetContact Token
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Masukkan GETCONTACT_TOKEN"
                  className="input-field font-mono text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <KeyIcon className="inline h-4 w-4 mr-1" />
                  Final Key
                </label>
                <input
                  type="text"
                  value={finalKey}
                  onChange={(e) => setFinalKey(e.target.value)}
                  placeholder="Masukkan GETCONTACT_KEY (FINAL_KEY)"
                  className="input-field font-mono text-sm"
                  required
                />
              </div>
            </div>
            
            <div className="text-xs text-gray-500 bg-white p-3 rounded border">
              <p><strong>Cara mendapatkan kredensial:</strong></p>
              <p>1. Install GetContact di Android dengan akses ROOT</p>
              <p>2. Buka: <code>/data/data/app.source.getcontact/shared_prefs/GetContactSettingsPref.xml</code></p>
              <p>3. Cari nilai: <code>TOKEN</code> dan <code>FINAL_KEY</code></p>
            </div>
          </div>

          {/* Phone Number Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <PhoneIcon className="inline h-4 w-4 mr-1" />
              Nomor Telepon
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                placeholder="Contoh: 081234567890 atau +6281234567890"
                className="input-field pl-12 text-lg"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Format didukung: 0812345678, +6281234567890, atau 6281234567890
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
                  <span>Sedang Mengecek...</span>
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  <span>Cek Nomor Telepon</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={clearForm}
              className="btn-secondary flex items-center justify-center space-x-2 py-3"
            >
              <span>Bersihkan Form</span>
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
              <h3 className="text-2xl font-bold text-gray-900">Hasil Pencarian</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <PhoneIcon className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Nomor Telepon</p>
                  <p className="text-lg font-semibold text-gray-900">{result.number}</p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <TagIcon className="h-5 w-5 text-gray-600" />
                  <p className="text-sm font-medium text-gray-600">Tag yang Ditemukan</p>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {result.tags.length} tag
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
                    <span>Tidak ada tag yang ditemukan untuk nomor ini</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setResult(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Tutup hasil
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PhoneChecker