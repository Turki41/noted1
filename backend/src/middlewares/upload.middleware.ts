import multer, { FileFilterCallback } from 'multer'
import type { Request } from 'express'
import fs from 'fs'
import path from 'path'

//Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads')
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    },
})

//File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        ; (req as any).fileValidationError = 'Only .jpeg, .jpg and .png formats are allowed'
        cb(null, false)
    }
}

const upload = multer({ storage, fileFilter })

export default upload