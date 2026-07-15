// Project.js
// Single Responsibility (S in SOLID): ONLY knows what a project is
// (a name + a collection of todos). Doesn't know how individual todos
// are created (that's Todo.js's job) or how anything gets persisted
// (that's Storage.js's job).

function createProject(name) {
  if (!name || typeof name !== 'string') {
    throw new Error('Project requires a valid "name" (non-empty string).');
  }

  return {
    id: crypto.randomUUID(),
    name,
    todos: [], // array of Todo objects (see Todo.js)
  };
}

export { createProject };
