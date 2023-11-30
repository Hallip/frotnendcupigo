// user.js
const urlGraphQL = `http://34.150.137.112:4000/graphql`;

// Funciones para manejar los datos del usuario en localStorage
function getUserData() {
    return JSON.parse(localStorage.getItem('userSignupData')) || {};
}

function setUserData(data) {
    localStorage.setItem('userSignupData', JSON.stringify(data));
}

function updateUserFieldAndNavigate(fieldName, fieldValue, nextPage) {
    const userData = getUserData();
    userData[fieldName] = fieldValue;
    setUserData(userData);
    window.location.href = nextPage;
}

function showCurrentUserData() {
    const userData = getUserData();
    console.log("Datos actuales del usuario:", userData);
}


// En signup.html
document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const userName = document.getElementById('userNameField').value;
            const email = document.getElementById('emailField').value;
            setUserData({ userName, email });
            window.location.href = 'first-name.html';
        });
    }
});

// En first-name.html
document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.getElementById('boton-fullName');
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            const fullName = document.getElementById('fullNameField').value;
            if (!fullName.trim()) {
                alert("Por favor, introduce tu nombre.");
                return;
            }
            updateUserFieldAndNavigate('fullName', fullName, 'enter-birth-date.html');
        });
    }
});

// En enter-birth-date.html
document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.getElementById('nextBirthDate');
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            const birthday = document.getElementById('birthDateField').value;
            if (!birthday) {
                alert("Por favor, introduce tu fecha de nacimiento.");
                return;
            }
            updateUserFieldAndNavigate('birthday', birthday, 'your-gender.html');
        });
    }
});

// En your-gender.html
document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.getElementById('nextGender');
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            const selectedGender = document.querySelector('input[name="gender"]:checked').value;
            updateUserFieldAndNavigate('sex', selectedGender, 'intrested.html');
        });
    }
});

// En intrested.html
document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.getElementById('nextInterest');
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            const selectedInterest = document.querySelector('input[name="interestedIn"]:checked').value;
            updateUserFieldAndNavigate('oSex', selectedInterest, 'recent-pics.html');
            showCurrentUserData();
            const userData = getUserData();
            createUser(userData);
        });
    }
});

// En recent-pics.html (si decides implementar la carga de imágenes)
// Aquí iría la lógica para manejar la subida de imágenes y actualizar el objeto userData
// ...

async function fetchGraphQL(query, variables) {
    const proxyUrl = 'http://localhost:3000/proxy';

    const bodyData = {
        url: urlGraphQL,
        query: query,
        variables: variables
    };

    try {
        const response = await fetch(urlGraphQL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables,
            }),
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

        // Aquí puedes manejar la respuesta, como redirigir al usuario o mostrar un mensaje
        if (response.data && response.data.createUser.success) {
            console.log('Usuario creado con éxito:', response.data.createUser.message);
            // Por ejemplo, redirigir a la página de inicio de sesión
            window.location.href = 'home.html';
        } else {
            console.error('Error al crear usuario:', response.errors ? response.errors : response.data.createUser.message);
        }
    } catch (error) {
        console.error('Error al crear usuario:', error);
    }   
}

// En la última vista (por ejemplo, en recent-pics.html)
// document.getElementById('submitAllButton').addEventListener('click', async function() {
//     
//     // Aquí debes añadir la lógica para recopilar las imágenes y otros datos faltantes
//     // Por ejemplo, añadir fotos al objeto userData
    
//     // Redirigir o mostrar mensaje según la respuesta de createUser
// });
