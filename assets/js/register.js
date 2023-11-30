const urlGraphQL = `http://34.150.137.112:4000/graphql`;

document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const userName = document.getElementById('userNameField').value;
        const email = document.getElementById('emailField').value;
        const password = document.getElementById('passwordField').value;

        if (!email || !userName || !password) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        // Aquí llamarías a la función que realiza la mutación GraphQL
        registerUser(email, userName, password);
    });
});

// Función para realizar peticiones GraphQL usando un proxy
async function fetchGraphQL(query, variables) {
    const proxyUrl = 'http://localhost:3000/proxy'; // Asegúrate de que este proxy esté configurado correctamente

    const bodyData = {
        url: urlGraphQL,
        query: query,
        variables: variables
    };

    try {
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });

        return await response.json();
    } catch (error) {
        throw new Error('Error al realizar la petición GraphQL: ' + error.message);
    }
}

// Función para crear un usuario
async function createUser(userData) {
    const CREATE_USER_MUTATION = `
        mutation CreateUser($user: UserCreateInput!) {
            createUser(user: $user) {
                success
                message
            }
        }
    `;
    const variables = {
        user: userData,
    };

    try {
        const response = await fetchGraphQL(CREATE_USER_MUTATION, variables);
        console.log('Respuesta del servidor:', response);
        // Manejar la respuesta aquí
        if (response.data && response.data.createUser.success) {
            console.log('Usuario creado con éxito:', response.data.createUser.message);
            window.location.href = 'home.html';
        } else {
            console.error('Error al crear usuario:', response.errors ? response.errors : response.data.createUser.message);
        }
    } catch (error) {
        console.error('Error al crear usuario:', error);
    }   
}

