const SERVER_URL = "http://127.0.0.1:8000";
const ENDPOINT = "/contactos/";

//document.getElementById("search-button").addEventListener("click", getForEmail);

async function getForEmail() {
    const email = document.getElementById("email").value;
    const token = sessionStorage.getItem('token');

    if (!token) {
        console.error("No se encontró un token, Redireccionando a la página de sesión");
        window.location.href = "/sesion";
        return;
    }

    try {
        const serverStatusResponse = await checkServerStatus();

        if (serverStatusResponse.status === 200) {
            const contactsResponse = await fetchContacts(email, token);

            if (contactsResponse.ok) {
                handleContactsResponse(await contactsResponse.json());
            } else if (contactsResponse.status === 404) {
                handleNoContactsFound();
            } else {
                handleErrorResponse(contactsResponse.status, contactsResponse.statusText);
            }
        } else if (serverStatusResponse.status === 401) {
            window.location.href = "/sesion";
            return alert("Token Invalido");
        } else {
            handleErrorResponse(serverStatusResponse.status, serverStatusResponse.statusText);
        }
    } catch (error) {
        console.error("Error", error);
        document.getElementById("statusMessage").innerHTML = "Error checando el estado del servidor";
    }
}

async function fetchContacts(email, token) {
    const response = await fetch(`${SERVER_URL}${ENDPOINT}${email}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return response;
}

function checkServerStatus() {
    return fetch(`${SERVER_URL}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });
}

function handleContactsResponse(json) {
    const tbody_contactos = document.getElementById("tbody_contactos");
    tbody_contactos.innerHTML = '';

    const tr = document.createElement("tr");
    tr.appendChild(createTableCell(json["email"]));
    tr.appendChild(createTableCell(json["nombre"]));
    tr.appendChild(createTableCell(json["telefono"]));

    tbody_contactos.appendChild(tr);
}

function handleNoContactsFound() {
    const tbody_contactos = document.getElementById("tbody_contactos");
    tbody_contactos.innerHTML = '<tr><td colspan="3">No se encontró ningún contacto con ese email.</td></tr>';
}

function createTableCell(value) {
    const td = document.createElement("td");
    td.textContent = value;
    return td;
}
