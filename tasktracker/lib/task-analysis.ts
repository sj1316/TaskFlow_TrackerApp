import { Task } from '@/lib/types';
import { generateTaskSuggestions } from './openrouter';

export class TaskAnalysisService {
  static async analyzeTasks(tasks: Task[]) {
    // Extract relevant task patterns and user behavior
    const userBehavior = this.analyzeUserBehavior(tasks);
    
    // Generate suggestions using Gemma model
    const suggestions = await generateTaskSuggestions(tasks, userBehavior);
    
    return suggestions;
  }

  private static analyzeUserBehavior(tasks: Task[]): string {
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const pendingTasks = tasks.filter(task => task.status === 'pending');
    
    // Analyze completion patterns
    const avgCompletionTime = this.calculateAverageCompletionTime(completedTasks);
    const mostProductiveTime = this.findMostProductiveTime(completedTasks);
    const commonCategories = this.findCommonCategories(tasks);
    
    return `
      User typically completes tasks in ${avgCompletionTime} hours.
      Most productive time: ${mostProductiveTime}.
      Common task categories: ${commonCategories.join(', ')}.
      Current pending tasks: ${pendingTasks.length}.
      Recently completed tasks: ${completedTasks.length}.
    `;
  }

  private static calculateAverageCompletionTime(tasks: Task[]): number {
    const tasksWithCompletionTime = tasks.filter(task => 
      task.completedAt && task.createdAt
    );

    if (tasksWithCompletionTime.length === 0) return 0;

    const totalTime = tasksWithCompletionTime.reduce((sum, task) => {
      const completionTime = new Date(task.completedAt!).getTime() - new Date(task.createdAt).getTime();
      return sum + completionTime;
    }, 0);

    return Math.round((totalTime / tasksWithCompletionTime.length) / (1000 * 60 * 60) * 10) / 10;
  }

  private static findMostProductiveTime(tasks: Task[]): string {
    const completionHours = tasks
      .filter(task => task.completedAt)
      .map(task => new Date(task.completedAt!).getHours());

    if (completionHours.length === 0) return 'Not enough data';

    const hourCounts = completionHours.reduce((acc, hour) => {
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const mostProductiveHour = Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)[0][0];

    return `${mostProductiveHour}:00`;
  }

  private static findCommonCategories(tasks: Task[]): string[] {
    const categoryCount = tasks.reduce((acc, task) => {
      if (task.category) {
        acc[task.category] = (acc[task.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
  }
}