// projectManager.js
// Single Responsibility (S in SOLID): the ONLY place that knows about and
// mutates the global "projects" state. Todo.js and Project.js don't know
// this module exists (low coupling). The DOM never touches this state
// directly either: it always goes through the functions here (this is
// what assignment point 4 requires: separating logic from the DOM).

import { createProject } from './Project';
import { createTodo } from './Todo';

const DEFAULT_PROJECT_NAME = 'Default';

// In-memory state. Nothing outside this module should touch this array
// directly -> it's only exposed through functions (encapsulation).
let projects = [];

/**
 * Initializes the state. If existing projects are passed in (e.g. loaded
 * from localStorage, point 8), they are used. Otherwise, creates the
 * Default project.
 * Design note (D in SOLID - Dependency Inversion): this module doesn't
 * know WHERE the initial projects come from, only that they're passed in.
 */
function init(initialProjects = null) {
  if (initialProjects && initialProjects.length > 0) {
    projects = initialProjects;
  } else {
    projects = [createProject(DEFAULT_PROJECT_NAME)];
  }
  return projects;
}

function getProjects() {
  return projects;
}

function getProjectById(projectId) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) throw new Error(`Project not found: ${projectId}`);
  return project;
}

function addProject(name) {
  const project = createProject(name);
  projects.push(project);
  return project;
}

function deleteProject(projectId) {
  if (projects.length === 1) {
    throw new Error('Cannot delete the only existing project.');
  }
  projects = projects.filter((p) => p.id !== projectId);
}

function addTodoToProject(projectId, todoData) {
  const project = getProjectById(projectId);
  const todo = createTodo(todoData);
  project.todos.push(todo);
  return todo;
}

function deleteTodoFromProject(projectId, todoId) {
  const project = getProjectById(projectId);
  project.todos = project.todos.filter((t) => t.id !== todoId);
}

function findTodoById(todoId) {
  for (const project of projects) {
    const todo = project.todos.find((t) => t.id === todoId);
    if (todo) return { project, todo };
  }
  return null;
}

export {
  init,
  getProjects,
  getProjectById,
  addProject,
  deleteProject,
  addTodoToProject,
  deleteTodoFromProject,
  findTodoById,
  DEFAULT_PROJECT_NAME,
};
