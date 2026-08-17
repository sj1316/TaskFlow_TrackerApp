import mongoose from 'mongoose';
import { Task } from '../types';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
  status: { type: String, enum: ['pending', 'completed'], required: true },
  category: { type: String },
  dueDate: { type: String, required: true },
  createdAt: { type: String, required: true },
  completedAt: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export const TaskModel = mongoose.models.Task || mongoose.model('Task', taskSchema);