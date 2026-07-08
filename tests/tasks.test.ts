import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { resetStore } from '../src/store.js';

const app = createApp();

beforeEach(() => resetStore());

describe('task lifecycle', () => {
  it('creates a task and reads it back', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Write the report' });
    expect(created.status).toBe(201);
    expect(created.body.title).toBe('Write the report');
    expect(created.body.status).toBe('open');

    const fetched = await request(app).get(`/tasks/${created.body.id}`);
    expect(fetched.status).toBe(200);
    expect(fetched.body.id).toBe(created.body.id);
  });

  it('rejects a missing title', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.status).toBe(400);
  });

  it('rejects an overlong title', async () => {
    const res = await request(app).post('/tasks').send({ title: 'x'.repeat(201) });
    expect(res.status).toBe(400);
  });

  it('updates task status', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Ship the release' });
    const updated = await request(app)
      .patch(`/tasks/${created.body.id}/status`)
      .send({ status: 'done' });
    expect(updated.status).toBe(200);
    expect(updated.body.status).toBe('done');
  });

  it('404s on an unknown task', async () => {
    const res = await request(app).get('/tasks/999');
    expect(res.status).toBe(404);
  });

  it('rejects an invalid status value', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Test the API' });
    const res = await request(app)
      .patch(`/tasks/${created.body.id}/status`)
      .send({ status: 'finished' });
    expect(res.status).toBe(400);
  });
});
