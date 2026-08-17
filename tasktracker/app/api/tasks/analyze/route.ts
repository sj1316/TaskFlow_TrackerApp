import { NextRequest, NextResponse } from 'next/server';
import { TaskAnalysisService } from '@/lib/task-analysis';
import { authUtils } from '@/lib/auth';
import { UserModel } from '@/lib/models/userModel';
import { TaskModel } from '@/lib/models/taskModel';
import dbConnect from '@/lib/db';
import { Task, AuthUser } from '@/lib/types';
import { Types } from 'mongoose';

// Helper function to verify auth token from headers
async function verifyAuth(req: NextRequest): Promise<AuthUser | null> {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return null;
  return await authUtils.verifyToken(token);
}

interface MongoTask {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";
  category?: string;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  userId: Types.ObjectId;
}


export async function GET(req: NextRequest) {
  try {
    const authUser = await verifyAuth(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized - Invalid or missing token' }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Find user
    const user = await UserModel.findOne({ email: authUser.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch user's tasks
    const mongoTasks = await TaskModel.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(50) // Analyze last 50 tasks
      .lean();

    // Transform to Task interface
    const tasks = mongoTasks.map(task => ({
      id: (task as any)._id.toString(),
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      category: task.category,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      completedAt: task.completedAt
    }));

    // Generate task suggestions
    try {
      const suggestions = await TaskAnalysisService.analyzeTasks(tasks);
      return NextResponse.json({ suggestions });
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return NextResponse.json({ suggestions: "Unable to generate task suggestions at this moment." });
    }
  } catch (error) {
    console.error('Error analyzing tasks:', error);
    return NextResponse.json(
      { error: 'Failed to analyze tasks' },
      { status: 500 }
    );
  }
}