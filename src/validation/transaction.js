import Joi from 'joi';

const validCategories = [
  'Auto',
  'Food',
  'Clothing',
  'Home expenses',
  'Entertainment',
  'Health',
  'Transport',
  'Education',
  'Other',
  'Salary',
  'Credit',
];

export const createTransactionSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').required().messages({
    'any.only': "Type must be 'income' or 'expense'",
    'any.required': 'Type is required',
  }),
  category: Joi.string()
    .valid(...validCategories)
    .required()
    .messages({
      'any.only': `Category must be one of: ${validCategories.join(', ')}`,
      'any.required': 'Category is required',
    }),
  amount: Joi.number().min(1).required().messages({
    'number.min': 'Amount must be at least 1',
    'any.required': 'Amount is required',
  }),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'Date must be in the format YYYY-MM-DDTHH:mm',
      'any.required': 'Date is required',
    }),
  description: Joi.string().max(200).optional().messages({
    'string.max': 'Description must not exceed 200 characters',
  }),
});

export const updateTransactionSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').optional(),
  category: Joi.string()
    .valid(...validCategories)
    .optional()
    .messages({
      'any.only': `Category must be one of: ${validCategories.join(', ')}`,
    }),
  amount: Joi.number().min(1).optional(),
  date: Joi.date().optional(),
  description: Joi.string().max(200).optional(),
});
