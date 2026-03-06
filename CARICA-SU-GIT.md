# Come caricare il progetto su Git (GitHub)

## 1. Crea un account e un repository su GitHub

1. Vai su **https://github.com** e accedi (o registrati).
2. Clicca **“New”** (nuovo repository).
3. Nome esempio: **agente-bing** o **luigi-pupazzo**.
4. Lascia **Public** e **non** spuntare “Add a README” (la cartella ce l’hai già).
5. Clicca **“Create repository”**.

---

## 2. Apri il Terminale e vai nella cartella del progetto

```bash
cd /Users/miguel/agente-bing
```

---

## 3. Inizializza Git (solo la prima volta)

```bash
git init
```

---

## 4. Aggiungi tutti i file

```bash
git add .
```

(Il punto = tutti i file. Il file `.gitignore` esclude già cose come `.DS_Store`.)

---

## 5. Fai il primo commit

```bash
git commit -m "Prima versione: Luigi pupazzo 3D con voce e natura"
```

---

## 6. Collega il repository GitHub

Sostituisci **TUO-USERNAME** e **NOME-REPO** con i tuoi (es. `mario-rossi` e `agente-bing`):

```bash
git remote add origin https://github.com/TUO-USERNAME/NOME-REPO.git
```

Esempio:
```bash
git remote add origin https://github.com/mario-rossi/agente-bing.git
```

---

## 7. Carica sul branch principale

```bash
git branch -M main
git push -u origin main
```

Ti chiederà le credenziali GitHub (username + password oppure **Personal Access Token**). Se usi l’autenticazione a 2 fattori, su GitHub devi creare un token: **Settings → Developer settings → Personal access tokens**.

---

## Dopo la prima volta: come aggiornare il progetto su GitHub

Quando modifichi i file:

```bash
cd /Users/miguel/agente-bing
git add .
git commit -m "Descrizione delle modifiche"
git push
```

---

## Riepilogo comandi (copia-incolla)

```bash
cd /Users/miguel/agente-bing
git init
git add .
git commit -m "Prima versione: Luigi pupazzo 3D"
git remote add origin https://github.com/TUO-USERNAME/NOME-REPO.git
git branch -M main
git push -u origin main
```

Sostituisci `TUO-USERNAME` e `NOME-REPO` con i tuoi dati di GitHub.
