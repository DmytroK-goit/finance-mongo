import { Transaction } from '../db/models/transaction.js';

export const getTransactionsByDay = async (date, userId) => {
  const day = date.split('T')[0];

  const transactionsByDay = await Transaction.aggregate([
    {
      $match: {
        date: { $regex: `^${day}` },
        userId,
      },
    },
  ]);

  return transactionsByDay;
};

export const getTransactionsByMonth = async (date, userId) => {
  const transactionsByMonth = await Transaction.find({
    date: { $regex: `^${date}` },
    userId,
  });

  return transactionsByMonth;
};

export const createTransaction = async (payload) => {
  const transaction = await Transaction.create(payload);
  return transaction;
};

export const updateTransaction = async (transactionId, payload, userId) => {
  const result = await Transaction.findOneAndUpdate(
    {
      _id: transactionId,
      userId,
    },
    payload,
    { new: true },
  );
  return result;
};

export const deleteTransaction = async (transactionId, userId) => {
  const result = await Transaction.findOneAndDelete({
    _id: transactionId,
    userId,
  });
  return result;
};
