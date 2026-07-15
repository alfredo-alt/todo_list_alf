// Defines the Blueprint for Projects which hold arrays of Todos
export class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  deleteTodo(todoIndex) {
    this.todos.splice(todoIndex, 1);
  }
}