const MAX_TITLE_LENGTH = 200;

export interface ValidationResult {
  ok: boolean;
  error?: string;
}

// Titles must be non-empty (after trimming) and at most 200 characters.
export function validateTitle(title: unknown): ValidationResult {
  if (typeof title !== 'string') {
    return { ok: false, error: 'title must be a string' };
  }
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    return { ok: false, error: 'title must not be empty' };
  }
  if (trimmed.length > MAX_TITLE_LENGTH) {
    return { ok: false, error: `title must be at most ${MAX_TITLE_LENGTH} characters` };
  }
  return { ok: true };
}
