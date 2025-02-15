import { Router } from 'express';
import usersRouter from './users.js';
import transactionRouter from './transaction.js';

const router = Router();

router.use('/users', usersRouter);
router.use('/transaction', transactionRouter);

export default router;
