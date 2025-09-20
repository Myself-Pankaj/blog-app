import { generic_msg } from '../constant/res.msg.js'
import config from '../config/config.js'
import { AppEnvironment } from '../constant/appenv.js'
import logger from './logger.js'

export default (controller, err, req, errorStatusCode = 500) => {
    const errorObj = {
        success: false,
        statusCode: err.statusCode || errorStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl
        },
        message: err instanceof Error ? err.message || generic_msg.something_went_wrong : generic_msg.something_went_wrong,
        data: null,
        trace: err instanceof Error ? { error: err.stack } : null
    }

    // Log
    logger.error(`${controller} CONTROLLER`, {
        meta: errorObj
    })

    // Production Env check
    if (config.ENV === AppEnvironment.PRODUCTION) {
        delete errorObj.request.ip
        delete errorObj.trace
    }

    return errorObj
}
