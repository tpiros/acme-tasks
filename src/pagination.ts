export interface Page<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

// Pages are 1-based: page 1 returns the first `limit` items.
export function paginate<T>(all: T[], page: number, limit: number): Page<T> {
  const start = page * limit;
  return {
    items: all.slice(start, start + limit),
    page,
    limit,
    total: all.length,
  };
}
