import { useEffect, useRef, useCallback } from 'react';
import { logger } from '@/lib/productionLogger';

interface TimerTask {
  id: string;
  callback: () => void;
  interval: number;
  lastRun: number;
  priority: 'high' | 'medium' | 'low';
}

type TimerTaskConfig = Omit<TimerTask, 'lastRun'>;

/**
 * Consolidated timer system to reduce the number of active setInterval/setTimeout
 * Instead of having multiple intervals, we have one master timer that runs all tasks
 */
class ConsolidatedTimerManager {
  private tasks = new Map<string, TimerTask>();
  private masterTimer: NodeJS.Timeout | null = null;
  private isRunning = false;
  private readonly masterInterval = 1000; // 1 second master tick

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.masterTimer = setInterval(() => {
      this.processTasks();
    }, this.masterInterval);
    
    logger.debug('ConsolidatedTimerManager: Started');
  }

  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.masterTimer) {
      clearInterval(this.masterTimer);
      this.masterTimer = null;
    }
    
    logger.debug('ConsolidatedTimerManager: Stopped');
  }

  addTask(config: TimerTaskConfig) {
    const task: TimerTask = {
      ...config,
      lastRun: 0
    };
    
    this.tasks.set(config.id, task);
    logger.debug(`ConsolidatedTimerManager: Added task ${config.id}`);
    
    // Start timer if it's not running and we have tasks
    if (!this.isRunning && this.tasks.size > 0) {
      this.start();
    }
  }

  removeTask(id: string) {
    this.tasks.delete(id);
    logger.debug(`ConsolidatedTimerManager: Removed task ${id}`);
    
    // Stop timer if no tasks remain
    if (this.tasks.size === 0) {
      this.stop();
    }
  }

  private processTasks() {
    const now = Date.now();
    
    // Sort by priority (high priority tasks run first)
    const sortedTasks = Array.from(this.tasks.values()).sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    for (const task of sortedTasks) {
      const timeSinceLastRun = now - task.lastRun;
      
      if (timeSinceLastRun >= task.interval) {
        try {
          task.callback();
          task.lastRun = now;
        } catch (error) {
          logger.error(`ConsolidatedTimerManager: Error in task ${task.id}`, error);
        }
      }
    }
  }

  getStats() {
    return {
      taskCount: this.tasks.size,
      isRunning: this.isRunning,
      tasks: Array.from(this.tasks.keys())
    };
  }

  destroy() {
    this.stop();
    this.tasks.clear();
    logger.debug('ConsolidatedTimerManager: Destroyed');
  }
}

// Global instance
const timerManager = new ConsolidatedTimerManager();

// Hook for using consolidated timers
export const useConsolidatedTimers = () => {
  const tasksRef = useRef<Set<string>>(new Set());

  const addTimer = useCallback((config: TimerTaskConfig) => {
    timerManager.addTask(config);
    tasksRef.current.add(config.id);
  }, []);

  const removeTimer = useCallback((id: string) => {
    timerManager.removeTask(id);
    tasksRef.current.delete(id);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Remove all tasks registered by this hook instance
      tasksRef.current.forEach(id => {
        timerManager.removeTask(id);
      });
      tasksRef.current.clear();
    };
  }, []);

  return {
    addTimer,
    removeTimer,
    getStats: () => timerManager.getStats()
  };
};

// For debugging
if (typeof window !== 'undefined') {
  (window as any).timerManager = timerManager;
}

export default timerManager;