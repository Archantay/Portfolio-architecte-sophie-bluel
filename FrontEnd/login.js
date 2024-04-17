const section = `
    <section class="connexion">
        <h1>Log in</h1>
        <form id="loginForm">
            <div class="champsConnexion">
                <label for="email">E-mail</label>
                <input type="email" id="email" name="email" required>
                <span id="emailError" class="error"></span><br>
            </div>
            <div class="champsConnexion">
                <label for="password">Mot de passe</label>
                <input type="password" id="password" name="password" required>
                <span id="passwordError" class="error"></span><br>
            </div>
        </form>
        <button type="button" id="loginBtn">Se connecter</button>
        <a href="">Mot de passe oublié</a>
    </section>
`;

let main = document.querySelector("main")
main.innerHTML = section

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.addEventListener('click', () => {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');

        if (!email || !password) {
            alert('Veuillez remplir tous les champs.');
            return;
        }
        loginUser(email, password, emailError, passwordError);
    });
});

function loginUser(email, password, emailError, passwordError) {
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la connexion. Veuillez réessayer.');
            
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html';
        console.log('Connexion réussie:', data);
    })
    .catch(error => {
        console.error('Erreur:', error.message);
        emailError.textContent = 'E-mail invalide';
        passwordError.textContent = 'Mot de passe invalide';
        displayError(error.message);
    });
      function clearError(errorElement) {
        errorElement.textContent = '';
    }
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    emailInput.addEventListener('input', () => {
        clearError(emailError);
    });

    passwordInput.addEventListener('input', () => {
        clearError(passwordError);
    });
  
}
