const express = require('express')
const cors = require('cors')
const GetContact = require('./getcontact')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Phone number check endpoint
app.post('/api/check-number', async (req, res) => {
  try {
    const { phone, token, finalKey } = req.body

    if (!phone || !token || !finalKey) {
      return res.status(400).json({
        error: 'Missing required fields: phone, token, and finalKey are required'
      })
    }

    const getContact = new GetContact(token, finalKey)
    const result = await getContact.checkNumber(phone)

    res.json(result)
  } catch (error) {
    console.error('Error checking phone number:', error.message)
    res.status(500).json({
      error: error.message || 'Failed to check phone number'
    })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error)
  res.status(500).json({
    error: 'Internal server error'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 GetContact API ready at http://localhost:${PORT}/api`)
})