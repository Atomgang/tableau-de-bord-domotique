const express = require('express');
const path = require('path');
const app = express();
const port = 3002;

// Middleware CORS simple pour autoriser les requêtes depuis le navigateur
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Middleware pour parser le JSON
app.use(express.json());

// Servir les fichiers statiques depuis le dossier actuel
app.use(express.static(path.join(__dirname)));

// Données simulées des capteurs (remplacer par données réelles de l'Arduino)
let sensorData = {
  temperature: 22,
  humidity: 50,
  luminosity: 10000,
  CO2: 400,
  presence: false
};

// Simulation de variations des capteurs (comme si c'était réel)
setInterval(() => {
  sensorData.temperature += (Math.random() - 0.5) * 2; // Variation de ±1°C
  sensorData.temperature = Math.max(15, Math.min(30, sensorData.temperature)); // Limiter entre 15-30°C
  sensorData.humidity += (Math.random() - 0.5) * 5; // Variation de ±2.5%
  sensorData.humidity = Math.max(30, Math.min(80, sensorData.humidity)); // Limiter entre 30-80%
  sensorData.luminosity += (Math.random() - 0.5) * 2000; // Variation de ±1000 lx
  sensorData.luminosity = Math.max(1000, Math.min(15000, sensorData.luminosity)); // Limiter
  sensorData.CO2 += (Math.random() - 0.5) * 100; // Variation de ±50 ppm
  sensorData.CO2 = Math.max(300, Math.min(1000, sensorData.CO2)); // Limiter
  sensorData.presence = Math.random() > 0.7; // 30% de chance de présence
}, 5000); // Mise à jour toutes les 5 secondes

// Endpoint pour récupérer les données des capteurs
app.get('/api/sensors', (req, res) => {
  res.json(sensorData);
});

// Endpoint pour mettre à jour les données (utilisé par l'Arduino plus tard)
app.post('/api/sensors', (req, res) => {
  sensorData = { ...sensorData, ...req.body };
  console.log('Données mises à jour :', sensorData);
  res.json({ message: 'Données mises à jour' });
});

app.listen(port, () => {
  console.log(`Serveur domotique en écoute sur http://localhost:${port}`);
});