import { query, validationResult } from 'express-validator'

export const validateSearch = [
    query('q').isString().trim().notEmpty().withMessage('Search query is required'),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        return next()
    }
]
