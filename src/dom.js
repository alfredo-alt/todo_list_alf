import { Todo } from './todo.js';
import { Project } from './project.js';
import { Storage } from './storage.js';

export class DomController {
  constructor() {
    this.projects = Storage.loadProjects();
    this.activeProjectIndex = 0;

    // Cache DOM elements
    this.projectListElement = document.getElementById('project-list');
    this.todoListElement = document.getElementById('todo-list');
    this.activeTitleElement = document.getElementById('active-project-title');
    this.newProjectForm = document.getElementById('new-project-form');
    this.newProjectInput = document.getElementById('new-project-input');
    
    this.modal = document.getElementById('todo-modal');
    this.todoForm = document.getElementById('todo-form');
    this.addTodoBtn = document.getElementById('add-todo-btn');
    this.closeModalBtn = document.getElementById('close-modal-btn');

    this.initEventListeners();
    this.render();
  }

  // Binds user inputs/clicks to their handlers
  initEventListeners() {
    // Project selection and creation
    this.newProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const projectName = this.newProjectInput.value.trim();
      if (projectName) {
        this.projects.push(new Project(projectName));
        this.newProjectInput.value = '';
        Storage.saveProjects(this.projects);
        this.render();
      }
    });

    // Open Modal for new Todo
    this.addTodoBtn.addEventListener('click', () => {
      this.openTodoModal();
    });

    // Close Modal
    this.closeModalBtn.addEventListener('click', () => {
      this.modal.classList.add('hidden');
    });

    // Submit Todo Form (Creates or Edits)
    this.todoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveTodoFromForm();
    });
  }

  // Renders both the sidebar and the current active project list
  render() {
    this.renderProjects();
    this.renderTodos();
  }

  renderProjects() {
    this.projectListElement.innerHTML = '';
    this.projects.forEach((project, index) => {
      const li = document.createElement('li');
      li.textContent = project.name;
      if (index === this.activeProjectIndex) {
        li.classList.add('active');
      }
      li.addEventListener('click', () => {
        this.activeProjectIndex = index;
        this.render();
      });
      this.projectListElement.appendChild(li);
    });
  }

  renderTodos() {
    const activeProject = this.projects[this.activeProjectIndex];
    this.activeTitleElement.textContent = activeProject.name;
    this.todoListElement.innerHTML = '';

    activeProject.todos.forEach((todo, index) => {
      const todoDiv = document.createElement('div');
      todoDiv.classList.add('todo-item', `priority-${todo.priority}`);
      if (todo.completed) todoDiv.classList.add('completed');

      // Left Column: Completion Checkbox & Info
      const infoDiv = document.createElement('div');
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.addEventListener('change', () => {
        todo.toggleComplete();
        Storage.saveProjects(this.projects);
        this.render();
      });

      const titleSpan = document.createElement('span');
      titleSpan.classList.add('todo-title');
      titleSpan.textContent = ` ${todo.title} - (${todo.dueDate})`;

      infoDiv.appendChild(checkbox);
      infoDiv.appendChild(titleSpan);

      // Right Column: Action Buttons
      const actionsDiv = document.createElement('div');
      
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit/View';
      editBtn.addEventListener('click', () => this.openTodoModal(todo, index));

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        activeProject.deleteTodo(index);
        Storage.saveProjects(this.projects);
        this.render();
      });

      actionsDiv.appendChild(editBtn);
      actionsDiv.appendChild(deleteBtn);

      todoDiv.appendChild(infoDiv);
      todoDiv.appendChild(actionsDiv);
      this.todoListElement.appendChild(todoDiv);
    });
  }

  // Opens modal, prepopulating details if we are editing an existing Todo
  openTodoModal(todo = null, index = null) {
    this.todoForm.reset();
    const modalTitle = document.getElementById('modal-title');
    const indexInput = document.getElementById('todo-index-input');

    if (todo !== null) {
      modalTitle.textContent = 'Edit Todo Details';
      indexInput.value = index;
      document.getElementById('todo-title').value = todo.title;
      document.getElementById('todo-desc').value = todo.description;
      document.getElementById('todo-date').value = todo.dueDate;
      document.getElementById('todo-priority').value = todo.priority;
      document.getElementById('todo-notes').value = todo.notes;
    } else {
      modalTitle.textContent = 'Create New Todo';
      indexInput.value = ''; // Empty means a new Todo
    }
    this.modal.classList.remove('hidden');
  }

  // Pulls data from form and writes to memory & LocalStorage
  saveTodoFromForm() {
    const activeProject = this.projects[this.activeProjectIndex];
    
    const index = document.getElementById('todo-index-input').value;
    const title = document.getElementById('todo-title').value;
    const description = document.getElementById('todo-desc').value;
    const dueDate = document.getElementById('todo-date').value;
    const priority = document.getElementById('todo-priority').value;
    const notes = document.getElementById('todo-notes').value;

    if (index !== '') {
      // If index has a value, we are updating an existing Todo
      activeProject.todos[index].update(title, description, dueDate, priority, notes);
    } else {
      // If index is empty, we are creating a brand new Todo
      const newTodo = new Todo(title, description, dueDate, priority, notes);
      activeProject.addTodo(newTodo);
    }

    Storage.saveProjects(this.projects);
    this.modal.classList.add('hidden');
    this.render();
  }
}