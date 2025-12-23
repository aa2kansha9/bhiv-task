 
const Joi = require('joi');

// Validation schema for the /submit endpoint
const submitSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.min': 'Name must be at least 3 characters long',
            'string.max': 'Name cannot exceed 50 characters',
            'any.required': 'Name is required'
        }),
    
    description: Joi.string()
        .max(200)
        .optional()
        .allow('')
        .messages({
            'string.max': 'Description cannot exceed 200 characters'
        }),
    
    price: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            'number.positive': 'Price must be a positive number',
            'number.precision': 'Price can have maximum 2 decimal places',
            'any.required': 'Price is required'
        }),
    
    category: Joi.string()
        .valid('electronics', 'clothing', 'books', 'other')
        .default('other')
        .messages({
            'any.only': 'Category must be one of: electronics, clothing, books, other'
        })
});

// Validation middleware for /submit endpoint
const validateSubmit = (req, res, next) => {
    const { error, value } = submitSchema.validate(req.body, {
        abortEarly: false, // Return all errors, not just the first one
        stripUnknown: true // Remove unknown properties
    });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({
            error: 'Validation failed',
            details: errorMessages
        });
    }

    // Replace request body with validated and sanitized data
    req.body = value;
    next();
};

module.exports = {
    validateSubmit,
    submitSchema // Exporting schema for testing if needed
};