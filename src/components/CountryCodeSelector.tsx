import React, { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { CountryCode } from '../types'
import { countryCodes } from '../data/countryCodes'

interface CountryCodeSelectorProps {
  selectedCountry: CountryCode
  onSelect: (country: CountryCode) => void
  className?: string
}

const CountryCodeSelector: React.FC<CountryCodeSelectorProps> = ({
  selectedCountry,
  onSelect,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredCountries = countryCodes.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (country: CountryCode) => {
    onSelect(country)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-3 bg-gray-50 border border-gray-300 rounded-l-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="text-lg">{selectedCountry.flag}</span>
        <span className="text-sm font-medium text-gray-700">{selectedCountry.dialCode}</span>
        <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-80 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => handleSelect(country)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 flex items-center space-x-3"
              >
                <span className="text-lg">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 truncate">{country.name}</span>
                    <span className="text-sm text-gray-500 font-mono">{country.dialCode}</span>
                  </div>
                </div>
              </button>
            ))}
            
            {filteredCountries.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No countries found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CountryCodeSelector