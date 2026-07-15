import { Project } from './project.js';
import { Todo } from './todo.js';

export class Storage {
  // Saves the entire projects array to LocalStorage as a JSON string
  static saveProjects(projects) {
    localStorage.setItem('todoAppProjects', JSON.stringify(projects));
  }

  // Retrieves projects and re-instantiates them back into proper classes
  static loadProjects() {
    const rawData = localStorage.getItem('todoAppProjects');
    
    // If no data exists, return a default state with a Default Project
    if (!rawData) {
      const defaultProject = new Project('Default Project');
      // Add a sample todo to help the user get started
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

    // Map raw objects back to instances of Project and Todo classes
    return parsedData.map(projData => {
      const project = new Project(projData.name);
      project.todos = projData.todos.map(todoData => {
        return new Todo(
          todoData.title,
          todoData.description,
          todoData.dueDate,
          todoData.priority,
          todoData.notes,
          todoData.completed
        );
      });
      return project;
    });
  }
}