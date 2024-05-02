const portfolio = document.getElementById('portfolio');
const token = localStorage.getItem('token');
let miniaturesAppelees = false;
const modal = document.getElementById("myModal");
const span = document.querySelector(".close");
const clos = document.getElementById("clos");
const modalContent1 = document.querySelector('.modal-content');
const modalContent2 = document.querySelector('.modal-content-2');
const btnForm = document.querySelector('.btnForm');
const imageInput = document.getElementById('imageProjet');
const categorieSelect = document.getElementById('categorieProjet');
const form = document.getElementById('FormAjout');
const submitBtn = document.getElementById('BtnValiderProject');
const titreInput = document.getElementById('titreProjet');

document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    afficherGalerie();
    checkUserAuthentication();
    closeModal();

    titreInput.addEventListener('input', validerFormulaire);
    imageInput.addEventListener('change', validerFormulaire);
    categorieSelect.addEventListener('change', validerFormulaire);
    submitBtn.addEventListener('click', soumettreFormulaire);
    validerFormulaire();
});

function closeModal() {
    modal.style.display = "none";
    modalContent1.style.display = 'none';
    modalContent2.style.display = 'none';

    const form = document.getElementById('FormAjout');
    form.reset();
}

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
                    figure.id = `projet-${projet.id}`;
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
        .catch(() => {
            alert('Une erreur est survenue')
        });
}

function fetchCategories() {
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorieSelect.appendChild(option);
            });
            const menuCategories = document.createElement('div');
            menuCategories.classList.add('categories');
            const portfolio = document.getElementById('portfolio');


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
                afficherModal(modalContent1)
                afficherMiniatures()

                const addProjectBtn = document.getElementById('addProjectBtn');
                addProjectBtn.addEventListener('click', () => {
                    afficherModal(modalContent2)
                });

                btnForm.addEventListener('click', () => {
                    imageInput.click();
                });
                imageInput.addEventListener('change', () => {
                    afficherPreview(imageInput);
                });
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
    const loginLink = document.getElementById('loginLink');

    if (loginLink) {
        if (token) {
            loginLink.textContent = 'Logout';
            loginLink.addEventListener('click', () => {
                localStorage.removeItem('token');
                location.reload();
            });
            const titreGallery = document.getElementById('titreGallery');
            titreGallery.classList.add('connected-user');
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
                    miniature.id = `miniature-${projet.id}`;
                    miniature.src = projet.imageUrl;
                    miniature.alt = projet.title;
                    miniature.classList.add('thumbnail');

                    const deleteIcon = document.createElement('i');
                    deleteIcon.classList.add('fas', 'fa-trash-alt', 'fa-xs', 'delete-icon');
                    deleteIcon.addEventListener('click', () => {
                        supprimerElement(projet.id);
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

function afficherModal(contenuModal) {
    modal.style.display = 'block'
    modalContent1.style.display = 'none';
    modalContent2.style.display = 'none';
    contenuModal.style.display = 'block';
    if (contenuModal === modalContent2) {
        const addProjectBtn = document.getElementById('addProjectBtn');
        addProjectBtn.addEventListener('click', () => {
            modalContent1.style.display = 'none';
            modalContent2.style.display = 'block';
        });
    }
    const backArrow = document.getElementById('backArrow');
    backArrow.addEventListener('click', () => {
        modalContent1.style.display = 'block';
        modalContent2.style.display = 'none';
    })
    span.onclick = closeModal;
    clos.onclick = closeModal;

    window.onclick = function (event) {
        if (event.target == modal) {
            closeModal();
        }
    }
}

function afficherPreview(imageInput) {
    const preview = document.querySelector('.image-preview');
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Image sélectionnée';
            img.classList.add('preview-img');
            preview.innerHTML = '';
            preview.appendChild(img);
        };
        reader.readAsDataURL(imageInput.files[0]);
    }
}




function validerFormulaire() {
    const titreValide = titreInput.value.trim() !== '';
    const imageValide = imageInput.files && imageInput.files[0] && (imageInput.files[0].size <= 4 * 1024 * 1024) && (imageInput.accept.includes(imageInput.files[0].type));
    const categorieValide = categorieSelect.value !== '';

    if (titreValide && imageValide && categorieValide) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

function soumettreFormulaire(event) {
    event.preventDefault();
    const categorieValue = parseInt(categorieSelect.value);

    if (!isNaN(categorieValue)) {
        const formData = new FormData();
        const titreValue = titreInput.value.trim();
        if (titreValue !== '') {
            formData.append('title', titreValue);
        } else {
            return;
        }
        if (imageInput.files.length > 0) {
            const imageFile = imageInput.files[0];
            if (imageFile.size <= 4 * 1024 * 1024) {
                if (imageInput.accept.includes(imageFile.type)) {
                    formData.append('image', imageFile);
                } else {
                    return;
                }
            } else {
                return;
            }
        } else {
            return;
        }
        formData.append('category', categorieValue);

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
            .then(response => response.json())
            .catch(() => {
                alert('Une erreur est survenue')
            });
    } else {
    }
}

function supprimerElement(id) {
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (response.ok) {
                const elementASupprimer = document.getElementById(`projet-${id}`);
                if (elementASupprimer) {
                    elementASupprimer.remove();
                } else {
                }
            } else {
            }
        })
        .catch(() => {
            alert('Une erreur est survenue')
        });
}