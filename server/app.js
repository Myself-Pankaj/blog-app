import express from 'express'
import path from 'path'

import globalErrorHandler from './src/middleware/globalErrorHandler.js'
import httpError from './src/utils/httpError.js'

import { fileURLToPath } from 'url'
import helmet from 'helmet'
import corsOptions from './src/middleware/cors.middleware.js'

import fileUpload from 'express-fileupload'
import { generic_msg } from './src/constant/res.msg.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()

//Middleware
app.use(helmet())

app.use(corsOptions)

app.use(
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        useTempFiles: true
    })
)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

//Routes
import blogs from './src/routes/blog.api.routes.js'

app.use('/api/v1', blogs)

// 404 Error handler
app.use((req, _res, next) => {
    try {
        throw new Error(generic_msg.resource_not_found('Route'))
    } catch (err) {
        httpError('404', next, err, req, 404)
    }
})

app.use(globalErrorHandler)

export default app
