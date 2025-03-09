import { Transaction } from '../db/models/transaction.js';

export const calculateIncomeAndExpenses = async (year, userId) => {
  try {
    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear)) {
      throw new Error('Invalid year parameter');
    }

    const startDate = new Date(`${parsedYear}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${parsedYear + 1}-01-01T00:00:00.000Z`);

    console.log(`Start Date: ${startDate}`);
    console.log(`End Date: ${endDate}`);

    const totalIncomeAndExpenses = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: { type: '$type' },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const monthlyIncomeAndExpenses = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $project: {
          type: 1,
          amount: 1,
          month: { $month: '$date' },
          year: { $year: '$date' },
        },
      },
      {
        $group: {
          _id: { month: '$month', type: '$type' },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $sort: { '_id.month': 1 },
      },
    ]);

    console.log('Monthly Income and Expenses:', monthlyIncomeAndExpenses);

    const monthlyData = [];
    let totalIncome = 0;
    let totalExpense = 0;

    for (let month = 1; month <= 12; month++) {
      const income = monthlyIncomeAndExpenses.find(
        (entry) => entry._id.month === month && entry._id.type === 'income',
      );
      const expense = monthlyIncomeAndExpenses.find(
        (entry) => entry._id.month === month && entry._id.type === 'expense',
      );

      const incomeAmount = income ? income.totalAmount : 0;
      const expenseAmount = expense ? expense.totalAmount : 0;

      monthlyData.push({
        month,
        income: incomeAmount,
        expense: expenseAmount,
        netTotal: incomeAmount - expenseAmount,
      });

      totalIncome += incomeAmount;
      totalExpense += expenseAmount;
    }

    const netTotal = totalIncome - totalExpense;

    return {
      yearly: { totalIncome, totalExpense, netTotal },
      monthly: monthlyData,
    };
  } catch (error) {
    console.error('Error calculating income and expenses:', error);
    throw new Error('Error calculating income and expenses');
  }
};
