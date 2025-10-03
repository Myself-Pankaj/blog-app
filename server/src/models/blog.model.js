import logger from '../utils/logger.js'
import db from '../config/db.js'

let tableInitialized = false
let initializationPromise = null

const BlogModel = {
    // Ensure table exists (called internally before any operation)
    async ensureTable() {
        // If already initialized, return immediately
        if (tableInitialized) {
            return
        }

        // If initialization is in progress, wait for it
        if (initializationPromise) {
            await initializationPromise
        }

        // Start initialization
        initializationPromise = (async () => {
            try {
                const sql = `
                    CREATE TABLE IF NOT EXISTS blogs (
                        blog_id SERIAL PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        content TEXT NOT NULL,
                        tags TEXT[] DEFAULT '{}',
                        category VARCHAR(100),
                        thumbnail VARCHAR(500),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                `
                await db.query(sql)
                tableInitialized = true
            } catch (error) {
                logger.error('Failed to initialize blogs table:', error)
                // Reset promise so it can be retried
                initializationPromise = null
                throw new Error('Database table initialization failed')
            }
        })()

        await initializationPromise
    },

    async createBlog({ title, content, tags, category, thumbnail }) {
        await this.ensureTable()

        const sql = `
            INSERT INTO blogs (title, content, tags, category, thumbnail)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `
        const params = [title, content, tags, category, thumbnail]
        const result = await db.query(sql, params)
        return result.rows[0]
    },

    async getBlogById(blog_id) {
        await this.ensureTable()

        const sql = `SELECT * FROM blogs WHERE blog_id = $1;`
        const result = await db.query(sql, [blog_id])
        return result.rows[0]
    },

    async updateBlog(blog_id, updates) {
        await this.ensureTable()

        const fields = []
        const values = []
        let index = 1

        for (const [key, value] of Object.entries(updates)) {
            fields.push(`${key} = $${index}`)
            values.push(value)
            index++
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`)

        const sql = `
            UPDATE blogs
            SET ${fields.join(', ')}
            WHERE blog_id = $${index}
            RETURNING *;
        `
        values.push(blog_id)

        const result = await db.query(sql, values)
        return result.rows[0]
    },

    async getAllBlogs(limit = 10, offset = 0) {
        await this.ensureTable()

        try {
            const sql = `
                SELECT * FROM blogs
                ORDER BY created_at DESC
                LIMIT $1 OFFSET $2;
            `
            const result = await db.query(sql, [limit, offset])
            return result.rows
        } catch (error) {
            throw error
        }
    },

    async getBlogsCount() {
        await this.ensureTable()

        try {
            const sql = `SELECT COUNT(*) FROM blogs`
            const result = await db.query(sql)
            return parseInt(result.rows[0].count, 10)
        } catch (error) {
            throw error
        }
    },

    async deleteBlog(blog_id) {
        await this.ensureTable()

        const sql = `DELETE FROM blogs WHERE blog_id = $1 RETURNING *;`
        const result = await db.query(sql, [blog_id])
        return result.rows[0]
    },

    async searchBlogs(searchTerm, limit = 10, offset = 0) {
        await this.ensureTable()

        const sql = `
            SELECT *
            FROM blogs
            WHERE title ILIKE $1
               OR category ILIKE $1
               OR EXISTS (
                   SELECT 1
                   FROM unnest(tags) t
                   WHERE t ILIKE $1
               )
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3;
        `
        const searchPattern = `%${searchTerm}%`
        const result = await db.query(sql, [searchPattern, limit, offset])
        return result.rows
    },

    async getSearchCount(searchTerm) {
        await this.ensureTable()

        const sql = `
            SELECT COUNT(*) as total
            FROM blogs
            WHERE title ILIKE $1
               OR category ILIKE $1
               OR EXISTS (
                   SELECT 1
                   FROM unnest(tags) t
                   WHERE t ILIKE $1
               )
        `
        const searchPattern = `%${searchTerm}%`
        const result = await db.query(sql, [searchPattern])
        return parseInt(result.rows[0].total, 10)
    },

    async getRelatedBlogs(tags, excludeBlogId) {
        await this.ensureTable()

        const sql = `
            SELECT *
            FROM blogs
            WHERE tags @> $1 AND blog_id != $2
            ORDER BY created_at DESC
            LIMIT 5;
        `
        const result = await db.query(sql, [tags, excludeBlogId])
        return result.rows
    }
}

export default BlogModel
