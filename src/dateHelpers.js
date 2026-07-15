import { format, isPast, parseISO } from 'date-fns';

// Única responsabilidad: traducir un dueDate crudo en algo legible para la UI.
// Si mañana cambia el formato de fecha, solo se toca este archivo.
export function formatDueDate(dueDateStr) {
  const date = parseISO(dueDateStr);
  const label = format(date, 'MMM d, yyyy');
  return isPast(date) ? `${label} (overdue)` : label;
}
