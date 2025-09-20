import config from './config.js'
import { Pool } from 'pg'
import logger from '../utils/logger.js'

const dbConfig = {
    user: config.db_user,
    host: config.db_host,
    database: config.db_dbt,
    password: config.db_password,
    port: Number(config.db_port),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
    // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
}

class Database {
    static instance
    pool
    isShutdown = false

    constructor() {
        this.pool = new Pool(dbConfig)
        this.setupEventListeners()
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }

    setupEventListeners() {
        this.pool.on('connect', () => {
            logger.info('Database client connected', { meta: { Error: 'NULL' } })
        })
        this.pool.on('error', (err) => {
            logger.error('Unexpected database error', {
                meta: { message: err.message, stack: err.stack }
            })
        })
    }

    async query(sql, params = []) {
        if (this.isShutdown) {
            throw new Error('Database connection is closing - not accepting new queries')
        }
        const client = await this.pool.connect()
        try {
            return await client.query(sql, params)
        } catch (error) {
            logger.error('Query failed', { meta: error })
            throw error
        } finally {
            client.release()
        }
    }

    async transaction(callback) {
        if (this.isShutdown) {
            throw new Error('Database connection is closing - not accepting new transactions')
        }
        const client = await this.pool.connect()
        try {
            await client.query('BEGIN')
            const result = await callback(client)
            await client.query('COMMIT')
            return result
        } catch (error) {
            await client.query('ROLLBACK')
            logger.error('Transaction failed', { meta: error })
            throw error
        } finally {
            client.release()
        }
    }

    async close() {
        if (this.isShutdown) {
            return
        }
        this.isShutdown = true
        try {
            await this.pool.end()
            logger.info('Database pool closed successfully')
        } catch (error) {
            logger.error('Error closing database pool', { meta: error })
            throw error
        }
    }

    async healthCheck() {
        try {
            await this.query('SELECT 1')
            logger.info('Database connection is healthy', {
                meta: { Success: 'True' }
            })
        } catch (error) {
            logger.error('Database connection is unhealthy', { meta: error })
            throw new Error('Database connection is unhealthy')
        }
    }
}

const db = Database.getInstance()

db.query('SELECT NOW()')
    .then(() => {
        logger.info('Database connection established', {
            meta: { DB_NAME: config.db_dbt }
        })
    })
    .catch((err) => {
        logger.error('Database Connection Failed', {
            meta: err instanceof Error ? { message: err.message, stack: err.stack } : err
        })
        process.exit(1)
    })

export default db
