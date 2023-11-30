let noMoreProfiles = false; 
let currentPage = 0; // Página actual
let swipedIds = []; // IDs de perfiles a los que ya se les ha hecho "swipe"
const THRESHOLD = 0;  // Cantidad de perfiles restantes para cargar más
let SIZE = 10; // Inicializa con null
let swipeCounter = 0; // Contador de "swipes" desde la última carga
const urlGraphQL = `http://34.150.137.112:4000/graphql`;

async function fetchGraphQL(query, variables) {
    const proxyUrl = 'http://localhost:3000/proxy'; // Asegúrate de usar la dirección correcta de tu servidor proxy

    const bodyData = {
        url: urlGraphQL,
        query: query,
        variables: variables
    };

    const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(bodyData)  // Convertir los datos en una cadena JSON
    });

    return await response.json();
}


async function getSwipesData(callback) {
    if (noMoreProfiles) {
        return;
    }
    
    const QUERY = `
        query ($userId: String!, $maxAge: Int!, $minAge: Int!, $distance: String!, $lat: Float!, $lon: Float!) {
            swipe(user_id: $userId, max_age: $maxAge, min_age: $minAge, distance: $distance, lat: $lat, lon: $lon) {
                fullName
                birthday
                hoobies
                userName
                sex
                lat
                lon
                mail
                pics
                bio
                oSex
            }
        }
    `;


    const VARIABLES = { 
        userId: "O8eaMYsBeDr49nQf_d1k", // Este valor probablemente cambie dependiendo del usuario
        maxAge: 50,
        minAge: 18,
        distance: "100km",
        lat: 4.651372,
        lon: -74.092367
    };

    const jsonData = await fetchGraphQL(QUERY, VARIABLES);
    console.log(jsonData);

    if (jsonData.data && jsonData.data.swipe && jsonData.data.swipe.length > 0) {
        SIZE = jsonData.data.swipe.length;  // Actualiza el valor de SIZE
        callback(jsonData.data.swipe);
        currentPage++;
    } else {
        noMoreProfiles = true;
        showNoMoreProfilesMessage();
    }
}

function generateCards(data) {
    var cardContainer = document.querySelector('.dz-gallery-slider');
    cardContainer.innerHTML = '';  // Limpiar contenido actual

    data.forEach(function(profile) {
        var card = `
        <div class="demo__card" data-profile-id="${profile.userName}">  <!-- Usé userName como ID porque no vi un campo _id -->
            <div class="dz-media">
                <img src="https://storage.googleapis.com/cupigo-images/${profile.pics}" alt="${profile.fullName}">
            </div>
            <div class="dz-content">
                <div class="left-content">
                    <h4 class="title"><a href="profile-detail.html">${profile.fullName}, ${getAge(profile.birthday)}</a></h4>
                    <p class="mb-0"><i class="icon feather icon-map-pin"></i> Location Data</p>
                </div>
                <a href="javascript:void(0);" class="dz-icon dz-sp-like"><i class="flaticon flaticon-star-1"></i></a>
            </div>
            <div class="demo__card__choice m--reject">
                <i class="fa-solid fa-xmark"></i>
            </div>
            <div class="demo__card__choice m--like">
                <i class="fa-solid fa-check"></i>
            </div>
            <div class="demo__card__choice m--superlike">
                <h5 class="title mb-0">Super Like</h5>
            </div>
            <div class="demo__card__drag"></div>
        </div>
        `;
        cardContainer.innerHTML += card;
    });
}



function showNoMoreProfilesMessage() {
    var cardContainer = document.querySelector('.dz-gallery-slider');
    cardContainer.innerHTML = '<p>No hay más personas en tu área.</p>'; // Mensaje indicando que no hay más perfiles.
}

function getAge(birthday) {
    var today = new Date();
    var birthDate = new Date(birthday);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

async function onSwipe(profileId, actionType) {
  
    const SWIPE_MUTATION = `
        mutation ProcessSwipeAction($action: SwipeAction!) {
            processSwipeAction(action: $action)
        }
    `;


    const variables = {
        action: {
            profileId: profileId, // Asegúrate de pasar el ID del perfil aquí
            action: actionType // o "dislike"
        }
    };
    

    
    // Esta función se llama cada vez que se hace un "swipe".
    swipedIds.push(profileId);
    swipeCounter++;  // Incrementa el contador de "swipes"
    // Comprueba si es necesario cargar más perfiles
    if (swipeCounter >= (SIZE - THRESHOLD)) {  // Asume que SIZE es el número de perfiles que cargas cada vez
        getSwipesData(generateCards);
        swipeCounter = 0; // Resetear el contador después de cargar nuevos perfiles
    }

    try {
        const response = await fetch(urlGraphQL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query: SWIPE_MUTATION,
                variables: variables
            })
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', data);
    } catch (error) {
        console.error('Error al enviar acción de swipe:', error);
    }
}

window.onload = function() {
    getSwipesData(generateCards);
}
