// @ts-nocheck
import util from 'util'
import { createLogger, format, transports } from 'winston'
import path from 'path'

import moment from 'moment-timezone'
import { red, blue, yellow, green, magenta, bold } from 'colorette'
import config from '../config/config.js'
import { AppEnvironment } from '../constant/appenv.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const formatTimestamp = (timestamp) => {
    // Format timestamp to 'DD MMM YYYY HH:mm' in IST
    return moment(timestamp).tz('Asia/Kolkata').format('DD MMM YYYY HH:mm')
}

const consoleLogFormat = format.printf((info) => {
    const timestamp = formatTimestamp(info.timestamp)
    const { level, message, meta = {} } = info

    const customLevel = colorizeLevel(level.toUpperCase())
    const customTimestamp = green(timestamp)
    const customMessage = message

    const customMeta = util.inspect(meta, {
        showHidden: false,
        depth: null,
        colors: true
    })

    const customLog = `${customLevel} ${customTimestamp} : ${bold(customMessage)}\n${magenta('META')} ${customMeta}\n`

    return customLog
})

const fileLogFormat = format.printf((info) => {
    const timestamp = formatTimestamp(info.timestamp)
    const { level, message, meta = {} } = info

    const logMeta = {}

    for (const [key, value] of Object.entries(meta)) {
        if (value instanceof Error) {
            logMeta[key] = {
                name: value.name,
                message: value.message,
                trace: value.stack || ''
            }
        } else {
            logMeta[key] = value
        }
    }

    const logData = {
        level: level.toUpperCase(),
        message,
        timestamp,
        meta: logMeta
    }

    return JSON.stringify(logData, null, 4)
})

const consoleTransport = () => {
    if (config.ENV !== AppEnvironment.PRODUCTION) {
        return [
            new transports.Console({
                level: 'info',
                format: format.combine(format.timestamp(), consoleLogFormat)
            })
        ]
    }
    return []
}

const fileTransport = () => {
    return [
        new transports.File({
            filename:
                config.ENV !== AppEnvironment.PRODUCTION
                    ? path.join(__dirname, '../', '../', 'logs', `${config.env}.log`)
                    : path.join(process.cwd(), 'logs', `${config.env}.log`),
            level: 'info',
            format: format.combine(format.timestamp(), fileLogFormat)
        })
    ]
}

const logger = createLogger({
    defaultMeta: { meta: {} },
    transports: [...fileTransport(), ...consoleTransport()]
})

export default logger

/**
 * @param level
 * @example
 */
function colorizeLevel(level) {
    switch (level.toUpperCase()) {
        case 'ERROR':
            return red(level)
        case 'INFO':
            return blue(level)
        case 'WARN':
            return yellow(level)
        default:
            return level
    }
}
