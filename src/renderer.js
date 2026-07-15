import { formatDueDate } from './dateHelpers.js';

// Responsabilidad única: pintar el DOM a partir de datos que le pasan.
// No importa Storage. No decide qué proyecto está activo. No sabe qué pasa
// cuando el usuario hace click -- solo avisa (callbacks) y deja que quien
// lo use decida qué hacer.
export class Renderer {
  constructor({ projectListEl, todoListEl, activeTitleEl }) {
    this.projectListEl = projectListEl;
    this.todoListEl = todoListEl;
    this.activeTitleEl = activeTitleEl;
  }

  renderProjects(projects, activeProjectId, onSelect) {
    this.projectListEl.innerHTML = '';
    projects.forEach((project) => {
      const li = document.createElement('li');
      li.textContent = project.name;
      if (project.id === activeProjectId) li.classList.add('active');
      li.addEventListener('click', () => onSelect(project.id));
      this.projectListEl.appendChild(li);
    });
  }

  renderTodos(project, { onToggle, onEdit, onDelete }) {
    this.activeTitleEl.textContent = project.name;
    this.todoListEl.innerHTML = '';

    project.todos.forEach((todo) => {
      const todoEl = this.buildTodoElement(todo, { onToggle, onEdit, onDelete });
      this.todoListEl.appendChild(todoEl);
    });
  }

  buildTodoElement(todo, { onToggle, onEdit, onDelete }) {
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo-item', `priority-${todo.priority}`);
    if (todo.completed) todoDiv.classList.add('completed');

    const infoDiv = document.createElement('div');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => onToggle(todo.id));

    const titleSpan = document.createElement('span');
    titleSpan.classList.add('todo-title');
    titleSpan.textContent = ` ${todo.title} - (${formatDueDate(todo.dueDate)})`;

    infoDiv.append(checkbox, titleSpan);

    const actionsDiv = document.createElement('div');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit/View';
    editBtn.addEventListener('click', () => onEdit(todo.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => onDelete(todo.id));

    actionsDiv.append(editBtn, deleteBtn);
    todoDiv.append(infoDiv, actionsDiv);
    return todoDiv;
  }

  fillTodoForm(todo) {
    document.getElementById('todo-title').value = todo.title;
    document.getElementById('todo-desc').value = todo.description;
    document.getElementById('todo-date').value = todo.dueDate;
    document.getElementById('todo-priority').value = todo.priority;
    document.getElementById('todo-notes').value = todo.notes;
  }
}
