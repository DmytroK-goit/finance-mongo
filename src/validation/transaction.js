import Joi from 'joi';

export const createTransactionSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').required().messages({
    'any.only': "Type must be 'income' or 'expense'",
    'any.required': 'Type is required',
  }),
  category: Joi.string().min(3).max(50).required().messages({
    'string.min': 'Category must be at least 3 characters',
    'string.max': 'Category must not exceed 50 characters',
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
  category: Joi.string().optional(),
  amount: Joi.number().optional(),
  date: Joi.date().optional(),
  description: Joi.string().optional(),
});
