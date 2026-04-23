# Módulo 1 · Pieza 6 — Fin de proyecto

Portfolio personal finalizado con integración de APIs externas, sección de proyectos y formulario de contacto funcional.

## Objetivo

Integrar un widget de clima en tiempo real con **WeatherAPI.com**, añadir la sección de proyectos con enlaces a GitHub y demo en vivo, mantener toda la funcionalidad del Sprint 5 y optimizar el comportamiento responsive del menú de navegación.

---

## Nuevas funcionalidades

### 1. Widget de clima (`js/utils/weather.js`)

- **API:** WeatherAPI.com con geolocalización del navegador
- **Datos mostrados:** ciudad, temperatura actual (°C) e icono del clima
- **Diseño:** vertical — icono + temperatura arriba, ciudad abajo
- Toda la lógica de llamada a la API y renderizado encapsulada en `weather.js`

### 2. Formulario de contacto con FormSubmit.co (`contacto.html`)

- `action` apuntando a `https://formsubmit.co/[email]`
- Campos hidden configurados:
  - `_subject`: "Nuevo mensaje desde CV Portfolio"
  - `_captcha`: false
  - `_template`: table

### 3. Sección Proyectos (`index.html`)

Componente `project-card` con:
- Título del proyecto
- Descripción
- Tags de tecnologías
- Botón "Ver en GitHub" (siempre)
- Botón "Demo en Vivo" (solo si aplica)

---

## Estructura de archivos

```
├── index.html              # Home: sección proyectos + cheatsheets
├── sobre-mi.html           # Sobre mí
├── contacto.html           # Formulario con FormSubmit.co
├── recursos.html           # Recursos con tabs
├── el-tiempo.html          # Comparativa de APIs meteorológicas (extra)
├── cheatsheet-html.html
├── cheatsheet-css.html
├── cheatsheet-js.html
├── css/
│   ├── common_reset.css
│   ├── common_vars.css
│   ├── common_frontend.css
│   ├── common_menu.css
│   ├── index.css
│   ├── contacto.css
│   ├── sobre_mi.css
│   ├── resources.css
│   ├── cheatsheets.css
│   └── el-tiempo.css
└── js/
    ├── main.js
    ├── templates/
    │   └── template.js
    ├── utils/
    │   ├── darkMode.js
    │   ├── skillsList.js
    │   ├── cheatsheetsList.js
    │   ├── resourcesGenerator.js
    │   ├── projectsList.js
    │   ├── weather.js
    │   └── weatherCompare.js
    └── data/
        ├── menu.js
        ├── skills.js
        ├── cheatsheets.js
        ├── resources.js
        ├── projects.js
        └── locations.js
```

---

## Extra: Página El Tiempo (`el-tiempo.html`)

Comparativa de fuentes meteorológicas en tiempo real para localizaciones fijas (Alcorcón, Madrid, El Campello):

- **APIs integradas:** Open-Meteo · WeatherAPI.com · OpenWeatherMap
- Tiempo actual + previsión por ciudad
- Sistema de pestañas por ciudad
- `Promise.allSettled` para llamadas paralelas con tolerancia a fallos de API
