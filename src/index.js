// index.js
// This is the "composition root" / orchestrator: the ONLY file that knows
// about BOTH projectManager (business logic) AND domController (DOM).
// Neither of those two modules knows about each other — index.js is what
// wires them together via callback functions. This keeps assignment
// point 4 satisfied: application logic and DOM code stay in separate,
// independent modules.

import './styles/style.css';
import * as projectManager from './modules/projectManager.js';
import { toggleComplete } from './modules/todoOperations.js';
import { render } from './modules/domController.js';

// UI-only state (which project is currently selected). This is NOT
// business data, so it doesn't belong in projectManager.
let selectedProjectId = null;

function renderApp() {
  const projects = projectManager.getProjects();
  render(projects, selectedProjectId, callbacks);
}

const callbacks = {
  onSelectProject(projectId) {
    selectedProjectId = projectId;
    renderApp();
  },

  onAddProject() {
    // Simple prompt-based input for now.
    // A proper form/modal will be built in assignment point 5.
    const name = window.prompt('New project name:');
    if (!name) return;
    const project = projectManager.addProject(name);
    selectedProjectId = project.id;
    renderApp();
  },

  onAddTodo(projectId) {
    if (!projectId) return;
    const title = window.prompt('Todo title:');
    if (!title) return;
    projectManager.addTodoToProject(projectId, { title });
    renderApp();
  },

  onToggleComplete(projectId, todoId) {
    const { todo } = projectManager.findTodoById(todoId);
    toggleComplete(todo); // business logic lives in todoOperations, not here
    renderApp();
  },

  onDeleteTodo(projectId, todoId) {
    projectManager.deleteTodoFromProject(projectId, todoId);
    renderApp();
  },
};

function init() {
  const projects = projectManager.init(); // no saved data yet (point 8 comes later)
  selectedProjectId = projects[0].id;
  renderApp();
}

init();
