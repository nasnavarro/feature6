import { projects } from '../data/projects.js';

const renderProject = (project) => {
  const { title, description, tags, githubUrl, demoUrl } = project;
  const card = document.createElement('div');
  card.className = 'project-card';
  card.innerHTML = `
    <h3>${title}</h3>
    <p>${description}</p>
    <div class="tags">
      ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
    </div>
    <div class="project-card-actions">
      <a href="${githubUrl}" target="_blank" rel="noopener" class="btn-project btn-github">Ver en GitHub</a>
      ${demoUrl ? `<a href="${demoUrl}" target="_blank" rel="noopener" class="btn-project btn-demo">Demo en Vivo</a>` : ''}
    </div>
  `;
  return card;
};

const container = document.getElementById('projects-container');
projects.forEach(project => container.appendChild(renderProject(project)));
