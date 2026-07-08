import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { resetStore } from '../src/store.js';

const app = createApp();

beforeEach(() => resetStore());

async function seedTasks(count: number): Promise<void> {
  for (let i = 1; i <= count; i++) {
    await request(app).post('/tasks').send({ title: `Task number ${i}` });
  }
}

// Issue #2: page 1 skips the first `limit` items.
describe('task list pagination', () => {
  it('returns the first tasks on page 1', async () => {
    await seedTasks(5);
    const res = await request(app).get('/tasks?page=1&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(2);
    expect(res.body.items[0].title).toBe('Task number 1');
    expect(res.body.items[1].title).toBe('Task number 2');
  });

  it('returns the next tasks on page 2', async () => {
    await seedTasks(5);
    const res = await request(app).get('/tasks?page=2&limit=2');
    expect(res.body.items[0].title).toBe('Task number 3');
  });

  it('reports the total count', async () => {
    await seedTasks(5);
    const res = await request(app).get('/tasks?page=1&limit=2');
    expect(res.body.total).toBe(5);
  });
});
