import { Transaction } from '../db/models/transaction.js';
import { createTransaction } from '../services/transaction.js';
import { calculateIncomeAndExpenses } from '../utils/calculateIncomeAndExpenses.js';

export const addTransaction = async (req, res) => {
  try {
    console.log('User from request:', req.user);
    if (!req.user) {
      return res.status(401).json({ message: 'Користувач не авторизований' });
    }

    const transaction = await createTransaction({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error while creating transaction:', error);
    res.status(500).json({ message: 'Помилка при створенні транзакції' });
  }
};

export const getTransactionsByMonth = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required' });
    }

    const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const incomeTransactions = await Transaction.find({
      type: 'income',
      date: { $gte: startDate, $lt: endDate },
    });

    const expenseTransactions = await Transaction.find({
      type: 'expense',
      date: { $gte: startDate, $lt: endDate },
    });

    res.json({
      income: incomeTransactions,
      expenses: expenseTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getIncomeAndExpenses = async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ message: 'Year is required' });
    }

    const result = await calculateIncomeAndExpenses(year);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: 'Error calculating income and expenses',
      error: error.message,
    });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      req.body,
      { new: true },
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Транзакція не знайдена' });
    }

    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при оновленні транзакції' });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Транзакція не знайдена' });
    }

    res.json({ message: 'Транзакція успішно видалена' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при видаленні транзакції' });
  }
};
