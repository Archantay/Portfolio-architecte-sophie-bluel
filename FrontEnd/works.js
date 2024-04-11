const portfolio = document.getElementById('portfolio');

function afficherGalerie(categorieSelectionnee) {

  let gallery = portfolio.querySelector('.gallery');
  

  fetch('http://localhost:5678/api/works')
    .then(response => response.json()) 
    .then(data => {

    
      if (!gallery) {
        gallery = document.createElement('div');
        gallery.classList.add('gallery');
        portfolio.appendChild(gallery);
      } else {
        gallery.innerHTML = ''; 
      }

      data.forEach(projets => {
        if (categorieSelectionnee === 'Tous' || projets.category.name === categorieSelectionnee) {
          const figure = document.createElement('figure');
          const img = document.createElement('img');
          img.src = projets.imageUrl;
          img.alt = projets.title;
          figure.appendChild(img);
          const figcaption = document.createElement('figcaption');
          figcaption.textContent = projets.title;
          figure.appendChild(figcaption);
          gallery.appendChild(figure);
        }
      });
    })
    .catch(error => {
      console.error('Une erreur s\'est produite lors de la récupération des données :', error);
    });
}

fetch('http://localhost:5678/api/categories')
  .then(response => response.json()) 
  .then(categories => {
    const menuCategories = document.createElement('div');
    menuCategories.classList.add('categories');
    const portfolio = document.getElementById('portfolio');
    portfolio.appendChild(menuCategories);
    
    const btnTous = document.createElement('button');
    btnTous.textContent = 'Tous';
    btnTous.addEventListener('click', () => {
      afficherGalerie('Tous');
      console.log('Afficher tous les projets');
    });
    menuCategories.appendChild(btnTous);
    
    categories.forEach(category => {
      const btnCategorie = document.createElement('button');
      btnCategorie.textContent = category.name;
      btnCategorie.addEventListener('click', () => {
        afficherGalerie(category.name);
        console.log('Afficher les projets de la catégorie :', category.name);
      });
      menuCategories.appendChild(btnCategorie);
    });
  })
  .catch(error => {
    console.error('Une erreur s\'est produite lors de la récupération des catégories :', error )
  });