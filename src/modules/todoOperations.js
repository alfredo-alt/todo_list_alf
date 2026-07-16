// todoOperations.js
// Pure functions that operate on an already-created todo.
// None of these functions know about the DOM or localStorage (S in SOLID).
// By receiving the todo as a parameter (instead of a method `this.toggle()`),
// we completely avoid the "revive methods" problem when reading from
// localStorage: there are no methods to lose, only data.

import { PRIORITIES } from './Todo.js';

function toggleComplete(todo) {
  todo.completed = !todo.completed;
  return todo;
}

function updateDetails(todo, changes = {}) {
  // Whitelisted fields instead of blind Object.assign -> Open/Closed (O in SOLID):
  // if we add a new field to the todo later, this function doesn't need to change
  // as long as it's added to the allowed list.
  const allowedFields = ['title', 'description', 'dueDate', 'priority', 'notes'];
  allowedFields.forEach((field) => {
    if (field in changes) {
      todo[field] = changes[field];
    }
  });
  return todo;
}

function setPriority(todo, priority) {
  if (!Object.values(PRIORITIES).includes(priority)) {
    throw new Error(`Invalid priority: ${priority}`);
  }
  todo.priority = priority;
  return todo;
}

function addChecklistItem(todo, text) {
  todo.checklist.push({
    id: crypto.randomUUID(),
    text,
    done: false,
  });
  return todo;
}

function toggleChecklistItem(todo, itemId) {
  const item = todo.checklist.find((i) => i.id === itemId);
  if (item) item.done = !item.done;
  return todo;
}

export {
  toggleComplete,
  updateDetails,
  setPriority,
  addChecklistItem,
  toggleChecklistItem,
};
