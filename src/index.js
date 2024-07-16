require('dotenv').config()

const multer = require('multer')

const app = require('express')()
const PORT = process.env.PORT || 3000

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'media/')
  },
  filename: (req, file, cb) => {
    const uniqSuffix = Date.now() + '-' + Math.floor(Math.random() * 1e4)

    cb(null, `${ file.fieldname }-${ uniqSuffix }.mp4`)
  }
})
const upload = multer({ storage })

app.get('/', (req, res) => {
  res.sendStatus(200)
})

app.post('/', upload.single('video'), (req, res) => {
  res.status(201).send(req.file.filename)
})

app.listen(PORT, () => {
  console.log('Video-Rest is listening on port ' + PORT)
})
