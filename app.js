const express = require('express')
const next = require('./crawler/index')
const app = express()
const port = 3000

next()

app.listen(port, () => { 
  console.log(`Example app listening on port ${port}!`)
})