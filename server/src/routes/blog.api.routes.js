import { create_blog, delete_blog, read_all_blog, read_blog, read_recent_blogs, update_blog } from '../controllers/blog.controller.js'
import { Router } from 'express'

const router = Router()
router.route('/create').post(create_blog)
router.route('/update/:id').put(update_blog)
router.route('/delete/:id').delete(delete_blog)
router.route('/read/:id').get(read_blog)
router.route('/readall').get(read_all_blog)
router.route('/recent').get(read_recent_blogs)

export default router
