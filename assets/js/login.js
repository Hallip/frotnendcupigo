const urlGraphQL = `http://34.150.137.112:4000/graphql`;

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('emailField').value;
        const password = document.getElementById('passwordField').value;

        if (!email || !password) {
            alert("Por favor, introduce tu email y contraseña.");
            return;
        }

        loginUser(email, password);
    });
});

async function loginUser(email, password) {
    const LOGIN_MUTATION = `
        mutation Login($credentials: LoginInput!) {
            loginUser(credentials: $credentials) {
                token
                message
                success
            }
        }
    `;

    const variables = {
        credentials: {
            Email: email,
            Password: password
        }
    };

    try {
        const response = await fetch(urlGraphQL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: LOGIN_MUTATION,
                variables: variables
            })
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (data.data && data.data.loginUser.success) {
            console.log('Token:', data.data.loginUser.token);
            // Aquí puedes guardar el token y redirigir al usuario
            window.location.href = 'home.html';
        } else {
            // Login fallido, mostrar mensaje de error
            alert('Error en el inicio de sesión: ' + data.data.loginUser.message);
        }
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        alert('Error al intentar iniciar sesión: ' + error.message);
    }
}

