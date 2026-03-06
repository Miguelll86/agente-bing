#!/bin/bash
# Avvia un server nella cartella agente-bing accessibile in rete locale (stesso Wi-Fi)
cd "$(dirname "$0")"
echo "Server in ascolto. Apri da telefono/tablet (stesso Wi-Fi):"
echo ""
ip=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "INDIRIZZO_IP")
echo "  http://${ip}:8080"
echo ""
echo "Per fermare: Ctrl+C"
echo ""
python3 -m http.server 8080 --bind 0.0.0.0
