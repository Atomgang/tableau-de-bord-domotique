const express = require('express');
const path = require('path');
const app = express();
const port = 3000; // Doit correspondre à arduino_reader.py

// Autoriser l'accès depuis le réseau
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname)));

let sensorData = {
  temperature: null,
  humidity: null,
  luminosity: null,
  CO2: null,
  presence: null,
  updatedAt: null
};

app.get('/api/sensors', (req, res) => {
  res.json(sensorData);
});

// Endpoint utilisé par l'Arduino/Python pour poster les mesures
app.post('/api/sensors', (req, res) => {
  sensorData = { ...sensorData, ...req.body, updatedAt: new Date().toISOString() };
  console.log('Données reçues:', sensorData);
  res.json({ message: 'Données mises à jour', sensorData });
});

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(port, '0.0.0.0', () => {
  console.log(`RPI server listening on http://0.0.0.0:${port}`);
});
