export type TaskStatus = 'open' | 'done' | 'archived';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  createdAt: string;
}

let nextId = 1;
let tasks: Task[] = [];

export function resetStore(seed: Task[] = []): void {
  tasks = [...seed];
  nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}

export function createTask(title: string): Task {
  const task: Task = {
    id: nextId++,
    title,
    status: 'open',
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

export function getTask(id: number): Task | undefined {
  return tasks.find((t) => t.id === id);
}

export function listTasks(): Task[] {
  return tasks;
}

export function updateStatus(id: number, status: TaskStatus): Task | undefined {
  const task = getTask(id);
  if (task) task.status = status;
  return task;
}
