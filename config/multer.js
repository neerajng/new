const multer = require('multer')
// const path = require('path')

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/webp': 'webp'
}

// image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = FILE_TYPE_MAP[file.mimetype]
    let uploadError = new Error('Invalid image type')
    if (isValid) {
      uploadError = null
    }
    cb(uploadError, ('public/uploads'))
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split('  ').join('_')
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, `${fileName}-${Date.now()}.${extension}`)
  }
})
const uploadOptions = multer({ storage })

module.exports = { uploadOptions }
