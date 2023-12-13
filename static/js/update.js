const SERVER_URL = "http://127.0.0.1:8000";
const CONTACTS_ENDPOINT = "/actualizar_contactos";

const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');

checarStatus();

async function checarStatus() {
    try {
        const response = await fetch(`${SERVER_URL}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        if (response.status === 200) {
            getContactById(email);
        } else if (response.status === 401) {
            window.location.href = "/sesion";
            return alert("Token invalido");
        } else {
            manejarRespuestaError(response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error", error);
        document.getElementById("statusMessage").innerHTML = "Error checando el estado del servidor";
    }
}

async function getContactById(email) {
    try {
        const token = sessionStorage.getItem('token');

        if (!token) {
            console.error('Token not found. Redirecting to login page.');
            window.location.href = '/sesion';
            return;
        }

        const response = await fetch(`${SERVER_URL}/contactos/${email}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const contacto = await response.json();

            console.log(contacto);
            const emailInput = document.getElementById("emailInput");
            const nombreInput = document.getElementById("nombreInput");
            const telefonoInput = document.getElementById("telefonoInput");

            emailInput.value = contacto.email;
            nombreInput.value = contacto.nombre;
            telefonoInput.value = contacto.telefono;
        } else {
            manejarRespuestaError(response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error fetching contact:', error);
    }
}

function updateData(email, nombre, telefono) {
    const token = sessionStorage.getItem('token');

    if (!token) {
        console.error('Token not found. Redirecting to login page.');
        window.location.href = '/sesion';
        return;
    }

    fetch(`${SERVER_URL}${CONTACTS_ENDPOINT}/${email}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, nombre, telefono })
    })
    .then(response => {
        if (response.ok) {
            alert(response.statusText);
            window.location.href = '/';
        } else {
            return response.json().then(error => Promise.reject(error));
        }
    })
    .catch(error => {
        console.error('Error updating contact:', error);
        manejarRespuestaError(error.status, error.statusText);
    });
}

