// Storage.js
// Single Responsibility (S in SOLID): ONLY knows how to save/load the
// "projects" array to/from localStorage. Nothing else in the app should
// call localStorage directly — everything goes through this module.
//
// Dependency Inversion (D in SOLID): projectManager.js does NOT import
// this module. Instead, index.js (the orchestrator) reads from Storage
// and hands the data to projectManager.init(), then calls Storage.save()
// after every mutation. This means projectManager has zero knowledge of
// WHERE its data comes from or goes to — we could swap localStorage for
// an API call later and projectManager would never need to change.
//
// About "reviving methods" (mentioned in the assignment): this is only
// a problem if your todos/projects have methods attached to them (e.g.
// `todo.toggleComplete()`), because JSON.stringify silently drops
// functions, and JSON.parse can't magically bring them back.
// We sidestepped that entire problem back in Todo.js / Project.js by
// making todos and projects plain data objects, with all behavior living
// in separate function modules (todoOperations.js) that take the object
// as a parameter instead of being a method on it. So JSON.parse(JSON.stringify(x))
// here returns something that's already 100% usable — nothing to "revive".

const STORAGE_KEY = 'todoapp.projects';

/**
 * Saves the full projects array to localStorage.
 * Wrapped in try/catch because localStorage can throw (private browsing
 * mode, storage quota exceeded, etc.) and a save failure should never
 * crash the app.
 */
function save(projects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Could not save to localStorage:', error);
  }
}

/**
 * Loads the projects array from localStorage.
 * Returns null if there's nothing saved yet, or if the saved data is
 * corrupted/unreadable -> the app should not crash, it should just fall
 * back to creating a fresh Default project (handled in projectManager.init).
 */
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Could not read saved data (it may be corrupted):', error);
    return null;
  }
}

function clear() {
  localStorage.removeItem(STORAGE_KEY);
}

export { save, load, clear };
