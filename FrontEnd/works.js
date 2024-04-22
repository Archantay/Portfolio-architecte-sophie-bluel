const portfolio = document.getElementById('portfolio');
let miniaturesAppelees = false;

document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    afficherGalerie();
    checkUserAuthentication();
});

function afficherGalerie(categorieSelectionnee = 'Tous') {
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
            data.forEach(projet => {
                if (categorieSelectionnee === 'Tous' || projet.category.name === categorieSelectionnee) {
                    const figure = document.createElement('figure');
                    const img = document.createElement('img');
                    img.src = projet.imageUrl;
                    img.alt = projet.title;
                    figure.appendChild(img);
                    const figcaption = document.createElement('figcaption');
                    figcaption.textContent = projet.title;
                    figure.appendChild(figcaption);
                    gallery.appendChild(figure);
                }
            });
        })
        .catch(error => {
            alert('Une erreur est survenue')
        });
}

function fetchCategories() {
    let menuCategories;

    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            const menuCategories = document.createElement('div');
            menuCategories.classList.add('categories');
            const portfolio = document.getElementById('portfolio');

            const token = localStorage.getItem('token');
            if (token) {
                menuCategories.style.display = 'none';
            }
            portfolio.appendChild(menuCategories);

            const btnModifier = document.createElement('button');
            btnModifier.textContent = 'modifier';
            const iconModifier = document.createElement('i');
            iconModifier.classList.add('fa-regular', 'fa-pen-to-square');
            btnModifier.insertBefore(iconModifier, btnModifier.firstChild);
            btnModifier.addEventListener('click', () => {
                var modal = document.getElementById("myModal");
                var span = document.getElementsByClassName("close")[0];
                modal.style.display = "block";
                span.onclick = function () {
                    modal.style.display = "none";
                }
                window.onclick = function (event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }
                afficherMiniatures()

            });
            if (!token) {
                btnModifier.style.display = 'none';
                menuCategories.style.display = 'visible';
            }
            titreGallery.appendChild(btnModifier);

            const btnTous = document.createElement('button');
            btnTous.textContent = 'Tous';
            btnTous.addEventListener('click', () => {
                afficherGalerie();
            });
            menuCategories.appendChild(btnTous);

            categories.forEach(category => {
                const btnCategorie = document.createElement('button');
                btnCategorie.textContent = category.name;
                btnCategorie.addEventListener('click', () => {
                    afficherGalerie(category.name);
                });
                menuCategories.appendChild(btnCategorie);
            });
        })
        .catch(() => {
            alert('Une erreur est survenue')
        });
}

function checkUserAuthentication() {
    const token = localStorage.getItem('token');
    const loginLink = document.getElementById('loginLink');

    if (loginLink) {
        if (token) {
            loginLink.textContent = 'Logout';
            loginLink.addEventListener('click', () => {
                localStorage.removeItem('token');
                location.reload();
            });
        } else {
            loginLink.textContent = 'Login';
            loginLink.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }
    }
}

function afficherMiniatures() {
    const thumbnailsContainer = document.querySelector('.thumbnails');

    if (!miniaturesAppelees) {
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(data => {
                data.forEach(projet => {
                    const miniature = document.createElement('img');
                    miniature.src = projet.imageUrl;
                    miniature.alt = projet.title;
                    miniature.classList.add('thumbnail');

                    const deleteIcon = document.createElement('i');
                    deleteIcon.classList.add('fas', 'fa-trash-alt', 'fa-xs', 'delete-icon');
                    deleteIcon.addEventListener('click', () => {
                        // Action à effectuer pour supprimer un projet
                    });

                    const thumbnailContainer = document.createElement('div');
                    thumbnailContainer.classList.add('thumbnail-container');
                    thumbnailContainer.appendChild(miniature);
                    thumbnailContainer.appendChild(deleteIcon);

                    thumbnailsContainer.appendChild(thumbnailContainer);
                });

                miniaturesAppelees = true;
            })
            .catch(() => {
                alert('Une erreur est survenue')
            });
    }
};