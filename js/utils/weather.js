// Integración de WeatherAPI.com

// Función reutilizable para fetch con manejo de errores
async function fetchJSON(url) {
  const res = await fetch(url);
  // Control de status HTTP
  if (!res.ok) {
    // Intentamos leer el body como texto por si trae info
    const body = await res.text().catch(() => '');
    throw new Error(
      `HTTP ${res.status} - ${res.statusText} ${body ? '| ' + body : ''}`
    );
  }
  // Parse JSON
  return res.json();
}

// Función para geolocalizar el dispositivo y obtener su ubicación (latitud y longitud).
// Si no está activada o falla algo, usamos las coordenadas de Madrid por defecto.
const DEFAULT_LOCATION = { lat: 40.4168, lon: -3.7038 };
const WEATHER_API_KEY = '89762f57084d4ca89dd164642261704';

function getCurrentLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(DEFAULT_LOCATION);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      }),
      () => resolve(DEFAULT_LOCATION)
    );
  });
}

// Función para crear un elemento del DOM con la información del tiempo actual de una ubicación dada (latitud y longitud).
function createWeatherElement(weather) {
  const weatherElement = document.createElement('div');
  weatherElement.className = 'weather-widget';
  weatherElement.innerHTML = `
    <p class="temperature">${weather.current.temp_c}°C</p>
    <p><img src="${weather.current.condition.icon}" alt="${weather.current.condition.text}"></p>
    <p class="location">${weather.location.name}</p>
  `;
  return weatherElement;
}


// Función que llama a weatherapi.com para obtener el tiempo actual de una ubicación dada (latitud y longitud).
// Requiere una API key..
async function getCurrentWeather(lat, lon) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&lang=es`;
  return fetchJSON(url);
}

export { fetchJSON, getCurrentLocation, getCurrentWeather , createWeatherElement};