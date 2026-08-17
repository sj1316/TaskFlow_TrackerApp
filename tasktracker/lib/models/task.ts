import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  priority: { type: String, required: true, enum: ['low', 'medium', 'high'] },
  status: { type: String, required: true, enum: ['pending', 'completed'] },
  dueDate: { type: String, required: true },
  createdAt: { type: String, required: true },
  completedAt: { type: String }
})

// Create indexes for better query performance
taskSchema.index({ userId: 1 })
taskSchema.index({ status: 1 })
taskSchema.index({ dueDate: 1 })

export const TaskModel = mongoose.models.Task || mongoose.model('Task', taskSchema)