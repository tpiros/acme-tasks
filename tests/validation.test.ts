import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { resetStore } from '../src/store.js';

const app = createApp();

beforeEach(() => resetStore());

// Issue #1: short but valid titles are rejected.
describe('title validation', () => {
  it('accepts a one-character title', async () => {
    const res = await request(app).post('/tasks').send({ title: 'X' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('X');
  });

  it('accepts a two-character title', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Do' });
    expect(res.status).toBe(201);
  });

  it('rejects a whitespace-only title', async () => {
    const res = await request(app).post('/tasks').send({ title: '   ' });
    expect(res.status).toBe(400);
  });
});
