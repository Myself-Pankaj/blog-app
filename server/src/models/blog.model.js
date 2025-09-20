import db from '../config/db.js'

const BlogModel = {
    async createBlog({ title, content, tags, category, thumbnail }) {
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
        const sql = `SELECT * FROM blogs WHERE blog_id = $1;`
        const result = await db.query(sql, [blog_id])
        // console.log(result)
        return result.rows[0]
    },

    async getAllBlogs(page = 1, limit = 10) {
        const offset = (page - 1) * limit

        // Fetch paginated rows
        const sql = `
    SELECT * FROM blogs
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2;
  `
        const result = await db.query(sql, [limit, offset])

        // Get total count for pagination
        const countResult = await db.query(`SELECT COUNT(*) FROM blogs`)
        const total = parseInt(countResult.rows[0].count, 10)

        return {
            rows: result.rows,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    },
    async updateBlog(blog_id, updates) {
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

    async deleteBlog(blog_id) {
        const sql = `DELETE FROM blogs WHERE blog_id = $1 RETURNING *;`
        const result = await db.query(sql, [blog_id])
        return result.rows[0]
    },
    async getRecentBlogs() {
        const sql = `
        SELECT *
        FROM blogs
        ORDER BY created_at DESC
        LIMIT 5;
    `
        const result = await db.query(sql)
        return result.rows
    }
}

export default BlogModel
