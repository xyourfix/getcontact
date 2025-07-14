import React from 'react'
import { HeartIcon } from '@heroicons/react/24/solid'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span>Made with</span>
            <HeartIcon className="h-5 w-5 text-red-500" />
            <span>for the community</span>
          </div>
          
          <p className="text-gray-400 text-sm mb-4">
            GetContact Web Application - Unofficial API Wrapper
          </p>
          
          <div className="text-xs text-gray-500">
            <p>⚠️ This service requires valid GetContact credentials from the official app.</p>
            <p>Please ensure you have the necessary permissions to use this service.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer