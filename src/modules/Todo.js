// Todo.js
// Single Responsibility (S in SOLID): ONLY knows what a todo is and how to build one.
// Knows nothing about: projects, DOM, or localStorage. That lives in other modules.

const PRIORITIES = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
});

/**
 * Factory function to create a todo.
 * Design note: the returned object is plain DATA (no methods/closures).
 * This is intentional for assignment point 8 (localStorage):
 * JSON.stringify does not serialize functions, so if we avoid methods
 * inside the object, there's nothing to "revive" when reading it back.
 */
function createTodo({
  title,
  description = '',
  dueDate = null,
  priority = PRIORITIES.MEDIUM,
  notes = '',
  checklist = [],
} = {}) {
  if (!title || typeof title !== 'string') {
    throw new Error('Todo requires a valid "title" (non-empty string).');
  }
  if (!Object.values(PRIORITIES).includes(priority)) {
    throw new Error(`Invalid priority: ${priority}`);
  }

  return {
    id: crypto.randomUUID(),
    title,
    description,
    dueDate, // stored as an ISO string (e.g. '2026-07-20'), not a Date object
    priority,
    notes,
    checklist, // array of { id, text, done }
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

export { createTodo, PRIORITIES };
