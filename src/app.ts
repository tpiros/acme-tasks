import express from 'express';
import { paginate } from './pagination.js';
import {
  createTask,
  getTask,
  listTasks,
  updateStatus,
  type Task,
  type TaskStatus,
} from './store.js';
import { validateTitle } from './validation.js';

const VALID_STATUSES: TaskStatus[] = ['open', 'done', 'archived'];

export function createApp(): express.Express {
  const app = express();
  app.use(express.json());

  app.post('/tasks', (req, res) => {
    const { title } = req.body ?? {};
    const result = validateTitle(title);
    if (!result.ok) {
      return res.status(400).json({ error: result.error });
    }
    const task = createTask((title as string).trim());
    res.status(201).json(task);
  });

  app.get('/tasks', (req, res) => {
    const status = req.query.status as string | undefined;
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
      return res.status(400).json({ error: 'page and limit must be positive integers' });
    }

    let tasks: Task[] = listTasks();
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status as TaskStatus)) {
        return res.status(400).json({ error: `status must be one of ${VALID_STATUSES.join(', ')}` });
      }
      tasks = tasks.filter((t) => t.status === status);
    }

    res.json(paginate(tasks, page, limit));
  });

  app.get('/tasks/:id', (req, res) => {
    const task = getTask(Number(req.params.id));
    if (!task) return res.status(404).json({ error: 'task not found' });
    res.json(task);
  });

  app.patch('/tasks/:id/status', (req, res) => {
    const { status } = req.body ?? {};
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of ${VALID_STATUSES.join(', ')}` });
    }
    const task = updateStatus(Number(req.params.id), status);
    if (!task) return res.status(404).json({ error: 'task not found' });
    res.json(task);
  });

  return app;
}
