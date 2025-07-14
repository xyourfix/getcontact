import React from 'react'
import { PhoneIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <PhoneIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">GetContact</h1>
              <p className="text-sm text-gray-600">Phone Lookup Service</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ShieldCheckIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Secure & Private</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header