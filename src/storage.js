import { Project } from './project.js';
import { Todo } from './todo.js';

// Única responsabilidad: hablar con localStorage. No sabe nada de DOM ni de renderizado.
export class Storage {
  static saveProjects(projects) {
    localStorage.setItem('todoAppProjects', JSON.stringify(projects));
  }

  static loadProjects() {
    const rawData = localStorage.getItem('todoAppProjects');

    if (!rawData) {
      const defaultProject = new Project('Default Project');
      defaultProject.addTodo(
        new Todo(
          'Welcome to your Todo App!',
          'This is a sample todo. Expand me to see details!',
          '2026-12-31',
          'medium',
          'This is a note inside a todo.'
        )
      );
      return [defaultProject];
    }

    const parsedData = JSON.parse(rawData);

    // Reconstruimos instancias reales (no objetos planos) para que
    // toggleComplete(), update(), etc. sigan existiendo después de JSON.parse.
    // Preservamos el id guardado en vez de generar uno nuevo.
    return parsedData.map((projData) => {
      const project = new Project(projData.name, projData.id);
      project.todos = projData.todos.map(
        (todoData) =>
          new Todo(
            todoData.title,
            todoData.description,
            todoData.dueDate,
            todoData.priority,
            todoData.notes,
            todoData.completed,
            todoData.id
          )
      );
      return project;
    });
  }
}
