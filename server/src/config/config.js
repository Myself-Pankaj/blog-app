import dotenvFlow from 'dotenv-flow'

dotenvFlow.config()

export default {
    env: process.env.ENV,
    port: process.env.PORT,
    server_url: process.env.SERVER_URL,
    blog_secret: process.env.BLOG_SECRET,
    allowed_origin: process.env.ALLOWED_ORIGINS,
    db_user: process.env.DB_USER,
    db_host: process.env.DB_HOST,
    db_dbt: process.env.DB_DBT,
    db_password: process.env.DB_PASSWORD,
    db_port: process.env.DB_PORT,
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
}
