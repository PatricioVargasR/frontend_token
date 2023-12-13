const SERVER_URL = "http://127.0.0.1:8000";

document.addEventListener('DOMContentLoaded', checarStatus);

async function checarStatus() {
    try {
        const response = await fetch(SERVER_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        });

        if (response.status === 200) {
            const urlParams = new URLSearchParams(window.location.search);
            const email = urlParams.get('email');

            // Llama a la función para obtener y mostrar el registro
            getContactById(email);
        } else if (response.status === 401) {
            window.location.href = "/";
            alert("Token inválido");
        } else {
            handleErrorResponse(response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("statusMessage").innerHTML = "Error checando el estado del servidor";
    }
}

// Función para obtener un solo registro por su ID
async function getContactById(email) {
    const token = sessionStorage.getItem('token');

    if (!token) {
        console.error('Token not found. Redirecting to login page.');
        window.location.href = '/sesion';
        return;
    }

    try {
        const response = await fetch(`${SERVER_URL}/contactos/${email}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const contacto = await response.json();


            const detalle = document.getElementById("detalle");
            detalle.innerHTML = `
                <p>Email: ${contacto.email}</p>
                <p>Nombre: ${contacto.nombre}</p>
                <p>Teléfono: ${contacto.telefono}</p>
            `;
        } else {
            handleErrorResponse(response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
        handleErrorResponse(500, "Internal Server Error");
    }
}


