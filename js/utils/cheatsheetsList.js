//Importamos el array de cheatsheets desde el módulo de datos
import { cheatsheets } from '../data/cheatsheets.js';

// Función para renderizar las cheatsheets en el contenedor correspondiente
const renderCheatsheet = (cheatsheet) => {
    const { name, icon, link, description } = cheatsheet; // Desestructuramos el objeto para obtener sus propiedades

    const cheatsheetCard = document.createElement('a');
    cheatsheetCard.className = 'cheatsheet-card';
    cheatsheetCard.href = link;

        const icondiv = document.createElement('div');
        icondiv.className = 'cheatsheet-card-icon';
        const img = document.createElement('img');
        img.src = icon;
        img.alt = `${name} icon`;
        img.className = 'cheatsheet-icon';
        icondiv.appendChild(img);
        cheatsheetCard.appendChild(icondiv);

        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'cheatsheet-card-body';
        const title = document.createElement('h3');
        title.textContent = name;
        const descriptionP = document.createElement('p');
        descriptionP.textContent = description;
        bodyDiv.appendChild(title);
        bodyDiv.appendChild(descriptionP);
        cheatsheetCard.appendChild(bodyDiv);

        const arrowSpan = document.createElement('span');
        arrowSpan.className = 'cheatsheet-card-arrow';
        arrowSpan.textContent = '→';
        cheatsheetCard.appendChild(arrowSpan);
    return cheatsheetCard;
};

// Renderizador de cheatsheets
const renderCheatsheets = (cheatsheets, idDiv) => {
    const container = document.getElementById(idDiv);
    cheatsheets.forEach(cheatsheet => {
        const cheatsheetCard = renderCheatsheet(cheatsheet);
        container.appendChild(cheatsheetCard);
    });
}

renderCheatsheets(cheatsheets, 'cheatsheets-container');