// Blueprint puro de un Project. Contenedor de Todos.
export class Project {
  constructor(name, id = crypto.randomUUID()) {
    this.id = id;
    this.name = name;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  // Antes: deleteTodo(index) usaba la posición en el array.
  // Ahora: buscamos por id, así que un reordenamiento o filtro futuro no rompe nada.
  deleteTodoById(todoId) {
    this.todos = this.todos.filter((t) => t.id !== todoId);
  }

  findTodoById(todoId) {
    return this.todos.find((t) => t.id === todoId);
  }
}
