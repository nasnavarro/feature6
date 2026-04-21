import { locations } from '../data/locations.js';

// ─── WMO helpers (códigos estándar meteorológicos) ────────────────────────────

const WMO_ICONS = {
  0: '☀️',  1: '🌤️', 2: '⛅',  3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '🌨️', 73: '❄️',  75: '❄️',  77: '❄️',
  80: '🌦️', 81: '🌧️', 82: '🌧️',
  85: '🌨️', 86: '❄️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
};

const WMO_DESCS = {
  0: 'Despejado',            1: 'Mayormente despejado', 2: 'Parcialmente nublado', 3: 'Nublado',
  45: 'Niebla',              48: 'Niebla con escarcha',
  51: 'Llovizna ligera',     53: 'Llovizna moderada',   55: 'Llovizna intensa',
  61: 'Lluvia ligera',       63: 'Lluvia moderada',     65: 'Lluvia intensa',
  71: 'Nevada ligera',       73: 'Nevada moderada',     75: 'Nevada intensa',     77: 'Granizo',
  80: 'Chubascos ligeros',   81: 'Chubascos moderados', 82: 'Chubascos fuertes',
  85: 'Nieve con chubascos', 86: 'Nieve intensa',
  95: 'Tormenta',            96: 'Tormenta con granizo', 99: 'Tormenta con granizo fuerte',
};

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const wmoIcon = (code) => WMO_ICONS[code] ?? '🌡️';
const wmoDesc = (code) => WMO_DESCS[code] ?? 'Desconocido';
const dayLabel = (dateStr) => DAYS[new Date(dateStr + 'T00:00:00').getDay()];

// ─── APIs ─────────────────────────────────────────────────────────────────────
// Cada API expone fetch(lat, lon) y devuelve datos normalizados:
// { current: { temp, feelsLike, humidity, windSpeed, cloudCover, icon, description },
//   forecast: [{ label, icon, max, min }] × 5 días }
//
// El array APIS es el único sitio donde se añaden nuevas fuentes.

async function fetchOpenMeteo(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current:  'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,cloud_cover',
    daily:    'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'Europe/Madrid',
    forecast_days: 7,
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
  const data = await res.json();

  return {
    current: {
      temp:        Math.round(data.current.temperature_2m),
      feelsLike:   Math.round(data.current.apparent_temperature),
      humidity:    data.current.relative_humidity_2m,
      windSpeed:   Math.round(data.current.wind_speed_10m),
      cloudCover:  data.current.cloud_cover,
      icon:        wmoIcon(data.current.weather_code),
      description: wmoDesc(data.current.weather_code),
    },
    forecast: data.daily.time.map((date, i) => ({
      label: dayLabel(date),
      icon:  wmoIcon(data.daily.weather_code[i]),
      max:   Math.round(data.daily.temperature_2m_max[i]),
      min:   Math.round(data.daily.temperature_2m_min[i]),
    })),
  };
}

async function fetchWeatherAPI(lat, lon) {
  const WEATHER_API_KEY = '89762f57084d4ca89dd164642261704';
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=3&lang=es`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WeatherAPI HTTP ${res.status}`);
  const data = await res.json();

  return {
    current: {
      temp:        Math.round(data.current.temp_c),
      feelsLike:   Math.round(data.current.feelslike_c),
      humidity:    data.current.humidity,
      windSpeed:   Math.round(data.current.wind_kph),
      cloudCover:  data.current.cloud,
      icon:        'https:' + data.current.condition.icon,
      description: data.current.condition.text,
    },
    forecast: data.forecast.forecastday.map(day => ({
      label: dayLabel(day.date),
      icon:  'https:' + day.day.condition.icon,
      max:   Math.round(day.day.maxtemp_c),
      min:   Math.round(day.day.mintemp_c),
    })),
  };
}

