const SERVER_URL = "http://127.0.0.1:8000";
const ENDPOINT = "/contactos"

async function insertData(email, nombre, telefono) {
    const token = sessionStorage.getItem('token');
    var data = {
        email: email,
        nombre: nombre,
        telefono: telefono
    };

    if (!token) {
        console.error('Token not found. Redirecting to login page.');
        window.location.href = '/sesion';
        return;
    }

    try {
        const respuestaServidorStatus = await checarStatus();
        console.log(respuestaServidorStatus.status);

        if (respuestaServidorStatus.status === 200){

            var respuestaContactos = await insertarContacto(data, token)
            console.log(respuestaContactos.status);

            if (respuestaContactos.status === 200){
                window.location.href = "/";
                return alert("Contacto ingresado correctamente");
            } else {
                manejarRespuestaError(respuestaContactos.status, respuestaContactos.statusText);
            }

        } else if (respuestaServidorStatus.status === 401){
            window.location.href = "/sesion";
            return alert("Token Invalido");
        } else {
            manejarRespuestaError(respuestaServidorStatus.status, respuestaServidorStatus.statusText)
        }
    } catch(error) {
        console.error("Error", error);
        //document.getElementById("statusMessage").innerHTML = "Error checando el estado del servidor";
    }


}


// Modificación del método insetarContacto
async function insertarContacto(data, token){
    const request = new XMLHttpRequest();

    if(!data){
        console.log('Ocurrió un error');
    }

    request.open('POST', `${SERVER_URL}${ENDPOINT}`, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', `Bearer ${token}`);

    return new Promise((resolve, reject) => {
        request.onload = () => resolve(request)
        request.onerror = (error) => reject(error);
        request.send(JSON.stringify(data));
        console.log(request)
        
    });

}

// Modificación del método para verificar el estado
function checarStatus(){
    return fetch(`${SERVER_URL}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    });
}

function manejarRespuestaError(status, statusText){
    console.error(`Error: ${status} - ${statusText}`);

}