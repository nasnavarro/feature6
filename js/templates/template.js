// Importamos los elementos del menú de navegación desde el módulo de datos
import { menuItems } from '../data/menu.js';

// Constante para el Header de la página. Se le pasa como parámetro un código de página (por defecto, "index")
export const header = (pagecode = 'index') => `
    <header>
      <!-- Logo de la página con enlace a la home-->
      <a href="index.html" title="Volver al inicio">
        <img class="logo"src="./img/common/logo_valdecantos_235x50.png" alt="Espacio Valdecantos, volver al inicio"/>
      </a>

      <!-- Menú Hamburguesa -->
      <input type="checkbox" id="menu-toggle" class="menu-toggle">
      <label for="menu-toggle" class="hamburger" aria-label="Abrir menú de navegación" aria-controls="main-nav" aria-expanded="false">
        <span></span>
      </label>

      <!--Inicio del Menú de navegación superior-->
      ${renderNavMenu(pagecode, menuItems)}

      <!-- Botón para cambiar entre modo claro y oscuro -->
      <div class="modeContainer">
        <svg class="sun-icon" role="img" aria-label="Cambiar a modo oscuro" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <title>Cambiar a modo oscuro</title>
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="5" stroke="currentColor" stroke-width="2"></line>
          <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" stroke-width="2"></line>
          <line x1="4.22" y1="4.22" x2="7.05" y2="7.05" stroke="currentColor" stroke-width="2"></line>
          <line x1="16.95" y1="16.95" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2"></line>
          <line x1="1" y1="12" x2="5" y2="12" stroke="currentColor" stroke-width="2"></line>
          <line x1="19" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2"></line>
          <line x1="4.22" y1="19.78" x2="7.05" y2="16.95" stroke="currentColor" stroke-width="2"></line>
          <line x1="16.95" y1="7.05" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2"></line>
        </svg>
        <svg class="moon-icon" role="img" aria-label="Cambiar a modo claro" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <title>Cambiar a modo claro</title>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </div>

      <!--Fin del Menú de navegación superior-->
    </header>
`;

// Función para renderizar el menú de navegación. Se le pasa como parámetro un código de página y un array de elementos del menú
const renderNavMenu = (pagecode, menuItems) => {
  const nav = document.createElement('nav');
  nav.id = 'main-nav';
  nav.setAttribute('aria-label', 'Menú principal');

  //Mostramos sólo las opciones de menú que estén activas
  const activeMenuItems = menuItems.filter(item => item.active === true);

  activeMenuItems.forEach(item => {
    if (pagecode === item.pagecode) {
      const span = document.createElement('span');
      span.className = 'nav-active';
      span.setAttribute('aria-current', 'page');
      span.textContent = item.label;
      nav.appendChild(span);
    } else {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      nav.appendChild(a);
    }
  });

  //Devolvemos el HTML del menú de navegación como una cadena de texto
  return nav.outerHTML;
}

//Constante para el Footer de la página
export const footer = (year = new Date().getFullYear()) => `
    <footer>
        Ignacio Navarro &copy;${year}
        · Realizado por <a href="https://www.websoluzion.com" target="_blank">WebSoluzion</a>
    </footer>
`;
