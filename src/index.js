require('dotenv').config()

const multer = require('multer')

const app = require('express')()
const PORT = process.env.PORT || 3000

const ext = Object.freeze({
  AVI: '.avi',
  MP4: '.mp4'
})
const availableMimes = Object.freeze({
  'video/mp4': ext.MP4,
  'video/x-mp4': ext.MP4,
  'video/avi': ext.AVI,
  'video/x-avi': ext.AVI,
  'video/vnd.avi': ext.AVI,
  'video/x-msvideo': ext.AVI,
})
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'media/')
  },
  filename: (req, file, cb) => {
    const uniqSuffix = Date.now() + '-' + Math.floor(Math.random() * 1e4)

    cb(null, `${ uniqSuffix }${ availableMimes[file.mimetype] }`)
  },
})
const upload = multer({
  storage,
  /* validation for all files */
  fileFilter: (req, file, cb) => {
    const validMime = mimeType => {
      return availableMimes.hasOwnProperty(mimeType)
    }

    if (!validMime(file.mimetype))
      return cb(null, false)

    cb(null, true)
  }
})

app.get('/', (req, res) => {
  res.sendStatus(200)
})

app.post('/', upload.single('video'), (req, res) => {
  if (!req.file)
    return res.status(400).send('Hubo un error al subir el video.')

  res.status(201).json({ filename: req.file.filename })
})

app.listen(PORT, () => {
  console.log('Video-Rest is listening on port ' + PORT)
})
