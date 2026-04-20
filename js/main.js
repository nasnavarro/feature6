///////////////////////////////////////
// Importación de plantillas comunes //
///////////////////////////////////////

//Cargamos lo primero de todo la funcionalidad de modo oscuro para que esté disponible desde el inicio de la carga de la página
import { toggleDarkMode, initDarkMode } from './utils/darkMode.js';

//Importamos el header y el footer desde el archivo de plantillas comunes.
import { header, footer } from './templates/template.js';

// Colocamos el header al principio del body para que se muestre al inicio de la página
const pagecode = document.body.getAttribute('data-page') || 'index';
document.body.insertAdjacentHTML('afterbegin', header(pagecode));

// Inicializamos el modo oscuro ahora que el header (y el logo) ya están en el DOM
initDarkMode();

// Colocamos el footer al final del body para que se muestre al final de la página
document.body.insertAdjacentHTML('beforeend', footer());

// Activamos la funcionalidad del modo oscuro al hacer click en el icono del sol o de la luna
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

sunIcon.addEventListener('click', toggleDarkMode);
moonIcon.addEventListener('click', toggleDarkMode);

// Actualiza aria-expanded en la label y aria-hidden en el nav al abrir/cerrar hamburguesa
const menuToggle = document.querySelector('.menu-toggle');
const hamburgerLabel = document.querySelector('.hamburger');
const mainNav = document.querySelector('#main-nav');

menuToggle.addEventListener('change', () => {
  hamburgerLabel.setAttribute('aria-expanded', menuToggle.checked);
  mainNav.setAttribute('aria-hidden', !menuToggle.checked);
});

// Widget del tiempo
import { getCurrentLocation, getCurrentWeather , createWeatherElement} from './utils/weather.js';
getCurrentLocation().then(location => {
  console.log('Ubicación obtenida:', location);
  // Ya tenemos la ubicación, podemos llamar a la API del tiempo usando la ubicación obtenida
  getCurrentWeather(location.lat, location.lon).then(weather => {
    console.log('Tiempo actual:', weather);
    // Generamos el elemento del widget del tiempo con la información obtenida
    const weatherElement = createWeatherElement(weather);
    // Lo añadimos al header, justo antes del contenedor de los iconos de modo oscuro
    document.querySelector('.modeContainer').insertAdjacentElement('beforebegin', weatherElement);
  });
})
.catch(error => {
  console.error('Error al obtener la ubicación:', error);
  // Aquí podrías mostrar un mensaje de error al usuario o usar una ubicación por defecto
});