import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: {
    type: String,
    enum: [
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
    ],
    required: true,
  },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
});

export const Transaction = model('Transaction', transactionSchema);
