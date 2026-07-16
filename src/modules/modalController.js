// modalController.js
// Single Responsibility (S in SOLID): ONLY knows how to build and show/hide
// a modal dialog. Like domController, it never imports projectManager —
// it receives data and callbacks from the orchestrator (index.js).
// Keeping this separate from domController.js also follows SRP: domController
// renders the main layout, modalController renders overlays/forms. Two
// different reasons to change -> two different files.
//
// Design note: this module DOES import addChecklistItem/toggleChecklistItem
// from todoOperations. That's a deliberate exception: those are pure,
// stateless functions that just mutate the todo object passed to them —
// they don't touch global state (projectManager) or persistence. Importing
// projectManager here would break Dependency Inversion (index.js would no
// longer be the single place wiring business logic to DOM). Importing a
// pure helper function does not have that problem.

import { addChecklistItem, toggleChecklistItem } from './todoOperations.js';

const overlay = document.createElement('div');
overlay.className = 'modal-overlay';
overlay.style.display = 'none';
document.body.appendChild(overlay);

function closeModal() {
  overlay.style.display = 'none';
  overlay.innerHTML = '';
}

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal(); // click outside the card closes it
});

/**
 * Opens a modal with arbitrary form content built by the caller.
 * @param {HTMLElement} contentEl - the form/content element to display
 */
function openModal(contentEl) {
  overlay.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'modal-card';
  card.appendChild(contentEl);
  overlay.appendChild(card);
  overlay.style.display = 'flex';
}

/**
 * Builds and opens the "add project" form.
 * @param {(name: string) => void} onSubmit
 */
function openAddProjectForm(onSubmit) {
  const form = document.createElement('form');
  form.className = 'modal-form';
  form.innerHTML = `
    <h2>New Project</h2>
    <label>
      Name
      <input type="text" name="name" required autofocus />
    </label>
    <div class="modal-form__actions">
      <button type="button" class="btn btn--secondary" data-action="cancel">Cancel</button>
      <button type="submit" class="btn btn--primary">Create</button>
    </div>
  `;

  form.querySelector('[data-action="cancel"]').addEventListener('click', closeModal);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    if (!name) return;
    onSubmit(name);
    closeModal();
  });

  openModal(form);
}

/**
 * Builds and opens the "add todo" form.
 * @param {(data: {title: string, description: string, dueDate: string, priority: string}) => void} onSubmit
 */
function openAddTodoForm(onSubmit) {
  const form = document.createElement('form');
  form.className = 'modal-form';
  form.innerHTML = `
    <h2>New Todo</h2>
    <label>
      Title
      <input type="text" name="title" required autofocus />
    </label>
    <label>
      Description
      <textarea name="description" rows="3"></textarea>
    </label>
    <label>
      Due date
      <input type="date" name="dueDate" />
    </label>
    <label>
      Priority
      <select name="priority">
        <option value="low">Low</option>
        <option value="medium" selected>Medium</option>
        <option value="high">High</option>
      </select>
    </label>
    <div class="modal-form__actions">
      <button type="button" class="btn btn--secondary" data-action="cancel">Cancel</button>
      <button type="submit" class="btn btn--primary">Add Todo</button>
    </div>
  `;

  form.querySelector('[data-action="cancel"]').addEventListener('click', closeModal);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = form.elements.title.value.trim();
    if (!title) return;
    onSubmit({
      title,
      description: form.elements.description.value.trim(),
      dueDate: form.elements.dueDate.value || null,
      priority: form.elements.priority.value,
    });
    closeModal();
  });

  openModal(form);
}

/**
 * Builds and opens the "todo details" view/edit form.
 * @param {Object} todo - the todo to view/edit
 * @param {(changes: Object) => void} onSave
 * @param {() => void} onDelete
 */
function openTodoDetails(todo, onSave, onDelete) {
  const form = document.createElement('form');
  form.className = 'modal-form';
  form.innerHTML = `
    <h2>Todo Details</h2>
    <label>
      Title
      <input type="text" name="title" value="${escapeHtml(todo.title)}" required />
    </label>
    <label>
      Description
      <textarea name="description" rows="3">${escapeHtml(todo.description)}</textarea>
    </label>
    <label>
      Due date
      <input type="date" name="dueDate" value="${todo.dueDate || ''}" />
    </label>
    <label>
      Priority
      <select name="priority">
        <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>Low</option>
        <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>Medium</option>
        <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>High</option>
      </select>
    </label>
    <label>
      Notes
      <textarea name="notes" rows="2">${escapeHtml(todo.notes)}</textarea>
    </label>
    <div class="checklist-section">
      <span class="checklist-section__label">Checklist</span>
      <ul class="checklist" data-role="checklist-list"></ul>
      <div class="checklist-add">
        <input type="text" data-role="checklist-input" placeholder="Add item..." />
        <button type="button" class="btn btn--secondary" data-action="add-item">Add</button>
      </div>
    </div>
    <div class="modal-form__actions">
      <button type="button" class="btn btn--danger" data-action="delete">Delete</button>
      <button type="button" class="btn btn--secondary" data-action="cancel">Cancel</button>
      <button type="submit" class="btn btn--primary">Save</button>
    </div>
  `;

  renderChecklistItems(form, todo);

  form.querySelector('[data-action="add-item"]').addEventListener('click', () => {
    const input = form.querySelector('[data-role="checklist-input"]');
    const text = input.value.trim();
    if (!text) return;
    addChecklistItem(todo, text); // mutates todo.checklist directly (pure helper)
    input.value = '';
    renderChecklistItems(form, todo); // re-render only the checklist list
  });

  form.querySelector('[data-action="cancel"]').addEventListener('click', closeModal);
  form.querySelector('[data-action="delete"]').addEventListener('click', () => {
    onDelete();
    closeModal();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    onSave({
      title: form.elements.title.value.trim(),
      description: form.elements.description.value.trim(),
      dueDate: form.elements.dueDate.value || null,
      priority: form.elements.priority.value,
      notes: form.elements.notes.value.trim(),
    });
    closeModal();
  });

  openModal(form);
}

// Renders (or re-renders) just the <ul> of checklist items inside a form.
// Kept separate so we can call it again after adding/toggling an item
// WITHOUT closing the modal or losing whatever the user already typed
// in the other fields (title, description, etc.).
function renderChecklistItems(form, todo) {
  const list = form.querySelector('[data-role="checklist-list"]');
  list.innerHTML = '';

  todo.checklist.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'checklist__item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.done;
    checkbox.addEventListener('change', () => {
      toggleChecklistItem(todo, item.id); // mutates todo.checklist directly
      renderChecklistItems(form, todo);
    });
    li.appendChild(checkbox);

    const text = document.createElement('span');
    text.textContent = item.text;
    if (item.done) text.classList.add('checklist__item-text--done');
    li.appendChild(text);

    list.appendChild(li);
  });
}

// Small helper to avoid breaking the HTML when a todo's text contains
// characters like <, >, or &.
function escapeHtml(str = '') {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export { openAddProjectForm, openAddTodoForm, openTodoDetails, closeModal };
