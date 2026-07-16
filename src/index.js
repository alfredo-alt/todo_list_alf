// index.js
// This is the "composition root" / orchestrator: the ONLY file that knows
// about projectManager (business logic), domController (main layout) AND
// modalController (forms/overlays). None of those modules know about each
// other — index.js wires them together via callback functions. This keeps
// assignment point 4 satisfied: application logic and DOM code stay in
// separate, independent modules.

import './styles/style.css';
import * as projectManager from './modules/projectManager.js';
import { toggleComplete, updateDetails } from './modules/todoOperations.js';
import { render } from './modules/domController.js';
import {
  openAddProjectForm,
  openAddTodoForm,
  openTodoDetails,
} from './modules/modalController.js';

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
    openAddProjectForm((name) => {
      const project = projectManager.addProject(name);
      selectedProjectId = project.id;
      renderApp();
    });
  },

  onAddTodo(projectId) {
    if (!projectId) return;
    openAddTodoForm((todoData) => {
      projectManager.addTodoToProject(projectId, todoData);
      renderApp();
    });
  },

  onOpenTodo(projectId, todoId) {
    const { todo } = projectManager.findTodoById(todoId);

    openTodoDetails(
      todo,
      (changes) => {
        updateDetails(todo, changes);
        renderApp();
      },
      () => {
        projectManager.deleteTodoFromProject(projectId, todoId);
        renderApp();
      }
    );
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
