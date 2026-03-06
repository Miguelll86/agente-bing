# Come istruire Luigi

Luigi risponde in base a **regole** che puoi modificare. Le regole sono nel file **`risposte.json`** nella stessa cartella dell’app.

## Struttura di `risposte.json`

- **`regole`**: elenco di oggetti. Ogni oggetto ha:
  - **`trigger`**: array di parole o frasi. Se l’utente dice qualcosa che *contiene* una di queste (o è uguale), Luigi userà questa regola.
  - **`risposta`**: cosa dice Luigi (e che viene letto a voce).

- **`fallback`**: risposta usata quando nessuna regola corrisponde.

## Esempio

Per far sì che quando qualcuno dice "che ore sono" Luigi risponda "Non ho l’orologio, scusa!":

1. Apri `risposte.json`.
2. Aggiungi un nuovo oggetto dentro `regole`:

```json
{
  "trigger": ["che ore sono", "che ora è", "ora"],
  "risposta": "Non ho l'orologio, scusa!"
}
```

3. Salva il file e ricarica l’app nel browser.

## Consigli

- **Trigger**: usa minuscole. Luigi confronta sempre in minuscolo.
- **Più trigger**: puoi mettere più varianti nella stessa regola (es. "ciao", "salve", "buongiorno").
- **Ordine**: se due regole possono corrispondere, viene usata la **prima** nella lista. Metti le regole più specifiche sopra a quelle più generiche.
- Dopo ogni modifica a `risposte.json` ricarica la pagina per vedere le nuove risposte.