async function fetchOpenWeatherMap(lat, lon) {
  const OWM_KEY = '7864e76394a1805f90799cf0b442a3fe';
  const base = `https://api.openweathermap.org/data/2.5`;
  const params = `lat=${lat}&lon=${lon}&appid=${OWM_KEY}&units=metric&lang=es`;

  const [currentRes, forecastRes] = await Promise.all([
    fetch(`${base}/weather?${params}`),
    fetch(`${base}/forecast?${params}`),
  ]);
  if (!currentRes.ok) throw new Error(`OWM current HTTP ${currentRes.status}`);
  if (!forecastRes.ok) throw new Error(`OWM forecast HTTP ${forecastRes.status}`);

  const cur  = await currentRes.json();
  const fore = await forecastRes.json();

  // Agrupa intervalos de 3h por día y toma el de mediodía como representativo
  const byDay = {};
  fore.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!byDay[date]) byDay[date] = { temps: [], rep: null };
    byDay[date].temps.push(item.main.temp);
    if (item.dt_txt.includes('12:00:00') || !byDay[date].rep) byDay[date].rep = item;
  });

  const owmIcon = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`;

  return {
    current: {
      temp:        Math.round(cur.main.temp),
      feelsLike:   Math.round(cur.main.feels_like),
      humidity:    cur.main.humidity,
      windSpeed:   Math.round(cur.wind.speed * 3.6),  // m/s → km/h
      cloudCover:  cur.clouds.all,
      icon:        owmIcon(cur.weather[0].icon),
      description: cur.weather[0].description,
    },
    forecast: Object.entries(byDay).slice(0, 5).map(([date, data]) => ({
      label: dayLabel(date),
      icon:  owmIcon(data.rep.weather[0].icon),
      max:   Math.round(Math.max(...data.temps)),
      min:   Math.round(Math.min(...data.temps)),
    })),
  };
}

const APIS = [
  { id: 'open-meteo',      name: 'Open-Meteo',      fetch: fetchOpenMeteo      },
  { id: 'weather-api',     name: 'WeatherAPI',       fetch: fetchWeatherAPI     },
  { id: 'openweathermap',  name: 'OpenWeatherMap',   fetch: fetchOpenWeatherMap },
];

// ─── Render ───────────────────────────────────────────────────────────────────

// WeatherAPI devuelve URLs de imagen; Open-Meteo devuelve emojis.
const iconHtml = (icon, cls) =>
  icon.startsWith('http')
    ? `<img src="${icon}" alt="" class="${cls}-img">`
    : `<span class="${cls}">${icon}</span>`;

function renderCurrent({ temp, feelsLike, humidity, windSpeed, cloudCover, icon, description }) {
  return `
    <div class="wc-current">
      <div class="wc-main">
        ${iconHtml(icon, 'wc-icon')}
        <span class="wc-temp">${temp}°C</span>
        <span class="wc-desc">${description}</span>
      </div>
      <div class="wc-details">
        <div class="wc-detail"><span class="wc-detail-label">Viento</span><span class="wc-detail-value">💨 ${windSpeed} km/h</span></div>
        <div class="wc-detail"><span class="wc-detail-label">Humedad</span><span class="wc-detail-value">💧 ${humidity}%</span></div>
        <div class="wc-detail"><span class="wc-detail-label">Nubosidad</span><span class="wc-detail-value">☁️ ${cloudCover}%</span></div>
        <div class="wc-detail"><span class="wc-detail-label">Sensación</span><span class="wc-detail-value">🌡️ ${feelsLike}°C</span></div>
      </div>
    </div>`;
}

function renderForecast(forecast) {
  return `
    <div class="wc-forecast">
      ${forecast.map(day => `
        <div class="wc-forecast-day">
          <span class="wc-forecast-label">${day.label}</span>
          ${iconHtml(day.icon, 'wc-forecast-icon')}
          <span class="wc-forecast-max">${day.max}°</span>
          <span class="wc-forecast-min">${day.min}°</span>
        </div>`).join('')}
    </div>`;
}

function renderApiCard(api, result) {
  const card = document.createElement('article');
  card.className = 'api-card';
  card.dataset.api = api.id;

  if (result.status === 'fulfilled') {
    const { current, forecast } = result.value;
    card.innerHTML = `
      <h3 class="api-card-title">${api.name}</h3>
      ${renderCurrent(current)}
      <p class="wc-forecast-title">Previsión 7 días</p>
      ${renderForecast(forecast)}`;
  } else {
    card.innerHTML = `
      <h3 class="api-card-title">${api.name}</h3>
      <p class="api-error">No se pudo cargar esta fuente de datos.</p>`;
    card.classList.add('api-card--error');
  }
  return card;
}

function renderCity(location, results) {
  const section = document.createElement('section');
  section.className = 'city-block';
  section.id = location.id;

  const grid = document.createElement('div');
  grid.className = 'api-grid';
  APIS.forEach((api, i) => grid.appendChild(renderApiCard(api, results[i])));

  section.appendChild(grid);
  return section;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

async function init() {
  const app = document.getElementById('weather-app');

  const tabsNav     = document.createElement('div');
  const tabsContent = document.createElement('div');
  tabsNav.className     = 'tabs-nav';
  tabsContent.className = 'tabs-content';
  app.append(tabsNav, tabsContent);

  // Crear pestañas y placeholders para todas las ciudades antes de cargar datos
  locations.forEach((location, i) => {
    const btn = document.createElement('button');
    btn.className    = 'tab-btn' + (i === 0 ? ' tab-btn--active' : '');
    btn.textContent  = location.name;
    btn.dataset.target = location.id;
    tabsNav.appendChild(btn);

    const placeholder = document.createElement('section');
    placeholder.className = 'city-block' + (i === 0 ? ' city-block--active' : '');
    placeholder.id        = location.id;
    placeholder.innerHTML = `<p class="city-loading">Cargando datos meteorológicos…</p>`;
    tabsContent.appendChild(placeholder);
  });

  // Cambio de pestaña
  tabsNav.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    tabsNav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('tab-btn--active'));
    btn.classList.add('tab-btn--active');
    tabsContent.querySelectorAll('.city-block').forEach(s => {
      s.classList.toggle('city-block--active', s.id === btn.dataset.target);
    });
  });

  // Cargar datos de cada ciudad y reemplazar su placeholder
  for (const location of locations) {
    // Promise.allSettled: todas las APIs se llaman en paralelo.
    // A diferencia de Promise.all, si una falla las demás siguen mostrándose.
    const results = await Promise.allSettled(
      APIS.map(api => api.fetch(location.lat, location.lon))
    );
    const current = document.getElementById(location.id);
    const city    = renderCity(location, results);
    city.className = current.className;
    tabsContent.replaceChild(city, current);
  }
}

init();
