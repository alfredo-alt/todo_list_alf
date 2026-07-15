export class Todo {
  constructor(title, description, dueDate, priority, notes = '', completed = false) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate; // Expects a date string (YYYY-MM-DD)
    this.priority = priority; // 'low', 'medium', or 'high'
    this.notes = notes;
    this.completed = completed;
  }

  // Toggles completion status of the todo
  toggleComplete() {
    this.completed = !this.completed;
  }

  // Updates todo properties during edit
  update(title, description, dueDate, priority, notes) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
  }
}