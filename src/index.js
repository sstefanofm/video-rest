require('dotenv').config()

const fs = require('fs')
const path = require('path')
const multer = require('multer')

const app = require('express')()
const PORT = process.env.PORT || 3000

const uploadFolder = path.join(__dirname, '/../media/')

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
    cb(null, uploadFolder)
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
    const validMime = mimeType => availableMimes.hasOwnProperty(mimeType)

    if (!validMime(file.mimetype))
      return cb(null, false)

    cb(null, true)
  }
})

app.get('/', (req, res) => {
  const { name } = req.query

  if (!name)
    return res.status(400).json({ error: 'El video que intentas obtener no existe.' })

  const uploadFolder = path.join(__dirname, '/../media/')
  const files = fs.readdirSync(uploadFolder)
  const rawFiles = files.map(file => file.slice(0, file.lastIndexOf('.')))

  if (!rawFiles.some(file => file === name))
    return res.status(400).json({ error: 'El video que intentas obtener no existe.' })

  const filename = files[rawFiles.indexOf(name)]
  const options = {
    headers: {
      'Content-Disposition': `attachment; filename="${ filename }"`
    }
  }

  res.sendFile(path.join(uploadFolder, filename), options)
})

app.post('/', upload.single('video'), (req, res) => {
  if (!req.file)
    return res.status(400).json({ error: 'Hubo un error al subir el video.' })

  const { filename } = req.file

  res.status(201).json({
    filename: filename,
    raw: filename.slice(0, filename.lastIndexOf('.'))
  })
})

app.listen(PORT, () => {
  console.log('Video-Rest is listening on port ' + PORT)
})
