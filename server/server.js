import app from './app.js'
import config from './src/config/config.js'
import logger from './src/utils/logger.js'
import db from './src/config/db.js'

let server
;(async () => {
    try {
        // Check database connection before starting server
        await db.healthCheck()
        server = app.listen(config.port, '0.0.0.0', () => {
            logger.info('APP_STARTED', {
                meta: {
                    PORT: config.port,
                    SERVER_URL: config.server_url
                }
            })
        })
    } catch (error) {
        logger.error('APP_ERROR', { meta: error })
        process.exit(1)
    }
})().catch((err) => {
    logger.error('UNHANDLED_APP_ERROR', {
        meta: err instanceof Error ? { message: err.message, stack: err.stack } : err
    })
    process.exit(1)
})

// Graceful shutdown
const gracefulShutdown = async () => {
    logger.info('Received shutdown signal, closing server gracefully...')
    try {
        await db.close()
        server.close(() => {
            logger.info('Server closed successfully')
            process.exit(0)
        })
    } catch (error) {
        logger.error('Error during shutdown', { meta: error })
        process.exit(1)
    }
}

process.on('SIGINT', () => {
    gracefulShutdown()
})
process.on('SIGTERM', () => {
    gracefulShutdown()
})
