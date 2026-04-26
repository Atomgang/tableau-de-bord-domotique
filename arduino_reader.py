#!/usr/bin/env python3
import serial
import json
import requests
import time

# Configuration
SERIAL_PORT = '/dev/ttyACM0'  # Port USB de l'Arduino (vérifier avec ls /dev/tty*)
BAUD_RATE = 9600
API_URL = 'http://localhost:3000/api/sensors'

def main():
    try:
        # Ouvrir la connexion série avec l'Arduino
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        print(f"Connecté à l'Arduino sur {SERIAL_PORT}")

        while True:
            try:
                # Lire une ligne depuis l'Arduino
                line = ser.readline().decode('utf-8').strip()
                if line:
                    print(f"Données reçues de l'Arduino : {line}")
                    # Parser le JSON
                    data = json.loads(line)
                    # Envoyer à l'API
                    response = requests.post(API_URL, json=data)
                    if response.status_code == 200:
                        print("Données envoyées à l'API avec succès")
                    else:
                        print(f"Erreur API : {response.status_code}")
            except json.JSONDecodeError:
                print(f"Erreur de parsing JSON : {line}")
            except requests.RequestException as e:
                print(f"Erreur de requête API : {e}")

            time.sleep(1)  # Petite pause

    except serial.SerialException as e:
        print(f"Erreur de connexion série : {e}")
    except KeyboardInterrupt:
        print("Arrêt du script")
        ser.close()

if __name__ == "__main__":
    main()