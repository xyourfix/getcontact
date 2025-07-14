import React from 'react'
import { ShieldCheckIcon, BoltIcon, DevicePhoneMobileIcon, GlobeAltIcon, CloudArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import SecurityBadge from './SecurityBadge'

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Secure & Private',
    description: 'Advanced input validation and local storage for maximum security'
  },
  {
    icon: BoltIcon,
    title: 'Fast Results',
    description: 'Real-time validation and optimized API calls for instant results'
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Mobile Friendly',
    description: 'Fully responsive design with touch-friendly interface'
  },
  {
    icon: GlobeAltIcon,
    title: 'Global Coverage',
    description: 'Support for 20+ countries with automatic number formatting'
  },
  {
    icon: CloudArrowUpIcon,
    title: 'Auto-Save',
    description: 'Form data is automatically saved locally for your convenience'
  },
  {
    icon: CheckCircleIcon,
    title: 'Smart Validation',
    description: 'Real-time form validation with helpful error messages'
  }
]

const Features: React.FC = () => {
  return (
    <div className="mt-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Service?</h2>
        <p className="text-lg text-gray-600">Modern, reliable, and user-friendly phone lookup experience</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="card hover:shadow-lg transition-shadow duration-300 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <feature.icon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
      
      <SecurityBadge />
    </div>
  )
}

export default Features