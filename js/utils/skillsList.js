//Importamos el array de skills desde el módulo de datos
import { skills } from '../data/skills.js';

// Colocamos los elementos comunes del head al principio del head de la página
const containerSkills =     document.getElementById('skills-container');

// Función para renderizar las skills en el contenedor correspondiente
const renderSkill = (skill) => {
    const skillCard = document.createElement('div');
    skillCard.className = 'skill-card';

    const { icon, name, description, tags } = skill; // Desestructuramos el objeto skill para obtener sus propiedades
    skillCard.innerHTML = `
        <img src="${icon}" alt="${name} icon" class="skill-icon">
        <h3>${name}</h3>
        <p>${description}</p>
        <div class="tags">
        ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
    `;
    return skillCard;
};

const renderSkills = (skills, idDiv, title) => {
    const container = document.getElementById(idDiv);
    const containerTitle = document.createElement('h3');
    containerTitle.textContent = title;
    container.appendChild(containerTitle);
    skills.forEach(skill => {
        const skillCard = renderSkill(skill);
        container.appendChild(skillCard);
    });
}

//Obtenemos los skills que queremos que se muestren en la página y los renderizamos en el contenedor correspondiente
const skillsDominada = skills.filter(skill => skill.state === 'dominada');
const skillsOthers = skills.filter(skill => skill.state !== 'dominada');

renderSkills(skillsDominada, 'skills-dominada-container', 'Skills Dominadas');
renderSkills(skillsOthers, 'skills-others-container', 'Otras Skills');