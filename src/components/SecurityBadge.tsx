import React from 'react'
import { ShieldCheckIcon, LockClosedIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

const SecurityBadge: React.FC = () => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
      <div className="flex items-start space-x-3">
        <ShieldCheckIcon className="h-6 w-6 text-green-600 mt-0.5" />
        <div>
          <h4 className="font-semibold text-green-900 mb-2">Security Features</h4>
          <ul className="text-sm text-green-800 space-y-2">
            <li className="flex items-center space-x-2">
              <LockClosedIcon className="h-4 w-4" />
              <span>Credentials are stored locally and never sent to our servers</span>
            </li>
            <li className="flex items-center space-x-2">
              <EyeSlashIcon className="h-4 w-4" />
              <span>Input fields are sanitized to prevent XSS attacks</span>
            </li>
            <li className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-4 w-4" />
              <span>All communications are encrypted using HTTPS</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SecurityBadge