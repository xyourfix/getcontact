import React from 'react'
import { ShieldCheckIcon, BoltIcon, DevicePhoneMobileIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Secure & Private',
    description: 'Your credentials are processed securely and never stored on our servers'
  },
  {
    icon: BoltIcon,
    title: 'Fast Results',
    description: 'Get phone number information in seconds with our optimized API'
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Mobile Friendly',
    description: 'Responsive design that works perfectly on all devices'
  },
  {
    icon: GlobeAltIcon,
    title: 'Global Coverage',
    description: 'Support for international phone numbers and formats'
  }
]

const Features: React.FC = () => {
  return (
    <div className="mt-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Service?</h2>
        <p className="text-lg text-gray-600">Modern, reliable, and user-friendly phone lookup experience</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  )
}

export default Features