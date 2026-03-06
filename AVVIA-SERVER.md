# Come aprire Luigi in rete

## Opzione 1 – Solo nella tua rete (Wi‑Fi di casa)

Serve così altri dispositivi (telefono, tablet) sulla **stessa Wi‑Fi** possano aprire l’app.

### Con Python (di di di di solito già installato)

1. Apri il **Terminale**.
2. Vai nella cartella del progetto:
   ```bash
   cd /Users/miguel/agente-bing
   ```
3. Avvia il server (ascolta su tutta la rete locale):
   ```bash
   python3 -m http.server 8080 --bind 0.0.0.0
   ```
4. Sul Mac scopri il tuo indirizzo IP locale:
   - **Preferenze di sistema → Rete → Wi‑Fi → Dettagli** (o **Avanzate**), oppure
   - Nel Terminale: `ipconfig getifaddr en0`
5. Sul telefono/tablet (stesso Wi‑Fi) apri il browser e vai a:
   ```
   http://INDIRIZZO_IP:8080
   ```
   Esempio: se l’IP è `192.168.1.10` → `http://192.168.1.10:8080`

Per fermare il server: nel Terminale premi **Ctrl+C**.

---

## Opzione 2 – Online (da qualsiasi posto)

Per avere un link apribile da **qualsiasi rete** (anche da fuori casa):

### Servizi gratuiti (carichi la cartella e ti danno un URL)

1. **Netlify Drop** – https://app.netlify.com/drop  
   Trascina la cartella `agente-bing` (con dentro `index.html`, `app.js`, `risposte.json`, `avatar.png` se ce l’hai) nella pagina. Netlify ti darà un link tipo `https://nome-casuale.netlify.app`.

2. **Vercel** – https://vercel.com  
   Collega un progetto da GitHub o usa “Import” e carica la cartella. Ti assegna un dominio tipo `tuo-progetto.vercel.app`.

3. **GitHub Pages**  
   Crea un repository, carica i file del progetto, attiva Pages nelle impostazioni. L’URL sarà tipo `https://tuo-username.github.io/nome-repo`.

### Cosa deve esserci nella cartella quando la carichi

- `index.html`
- `app.js`
- `risposte.json`
- `avatar.png` (se usi l’avatar immagine)

**Nota:** Il microfono (voce) e la sintesi vocale funzionano solo su **HTTPS** (o su `localhost`). I siti Netlify/Vercel/GitHub Pages sono già in HTTPS, quindi la voce andrà bene. In rete locale con `http://IP:8080` il microfono può non funzionare su alcuni browser (Chrome a volte lo permette, Safari spesso no).
