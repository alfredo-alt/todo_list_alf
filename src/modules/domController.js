// domController.js
// Single Responsibility (S in SOLID): ONLY knows how to build/update DOM
// elements from data it receives. It does NOT import projectManager and
// does NOT decide what happens when the user clicks something — it just
// receives callback functions and wires them to events.
//
// This is Dependency Inversion (D in SOLID) in practice: domController
// depends on abstractions (callback functions passed as parameters),
// not on the concrete projectManager module. That means we could swap
// projectManager for a totally different state module and domController
// would never need to change.
//
// date-fns is used here (not in Todo.js/projectManager.js) because date
// FORMATTING is a presentation concern, not business logic. The todo's
// dueDate is stored as a plain ISO string ('2026-07-20'); this module is
// the one responsible for turning that into something human-readable.

import { format, isPast, isToday, parseISO } from 'date-fns';

const appRoot = document.getElementById('app');

/**
 * Renders the whole app shell: sidebar (projects) + main content (todos).
 * @param {Array} projects - list of project objects
 * @param {string} selectedProjectId - id of the currently active project
 * @param {Object} callbacks - functions supplied by the orchestrator (index.js)
 */
function render(projects, selectedProjectId, callbacks) {
  appRoot.innerHTML = ''; // clear previous render (simple approach for now)

  const layout = document.createElement('div');
  layout.className = 'app-layout';

  layout.appendChild(renderSidebar(projects, selectedProjectId, callbacks));
  layout.appendChild(renderMainContent(projects, selectedProjectId, callbacks));

  appRoot.appendChild(layout);
}

function renderSidebar(projects, selectedProjectId, callbacks) {
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';

  const heading = document.createElement('h2');
  heading.textContent = 'Projects';
  sidebar.appendChild(heading);

  const list = document.createElement('ul');
  list.className = 'project-list';

  projects.forEach((project) => {
    const item = document.createElement('li');
    item.textContent = project.name;
    item.className = 'project-list__item';
    if (project.id === selectedProjectId) {
      item.classList.add('project-list__item--active');
    }
    item.addEventListener('click', () => callbacks.onSelectProject(project.id));
    list.appendChild(item);
  });

  sidebar.appendChild(list);

  const addBtn = document.createElement('button');
  addBtn.textContent = '+ New Project';
  addBtn.className = 'btn btn--secondary';
  addBtn.addEventListener('click', () => callbacks.onAddProject());
  sidebar.appendChild(addBtn);

  return sidebar;
}

function renderMainContent(projects, selectedProjectId, callbacks) {
  const main = document.createElement('main');
  main.className = 'main-content';

  const project = projects.find((p) => p.id === selectedProjectId);

  const header = document.createElement('div');
  header.className = 'main-content__header';

  const title = document.createElement('h1');
  title.textContent = project ? project.name : 'No project selected';
  header.appendChild(title);

  const addTodoBtn = document.createElement('button');
  addTodoBtn.textContent = '+ New Todo';
  addTodoBtn.className = 'btn btn--primary';
  addTodoBtn.addEventListener('click', () => callbacks.onAddTodo(selectedProjectId));
  header.appendChild(addTodoBtn);

  main.appendChild(header);

  if (project) {
    main.appendChild(renderTodoList(project, callbacks));
  }

  return main;
}

function renderTodoList(project, callbacks) {
  const list = document.createElement('ul');
  list.className = 'todo-list';

  project.todos.forEach((todo) => {
    list.appendChild(renderTodoItem(project.id, todo, callbacks));
  });

  return list;
}

function renderTodoItem(projectId, todo, callbacks) {
  const item = document.createElement('li');
  item.className = `todo-item priority-${todo.priority}`;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;
  checkbox.addEventListener('change', () => callbacks.onToggleComplete(projectId, todo.id));
  item.appendChild(checkbox);

  const title = document.createElement('span');
  title.textContent = todo.title;
  title.className = 'todo-item__title';
  if (todo.completed) title.classList.add('todo-item__title--done');
  title.addEventListener('click', () => callbacks.onOpenTodo(projectId, todo.id));
  item.appendChild(title);

  if (todo.dueDate) {
    const date = document.createElement('span');
    date.textContent = formatDueDate(todo.dueDate);
    date.className = 'todo-item__date';

    // Mark overdue todos (but don't nag about ones already completed).
    if (!todo.completed && isPast(parseISO(todo.dueDate)) && !isToday(parseISO(todo.dueDate))) {
      date.classList.add('todo-item__date--overdue');
    }

    item.appendChild(date);
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'btn btn--danger';
  deleteBtn.addEventListener('click', () => callbacks.onDeleteTodo(projectId, todo.id));
  item.appendChild(deleteBtn);

  return item;
}

// Turns '2026-07-20' into something like 'Jul 20, 2026'.
// 'Today' is shown instead of the full date when it matches the current day.
function formatDueDate(isoDateString) {
  const date = parseISO(isoDateString);
  if (isToday(date)) return 'Today';
  return format(date, 'MMM d, yyyy');
}

export { render };
