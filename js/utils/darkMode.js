const applyDarkMode = (isDark) => {
    document.body.classList.toggle('dark-mode', isDark);
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.src = isDark
            ? './img/common/logo_valdecantos_blanco_240x50.png'
            : './img/common/logo_valdecantos_235x50.png';
    }
}

// Inicialización: aplica preferencia guardada o, si no hay, la del sistema operativo
export const initDarkMode = () => {
    const saved = localStorage.getItem('darkMode');
    const isDark = saved !== null
        ? saved === 'true'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyDarkMode(isDark);
};

// Funcionalidad del modo oscuro
export const toggleDarkMode = () => {
    const isDark = !document.body.classList.contains('dark-mode');
    applyDarkMode(isDark);
    localStorage.setItem('darkMode', isDark);
}