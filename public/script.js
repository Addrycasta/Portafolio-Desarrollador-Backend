// Script para manejar el envío del formulario
document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario

    // Obtener valores del formulario
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    try {
        // Envía los datos al servidor usando fetch
        const response = await fetch('http://localhost:3000/contact', {
            method: 'POST', // Método HTTP
            headers: {
                'Content-Type': 'application/json', // Tipo de contenido
            },
            body: JSON.stringify({ name, email, message }), // Datos en formato JSON
        });

        // Maneja la respuesta del servidor
        if (response.ok) {
            alert('¡Mensaje enviado con éxito!');
            document.querySelector("form").reset(); // Limpia el formulario
        } else {
            alert('Hubo un problema al enviar el mensaje.');
        }
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        alert('No se pudo conectar con el servidor. Por favor, inténtalo más tarde.');
    }
});
