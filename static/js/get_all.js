const SERVER_URL = "http://127.0.0.1:8000";
const CONTACTS_ENDPOINT = "/contactos";

document.addEventListener('DOMContentLoaded', getAll);

async function getAll() {
    const token = sessionStorage.getItem('token');

    if (!token) {
        console.error('Token not found. Redirecting to login page.');
        window.location.href = '/sesion';
        return;
    }

    try {
        const serverStatusResponse = await checkServerStatus();

        if (serverStatusResponse.status === 200) {
            const contactsResponse = await fetchContacts(token);

            if (contactsResponse.ok) {
                handleContactsResponse(await contactsResponse.json());
            } else {
                handleErrorResponse(contactsResponse.status, contactsResponse.statusText);
            }
        } else if (serverStatusResponse.status === 401) {
            window.location.href = "/sesion";
            alert("Token inválido");
        } else {
            handleErrorResponse(serverStatusResponse.status, serverStatusResponse.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('statusMessage').innerText = 'Error checking server status';
    }
}

async function fetchContacts(token) {
    return fetch(`${SERVER_URL}${CONTACTS_ENDPOINT}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

async function checkServerStatus() {
    return fetch(`${SERVER_URL}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });
}

function handleContactsResponse(json) {
    const tbody_contactos = document.getElementById("tbody_contactos");
    tbody_contactos.innerHTML = "";

    for (const contacto of json) {
        const tr = document.createElement("tr");
        tr.appendChild(createTableCell(contacto.email));
        tr.appendChild(createTableCell(contacto.nombre));
        tr.appendChild(createTableCell(contacto.telefono));
        tr.appendChild(createOptionsCell(contacto.email));

        tbody_contactos.appendChild(tr);
    }
}

function createTableCell(value) {
    const td = document.createElement("td");
    td.textContent = value;
    return td;
}

function createOptionsCell(email) {
    const td = document.createElement("td");
    td.innerHTML = `<a href='/ver?email=${email}'>Ver</a> <a href='/editar?email=${email}'>Editar</a> <a href='/eliminar?email=${email}'>Borrar</a>`;
    return td;
}

