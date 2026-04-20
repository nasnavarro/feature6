//Importamos el array de recursoe desde el módulo de datos
import { resources } from '../data/resources.js';

// Creamos una función para generar URLs amigables a partir de los nombres de las categorías
const urlFriendly = (str) => {
    return str
        .toLowerCase()
        .normalize('NFD') // separa los acentos
        .replace(/[\u0300-\u036f]/g, '') // elimina los acentos
        .replace(/[^a-z0-9\s-]/g, '') // elimina caracteres especiales
        .replace(/\s+/g, '-'); // reemplaza espacios por guiones
}

// Obtengo una versión de las resources con el ID generado para cada categoría, que usaremos para renderizar las tabs y los contenedores de cada categoría en el HTML
const resourcesWithId = resources.map(resource => ({
    ...resource,
    id: urlFriendly(resource.category)
}));

// CContenedor de las tabs de categorías
const tabContainer = document.querySelector('.tab-items');

// Obtenemos las categorías de los recursos y les generamos un ID amigable para usarlo como ancla en el HTML
const resourcesCategories = resourcesWithId.map(resource => ({
    category: resource.category,
    id: resource.id
}));

// Función para renderizar las tabs de categorías en el HTML
const renderResourceTabs = (categories) => {
    categories.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('tab-item');
        button.setAttribute('data-category', category.id);
        button.textContent = category.category;
        button.addEventListener('click', () => activateCategory(category.id));
        tabContainer.appendChild(button);
    });
}

//Obtenemos el contenedor donde se mostrarán los recursos
const sectionRecursos = document.querySelector('.recursos-content');

//Funcion para renderizar los contenedores de cada categoría de recursos en el HTML
const renderResourceContainers = (categories) => {
    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'resource-category';
        categoryDiv.setAttribute('id', category.id);
        sectionRecursos.appendChild(categoryDiv);
    });
}

//Función que detecta si una url es local o externa
const isExternalLink = (url) => {
    try {
        const link = new URL(url, window.location.origin);
        return link.hostname !== window.location.hostname;
    } catch (e) {
        // Si la URL no es válida, la tratamos como interna
        return false;
    }
}

//Función para renderiza una tarjeta de recursos
const renderResourceCard = (resource) => {
    const {title, url, note : description} = resource; // Desestructuramos el objeto resource para obtener sus propiedades
    const card = document.createElement('div');
    card.className = 'resource-card';
    card.setAttribute('id', urlFriendly(title));
    const cardH3 = document.createElement('h3');
    const h3link = document.createElement('a');
    h3link.setAttribute('href', url);
    h3link.setAttribute('target', isExternalLink(url)? '_blank' : '_self');
    h3link.textContent = title;
    cardH3.appendChild(h3link);
    card.appendChild(cardH3);
    const cardp = document.createElement('p');
    cardp.textContent = description;
    card.appendChild(cardp);

    return card;
}

//Función para renderizar los recursos de una categoría concreta
const renderResourcesOfCategory = (category) => {
    const categoryDiv = document.getElementById(category.id);
    const grid = document.createElement('div');
    grid.className = 'resource-cards-grid';
    categoryDiv.appendChild(grid);
    category.items.forEach(resource => {
        grid.appendChild(renderResourceCard(resource));
    });
}

//Función para seleccionar una categoría.
const activateCategory = (categoryId) => {

    const tabs = document.querySelectorAll('.tab-item');
    //Desactivamos todas las tabs menos la selecionada
    tabs.forEach(tab => {
        if(tab.getAttribute('data-category') === categoryId){
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    const categories = document.querySelectorAll('.resource-category');
    //Ocultamos todos los contenedores de recursos menos el seleccionado
    categories.forEach(category => {
        if(category.getAttribute('id') === categoryId){
            category.style.display = 'block';
        } else {
            category.style.display = 'none';
        }
    });
}

const init = () => {
    // Renderizamos las tabs de categorías
    renderResourceTabs(resourcesCategories);
    // Renderizamos los contenedores de las distintas categorías.
    renderResourceContainers(resourcesCategories);
    // Habilitamos que se preseleccione la primera categoría
    activateCategory(resourcesCategories[0].id);
    // Renderizamos los recursos de cada categoría en su contenedor correspondiente
    resourcesWithId.forEach(category => renderResourcesOfCategory(category));
}

//Inicializamos
init();