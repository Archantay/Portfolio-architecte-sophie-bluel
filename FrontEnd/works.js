function afficherGalerie() {
    fetch('http://localhost:5678/api/works')
      .then(response => response.json()) 
      .then(data => {
    
        const portfolio = document.getElementById('portfolio');
  
    
        let gallery = portfolio.querySelector('.gallery');
        if (!gallery) {
          gallery = document.createElement('div');
          gallery.classList.add('gallery');
          portfolio.appendChild(gallery);
        }
  
        
        data.forEach(projets => {
          
          const figure = document.createElement('figure');
  
        
          const img = document.createElement('img');
          img.src = projets.imageUrl; 
          img.alt = projets.nom;
  
          
          figure.appendChild(img);
  
          
          const figcaption = document.createElement('figcaption');
          figcaption.textContent = projets.nom;
  
        
          figure.appendChild(figcaption);
  
    
          gallery.appendChild(figure);
        });
      })
      .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des données :', error);
      });
  }
  

  document.addEventListener('DOMContentLoaded', afficherGalerie);