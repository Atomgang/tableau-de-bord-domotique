# Tableau de Bord Domotique avec Arduino et Raspberry Pi

Ce projet transforme votre tableau de bord domotique statique en un système réel utilisant un Arduino pour la collecte de données de capteurs et un Raspberry Pi comme serveur API.

## Architecture

- **Front-end** : `jsT.html` - Interface web utilisant `fetch` pour récupérer les données
- **Serveur** : `server.js` (Node.js/Express) - API REST exposant les données des capteurs
- **Arduino** : `arduino_sensor.ino` - Collecte des données de capteurs et les envoie via Serial
- **Lecteur Arduino** : `arduino_reader.py` - Script Python lisant les données Serial et les envoyant à l'API

## Installation et Configuration

### 1. Raspberry Pi (Serveur)

```bash
# Installer Node.js et Python
sudo apt update
sudo apt install nodejs npm python3 python3-pip

# Installer les dépendances Python
pip3 install pyserial requests

# Dans le dossier du projet
npm install
```

### 2. Arduino

- Ouvrez `arduino_sensor.ino` dans l'IDE Arduino
- Téléversez le sketch sur votre Arduino
- Connectez l'Arduino au Raspberry Pi via USB

### 3. Configuration des ports

- Vérifiez le port USB de l'Arduino : `ls /dev/tty*`
- Modifiez `SERIAL_PORT` dans `arduino_reader.py` si nécessaire (ex. `/dev/ttyUSB0`)

## Lancement

### 1. Démarrer le serveur API

```bash
node server.js
```

Le serveur sera accessible sur `http://localhost:3002`

### 2. Ouvrir le front-end depuis le serveur

- Accédez à `http://localhost:3002/jsT.html`
- Cela évite les erreurs CORS liées à l'ouverture du fichier en `file://`

### 3. Démarrer le lecteur Arduino (dans un autre terminal)

```bash
python3 arduino_reader.py
```

### 3. Ouvrir le front-end

- Ouvrez `jsT.html` dans un navigateur
- Modifiez l'URL dans `fetchData()` pour pointer vers votre Raspberry Pi (ex. `http://192.168.1.100:3000/api/sensors`)

## Prochaines étapes

- Connecter de vrais capteurs à l'Arduino (DHT11 pour température/humidité, etc.)
- Ajouter WebSocket pour des mises à jour en temps réel
- Stocker les données dans une base de données
- Ajouter des contrôles (allumer/éteindre des appareils)

## Dépannage

- **Erreur Serial** : Vérifiez les permissions USB (`sudo usermod -a -G dialout $USER`)
- **API non accessible** : Vérifiez le firewall et l'adresse IP
- **Données non mises à jour** : Vérifiez les logs du serveur et du lecteur Arduino
