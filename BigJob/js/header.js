document.addEventListener('DOMContentLoaded', () => {
  const header = document.createElement('header');
  header.className = 'header';
  header.innerHTML = `
    <h1 class="header-title">Bienvenue sur L'agenda La Plateforme</h1>
    <nav class="header-nav">
      <ul class="nav-list">
        <li class="nav-item"><a class="nav-link" href="connexion.html">Connexion</a></li>
        <li class="nav-item"><a class="nav-link" href="index.html">Accueil</a></li>
      </ul>
    </nav>
  `;
  document.body.insertBefore(header, document.body.firstChild);
});
