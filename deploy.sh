#!/usr/bin/env bash
set -euo pipefail

# Script de déploiement minimal pour le Raspberry Pi
# Adaptez APP_DIR et GIT_BRANCH si nécessaire.

APP_DIR="/home/mastangai/domotique-env"
GIT_BRANCH="IHM"
SERVICES=(rpi-server.service arduino-reader.service)

echo "Déploiement dans ${APP_DIR} (branche ${GIT_BRANCH})"

if [ ! -d "${APP_DIR}" ]; then
  echo "Erreur : ${APP_DIR} n'existe pas. Créez le répertoire ou ajustez APP_DIR." >&2
  exit 2
fi

cd "${APP_DIR}"

# Mettre à jour le code depuis le remote
if [ -d ".git" ]; then
  git fetch --all --prune
  git reset --hard "origin/${GIT_BRANCH}"
else
  echo "Pas de repo git dans ${APP_DIR} — veuillez cloner ou copier les fichiers manuellement." >&2
fi

# Installer dépendances Node
if command -v npm >/dev/null 2>&1; then
  npm install --no-audit --no-fund
else
  echo "npm non trouvé — installez node/npm avant." >&2
fi

# Installer dépendances Python (local user)
if command -v pip3 >/dev/null 2>&1; then
  pip3 install --user pyserial requests
else
  echo "pip3 non trouvé — installez python3-pip avant." >&2
fi

# Copier les services systemd (nécessite sudo)
for svc in "${SERVICES[@]}"; do
  if [ -f "${APP_DIR}/${svc}" ]; then
    echo "Copie de ${svc} vers /etc/systemd/system/"
    sudo cp "${APP_DIR}/${svc}" /etc/systemd/system/
  else
    echo "Avertissement : ${svc} non trouvé dans ${APP_DIR}, saut." >&2
  fi
done

# Recharger systemd et activer/redémarrer les services
sudo systemctl daemon-reload
for svc in "${SERVICES[@]}"; do
  sudo systemctl enable --now "${svc}" || true
  sudo systemctl restart "${svc}" || true
done

# Afficher statut
for svc in "${SERVICES[@]}"; do
  echo "--- statut ${svc} ---"
  sudo systemctl status "${svc}" --no-pager || true
done

echo "Déploiement terminé. Vérifiez les logs avec : sudo journalctl -u rpi-server.service -f" 
