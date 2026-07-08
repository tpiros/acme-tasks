# acme-tasks

A small task-tracker API. Create tasks, list them with pagination and status
filters, and update their status.

> This repository is the demo target for the **pr-fixer-agent**. It ships with a
> few known bugs, tracked as GitHub issues, that the agent fixes live. The test
> suite is intentionally red on `main` — each failing test corresponds to an open
> issue.

## API

| Method | Path | Description |
|---|---|---|
| `POST` | `/tasks` | Create a task. Body: `{ "title": string }`. Any non-empty title up to 200 chars is valid. |
| `GET` | `/tasks?page=1&limit=10&status=open` | List tasks, paginated (1-based pages), optionally filtered by status. |
| `GET` | `/tasks/:id` | Fetch one task. |
| `PATCH` | `/tasks/:id/status` | Update status: `open`, `done`, or `archived`. |

## Development

```bash
npm ci
npm test        # vitest
npm run lint    # tsc --noEmit
npm run dev     # local server on :3000
```
