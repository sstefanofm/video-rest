require('dotenv').config()

const app = require('express')()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.sendStatus(200)
})

app.post('/', (req, res) => {
  res.sendStatus(201)
})

app.listen(PORT, () => {
  console.log('Video-Rest is listening on port ' + PORT)
})
