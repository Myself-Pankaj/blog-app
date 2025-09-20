import { generic_msg } from '../constant/res.msg.js'
import httpResponse from '../utils/httpResponse.js'
import BlogModel from '../models/blog.model.js'
import httpError from '../utils/httpError.js'
import CustomError from '../utils/customError.js'
import fs from 'fs'
import { unlink } from 'node:fs/promises'
import cloudinary from '../config/cloudinary.js'
import logger from '../utils/logger.js'
import config from '../config/config.js'

export const create_blog = async (req, res, next) => {
    try {
        const { title, content, tags, category } = req.body

        // Validate input
        if (!title || !content || !tags || !category) {
            return httpResponse(req, res, 400, generic_msg.invalid_input('Blogs'), null, null, null)
        }

        // Auth check
        const secretKey = req.query.secret
        if (secretKey !== config.blog_secret) {
            throw new CustomError('You are not authorized to create a blog', 403)
        }

        let thumbnailUrl = null

        // Handle thumbnail upload
        if (req.files && req.files.thumbnail) {
            const image = req.files.thumbnail

            try {
                const myCloud = await cloudinary.v2.uploader.upload(image.tempFilePath, {
                    folder: 'Blogs/Thumbnails',
                    resource_type: 'image'
                })

                thumbnailUrl = myCloud.secure_url
            } catch (uploadError) {
                logger.error(`Cloudinary Error: Failed to upload thumbnail ${image.name}:`, uploadError)
                throw new CustomError(generic_msg.operation_failed('Thumbnail uploading'), 500)
            } finally {
                // Always clean up temp file
                try {
                    await unlink(image.tempFilePath)
                } catch (unlinkError) {
                    logger.warn(`Failed to delete temp file: ${image.tempFilePath}`, unlinkError)
                }
            }
        }

        // Normalize tags
        const tagsArray = typeof tags === 'string' ? tags.split(',').map((tag) => tag.trim()) : tags

        // Save blog in DB
        const newBlog = await BlogModel.createBlog({
            title,
            content,
            tags: tagsArray,
            category,
            thumbnail: thumbnailUrl
        })

        if (!newBlog) {
            throw new CustomError('DB error in creating blog. Check createBlog function.', 500)
        }

        return httpResponse(req, res, 201, 'Blog created successfully', newBlog)
    } catch (error) {
        return httpError('Blog Creation Error', next, error, req, 500)
    }
}

export const update_blog = async (req, res, next) => {
    // for rollback cleanup

    try {
        const { id } = req.params
        const { title, content, tags, category } = req.body

        const updates = {}
        if (title !== undefined) {
            updates.title = title
        }
        if (tags !== undefined) {
            const tagsArray = typeof tags === 'string' ? tags.split(',').map((tag) => tag.trim()) : tags
            updates.tags = tagsArray
        }

        if (content !== undefined) {
            updates.content = content
        }
        if (category !== undefined) {
            updates.category = category
        }

        const blog = await BlogModel.getBlogById(id)

        let thumbnailUrl = null

        if (req.files && req.files.thumbnail) {
            const image = req.files.thumbnail
            try {
                const myCloud = await cloudinary.v2.uploader.upload(image.tempFilePath, {
                    folder: 'Blogs/Thumbnails',
                    resource_type: 'image'
                })

                thumbnailUrl = myCloud.secure_url

                try {
                    fs.unlinkSync(image.tempFilePath)
                } catch (unlinkError) {
                    logger.warn(`Failed to delete temp file: ${image.tempFilePath}`, unlinkError)
                }
            } catch (uploadError) {
                logger.error(`Cloudinary Error: Failed to upload thumbnail ${image.name}:`, { meta: { error: uploadError } })
                throw new CustomError(generic_msg.operation_failed('Thumbnail uploading'), 500)
            }
        }

        //Delete old thumbnail
        if (blog.thumbnail) {
            try {
                const urlParts = blog.thumbnail.split('/')
                const publicIdWithExt = urlParts.slice(-2).join('/') // e.g., 'Blogs/Thumbnails/abc123.jpg'
                const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '') // remove extension

                await cloudinary.v2.uploader.destroy(publicId, {
                    resource_type: 'image'
                })
            } catch (deleteError) {
                logger.warn('Failed to delete old thumbnail from Cloudinary:', { meta: { error: deleteError } })
            }
        }

        if (thumbnailUrl !== null) {
            updates.thumbnail = thumbnailUrl
        }

        const updatedBlog = await BlogModel.updateBlog(id, updates)
        return httpResponse(req, res, 200, 'Blog fully updated', updatedBlog)
    } catch (error) {
        return httpError('Blog Update Error', next, error, req, 500)
    }
}

export const delete_blog = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!id) {
            throw new CustomError(generic_msg.invalid_input('Id'), 405)
        }

        const isDeleted = await BlogModel.deleteBlog(id)

        if (isDeleted === undefined) {
            throw new CustomError(generic_msg.too_many_attempts('Deletion'), 403)
        }

        return httpResponse(req, resizeBy, 200, generic_msg.operation_success('Blog Deleted'), isDeleted)
    } catch (error) {
        return httpError('Blog Deletion', next, error, req, 500)
    }
}

export const read_blog = async (req, res, next) => {
    try {
        const { id } = req.params

        if (!id) {
            throw new CustomError(generic_msg.invalid_input('ID'), 404)
        }
        const blog = await BlogModel.getBlogById(id)

        if (!blog) {
            throw new CustomError(generic_msg.operation_failed('Reading Blog'), 401)
        }

        return httpResponse(req, res, 200, generic_msg.operation_success('Reading Blog'), blog)
    } catch (error) {
        return httpError('Reading Blog', next, error, req, 500)
    }
}

export const read_all_blog = async (req, res, next) => {
    try {
        // Get pagination params from query
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10

        if (page < 1 || limit < 1) {
            return httpResponse(req, res, 400, 'Invalid pagination parameters', null)
        }

        const { rows: blogs, total, totalPages } = await BlogModel.getAllBlogs(page, limit)

        if (!blogs) {
            throw new CustomError(generic_msg.operation_failed('Reading Blogs'), 500)
        }

        const pagination = { page, limit, total, totalPages }

        return httpResponse(req, res, 200, generic_msg.operation_success('Reading Blogs'), blogs, null, pagination)
    } catch (error) {
        return httpError('Reading Blogs', next, error, req, 500)
    }
}
export const read_recent_blogs = async (req, res, next) => {
    try {
        const blogs = await BlogModel.getRecentBlogs()

        if (!blogs) {
            throw new CustomError(generic_msg.operation_failed('Fetching Recent Blogs'), 500)
        }

        return httpResponse(req, res, 200, generic_msg.operation_success('Fetching Recent Blogs'), blogs)
    } catch (error) {
        return httpError('Fetching Recent Blogs', next, error, req, 500)
    }
}
