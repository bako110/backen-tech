const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/', (req, res) => {
  res.json({
    success: true,
    messages: []
  })
})

module.exports = router
