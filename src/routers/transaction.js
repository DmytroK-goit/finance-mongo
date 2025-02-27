import express from 'express';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '../validation/transaction.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  addTransaction,
  deleteTransaction,
  getIncomeAndExpenses,
  getTransactionsByMonth,
  updateTransaction,
} from '../controllers/transaction.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.post(
  '/',
  authenticate,
  validateBody(createTransactionSchema),
  ctrlWrapper(addTransaction),
);
router.get('/summary', authenticate, ctrlWrapper(getTransactionsByMonth));
router.get('/income-expenses', authenticate, ctrlWrapper(getIncomeAndExpenses));

router.patch(
  '/:id',
  authenticate,
  validateBody(updateTransactionSchema),
  ctrlWrapper(updateTransaction),
);
router.delete('/:id', authenticate, ctrlWrapper(deleteTransaction));

export default router;
