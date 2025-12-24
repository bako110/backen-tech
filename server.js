const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const swaggerUi = require('swagger-ui-express')
const connectDB = require('./config/database')
const swaggerSpec = require('./config/swagger')

dotenv.config()

const app = express()

connectDB()

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/uploads', express.static('uploads'))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'MAB API Documentation',
}))

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/admins', require('./routes/adminRoutes'))
app.use('/api/vehicles', require('./routes/vehicleRoutes'))
app.use('/api/parts', require('./routes/partRoutes'))
app.use('/api/part-types', require('./routes/partTypeRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))
app.use('/api/messages', require('./routes/messageRoutes'))
app.use('/api/settings', require('./routes/settingRoutes'))
app.use('/api/mobile', require('./routes/mobileRoutes'))

app.get('/', (req, res) => {
  res.json({
    message: 'MAB API - Backend pour Admin & Mobile',
    version: '1.0.0',
    status: 'running',
    documentation: '/api-docs'
  })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`)
  console.log(`📱 Mode: ${process.env.NODE_ENV}`)
})
