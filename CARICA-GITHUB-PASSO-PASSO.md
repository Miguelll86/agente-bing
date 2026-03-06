# Caricare su GitHub senza errori

Se GitHub dà **"Something went really wrong"** quando carichi tutto insieme, carica **in due volte**.

---

## Step 1 – Carica prima solo questi file (senza avatar)

Nella pagina del tuo repository su GitHub:

1. Clicca **"Add file"** → **"Upload files"**
2. Trascina **solo** questi file (uno alla volta o selezionandoli insieme):
   - `index.html`
   - `app.js`
   - `risposte.json`
   - `ISTRUZIONI.md`
   - `AVVIA-SERVER.md`
   - `avvia.sh`

**Non** includere ancora `avatar.png` né `.gitignore`.

3. Scrivi un messaggio (es. *Prima versione*) e clicca **"Commit changes"**.

---

## Step 2 – Aggiungi l’avatar

1. Di nuovo **"Add file"** → **"Upload files"**
2. Trascina **solo** `avatar.png`
3. Messaggio (es. *Aggiunto avatar*) → **"Commit changes"**.

---

Se anche così da errore, prova a caricare **un file per volta** (parti da `index.html`, poi `app.js`, ecc.). In questo modo si capisce quale file crea problema.
