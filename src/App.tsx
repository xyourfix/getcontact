import React from 'react'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import PhoneChecker from './components/PhoneChecker'
import Features from './components/Features'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster position="top-right" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              GetContact
              <span className="text-blue-600"> Lookup</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover information about phone numbers with our modern, fast, and secure lookup service
            </p>
          </div>
          
          <PhoneChecker />
          <Features />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App