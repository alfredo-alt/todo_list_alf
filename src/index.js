import './styles.css'; // Webpack will compile CSS if you are bundling it
import { DomController } from './dom.js';

// Initialize the entire application logic and DOM bindings on load
document.addEventListener('DOMContentLoaded', () => {
  new DomController();
});