import { Todo } from './todo.js';
import { Project } from './project.js';
import { Storage } from './storage.js';
import { Renderer } from './renderer.js';

// Responsabilidad única: coordinar estado de la app (proyectos, proyecto activo)
// y decidir CUÁNDO guardar/renderizar. No construye elementos del DOM directamente
// (eso es trabajo del Renderer) y no sabe CÓMO se guarda en disco (eso es Storage).
export class AppController {
  // Storage inyectado por parámetro (con default) -> permite testear con un
  // storage falso sin tocar localStorage real. Esto es Dependency Inversion.
  constructor(storage = Storage) {
    this.storage = storage;
    this.projects = this.storage.loadProjects();
    this.activeProjectId = this.projects[0].id;

    this.renderer = new Renderer({
      projectListEl: document.getElementById('project-list'),
      todoListEl: document.getElementById('todo-list'),
      activeTitleEl: document.getElementById('active-project-title'),
    });

    this.newProjectForm = document.getElementById('new-project-form');
    this.newProjectInput = document.getElementById('new-project-input');
    this.modal = document.getElementById('todo-modal');
    this.todoForm = document.getElementById('todo-form');
    this.addTodoBtn = document.getElementById('add-todo-btn');
    this.closeModalBtn = document.getElementById('close-modal-btn');

    this.editingTodoId = null; // reemplaza al viejo "todo-index-input"

    this.initEventListeners();
    this.render();
  }

  initEventListeners() {
    this.newProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = this.newProjectInput.value.trim();
      if (!name) return;
      this.projects.push(new Project(name));
      this.newProjectInput.value = '';
      this.persistAndRender();
    });

    this.addTodoBtn.addEventListener('click', () => this.openTodoModal());
    this.closeModalBtn.addEventListener('click', () => this.modal.classList.add('hidden'));

    this.todoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveTodoFromForm();
    });
  }

  getActiveProject() {
    return this.projects.find((p) => p.id === this.activeProjectId);
  }

  render() {
    this.renderer.renderProjects(this.projects, this.activeProjectId, (projectId) => {
      this.activeProjectId = projectId;
      this.render();
    });

    this.renderer.renderTodos(this.getActiveProject(), {
      onToggle: (todoId) => this.toggleTodo(todoId),
      onEdit: (todoId) => this.openTodoModal(todoId),
      onDelete: (todoId) => this.deleteTodo(todoId),
    });
  }

  toggleTodo(todoId) {
    this.getActiveProject().findTodoById(todoId).toggleComplete();
    this.persistAndRender();
  }

  deleteTodo(todoId) {
    this.getActiveProject().deleteTodoById(todoId);
    this.persistAndRender();
  }

  openTodoModal(todoId = null) {
    this.todoForm.reset();
    this.editingTodoId = todoId;
    const modalTitle = document.getElementById('modal-title');

    if (todoId !== null) {
      modalTitle.textContent = 'Edit Todo Details';
      const todo = this.getActiveProject().findTodoById(todoId);
      this.renderer.fillTodoForm(todo);
    } else {
      modalTitle.textContent = 'Create New Todo';
    }
    this.modal.classList.remove('hidden');
  }

  saveTodoFromForm() {
    const title = document.getElementById('todo-title').value;
    const description = document.getElementById('todo-desc').value;
    const dueDate = document.getElementById('todo-date').value;
    const priority = document.getElementById('todo-priority').value;
    const notes = document.getElementById('todo-notes').value;

    if (this.editingTodoId !== null) {
      this.getActiveProject()
        .findTodoById(this.editingTodoId)
        .update(title, description, dueDate, priority, notes);
    } else {
      this.getActiveProject().addTodo(new Todo(title, description, dueDate, priority, notes));
    }

    this.modal.classList.add('hidden');
    this.persistAndRender();
  }

  persistAndRender() {
    this.storage.saveProjects(this.projects);
    this.render();
  }
}
