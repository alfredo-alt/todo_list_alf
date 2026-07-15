// Blueprint puro de un Todo. No sabe nada de DOM ni de localStorage.
export class Todo {
  constructor(
    title,
    description,
    dueDate,
    priority,
    notes = '',
    completed = false,
    id = crypto.randomUUID() // <-- NUEVO: id estable, ya no dependemos del índice del array
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate; // string ISO 'YYYY-MM-DD'
    this.priority = priority; // 'low' | 'medium' | 'high'
    this.notes = notes;
    this.completed = completed;
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  update(title, description, dueDate, priority, notes) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
  }
}
