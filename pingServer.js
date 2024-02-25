const express = require('express');
const ping = require('ping');

const app = express();
const PORT = 3000;

// Objeto para almacenar el historial de latencias
const cache = {};

// Función para realizar ping a un dispositivo y actualizar el historial
const pingDevice = async (device) => {
    try {
        const result = await ping.promise.probe(device);
        const timestamp = new Date().toISOString();

        if (!cache[device]) {
            cache[device] = [];
        }

        cache[device].push({ timestamp, latency: result.time });

        // Mantener el historial hasta 24 horas
        if (cache[device].length > 2880) {
            cache[device].shift();
        }
    } catch (error) {
        console.error(`Error pinging ${device}: ${error.message}`);
    }
};

// Programar pings periódicos a todos los dispositivos cada 30 minutos
setInterval(() => {
    // Muestra cada ping en la consola
    console.log('Executing ping interval...');
    // Ejecutar el ping al inicio y luego cada 30 minutos
    const devices = ['router1', 'router2'];  // Muestra los nombres de los dispositivos
    devices.forEach((device) => {
        pingDevice(device);
    });
}, 60 * 1000);  // 30 minutos en milisegundos

// Ruta para obtener la información en caché de todos los dispositivos
app.get('/devices', (req, res) => {
    const latestLatencies = {};
    Object.keys(cache).forEach((device) => {
        const latestPing = cache[device][cache[device].length - 1];
        latestLatencies[device] = latestPing ? latestPing.latency : null;
    });
    res.json(latestLatencies);
});

// Ruta para obtener el historial de latencias de un dispositivo específico
app.get('/device/:device', (req, res) => {
    const device = req.params.device;
    const deviceHistory = cache[device] || [];
    res.json(deviceHistory);
});

// Controlador de ruta predeterminado para la ruta raíz
app.get('/', (req, res) => {
    res.send('Ping cada 30 minutos');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
