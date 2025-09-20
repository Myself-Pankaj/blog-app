import config from '../src/config/config.js'
import { Pool } from 'pg'
import logger from '../src/utils/logger.js'

const dbConfig = {
    user: String(config.db_user),
    host: String(config.db_host),
    database: String(config.db_dbt),
    password: String(config.db_password),
    port: Number(config.db_port),
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
}

const pool = new Pool(dbConfig)

const createBlogsTable = `
CREATE TABLE IF NOT EXISTS blogs (
    blog_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    category VARCHAR(100),
    thumbnail VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
`

async function runMigration() {
    try {
        logger.info('Running migration: Creating blogs table...')
        await pool.query(createBlogsTable)
        logger.info('✅ Migration completed successfully: Blogs table created')

        const checkTable = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema='public' AND table_name='blogs'
            );
        `)

        if (checkTable.rows[0].exists) {
            logger.info('✅ Verification: blogs table exists in the database')
        } else {
            logger.warn('❌ Verification: blogs table does not exist')
        }

        await pool.end()
        process.exit(0)
    } catch (error) {
        logger.error('❌ Migration failed:', { meta: { Error: error.message, stack: error.stack } })
        await pool.end()
        process.exit(1)
    }
}

// --check argument support
const args = process.argv.slice(2)
if (args.includes('--check')) {
    pool.query(
        `
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema='public' AND table_name='blogs'
        );
    `
    )
        .then((result) => {
            logger.info('Table exists:', result.rows[0].exists)
            process.exit(result.rows[0].exists ? 0 : 1)
        })
        .catch((error) => {
            logger.error('Check failed:', { meta: error })
            process.exit(1)
        })
        .finally(() => pool.end())
} else {
    runMigration()
}
