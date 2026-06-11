# Tableau de Bord Domotique avec Arduino et Raspberry Pi

Ce projet est un tableau de bord domotique hybride où l'Arduino collecte les mesures des capteurs et le Raspberry Pi sert de serveur API pour les transmettre au front-end.

## Contenu réel du projet

- **Front-end** : `dashboard.html` (avec plusieurs versions de maquettes dans le dépôt)
- **Serveur de test local** : `Demo-server.js` (simulateur de données pour développement)
- **Serveur RPi réel** : `rpi-server.js` (API Node.js/Express écoutant sur le port `3000`)
- **Arduino** : `arduino_sensor.ino` (sketch envoyant du JSON sur la liaison série)
- **Lecteur Arduino** : `arduino_reader.py` (Python lisant le port série et postant les données vers l'API)

## État actuel

- Phase de test réel : terminée avec succès
- Le Raspberry Pi peut exécuter le serveur et recevoir les données envoyées par l'Arduino via USB
- Les capteurs Arduino ont été testés et la fiabilité de la transmission a été validée

## Installation et configuration

### 1. Préparer le Raspberry Pi

```bash
sudo apt update
sudo apt install nodejs npm python3 python3-pip -y
pip3 install pyserial requests
cd /home/pi/domotic_dashboard
npm install
```

### 2. Préparer l'Arduino

- Ouvrez `arduino_sensor.ino` dans l'IDE Arduino
- Téléversez le sketch sur votre Arduino
- Branchez l'Arduino en USB sur le Raspberry Pi

### 3. Vérifier le port série

```bash
ls /dev/ttyACM* /dev/ttyUSB*
dmesg | tail -n 20
```

- Mettez à jour `SERIAL_PORT` dans `arduino_reader.py` si nécessaire
- Pour un serveur RPi local, `API_URL` doit rester `http://localhost:3000/api/sensors`

## Lancement

### Démarrer le serveur RPi

```bash
npm run start:rpi
```

### Lancer le lecteur Arduino

```bash
python3 arduino_reader.py
```

### Vérifier le fonctionnement

- Le serveur doit répondre à `http://localhost:3000/api/sensors`
- Le script Python doit afficher les JSON reçus et l'envoi à l'API

## Utiliser le front-end

- Ouvrez `dashboard.html` dans un navigateur local ou à distance
- Assurez-vous que le front-end pointe vers l'URL de l'API RPi (par exemple `http://<IP_RPI>:3000/api/sensors`)

## Scripts utiles

- `npm run start:demo` : démarre `Demo-server.js`, utilisé pour les tests locaux sans Arduino
- `npm run start:rpi` : démarre `rpi-server.js`, utilisé pour la phase réelle avec Arduino connecté

## Démarrage automatique avec systemd

Le dépôt contient des exemples de services systemd pour lancer automatiquement le serveur et le lecteur Arduino sur un Raspberry Pi :

- `rpi-server.service` : lance `rpi-server.js`
- `arduino-reader.service` : lance `arduino_reader.py`

Copiez-les dans `/etc/systemd/system/`, puis exécutez :

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now rpi-server.service
sudo systemctl enable --now arduino-reader.service
sudo systemctl status rpi-server.service
sudo systemctl status arduino-reader.service
```

Si vous modifiez les chemins ou l'utilisateur, mettez à jour les fichiers `.service` avant d'activer.

## Prochaines étapes

1. Passage en production
2. Intégration de protocoles sans fil :
   - Bluetooth
   - LoRaWAN
3. Évolution possible :
   - capteurs réels connectés à l'Arduino
   - transmission directe sans câble via protocole radio
   - stockage historique des mesures

## Dépannage

- **Erreur de port série** : vérifier le bon device et les permissions (`sudo usermod -a -G dialout $USER`)
- **API introuvable** : vérifier que `rpi-server.js` tourne et écoute sur `0.0.0.0:3000`
- **Données non reçues** : vérifier les logs du script Python et du serveur
