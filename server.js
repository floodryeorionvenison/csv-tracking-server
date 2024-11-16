const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const USED_PERSONS_FILE = './used_persons.csv'; // Bestand met gebruikte personen

// Zorg ervoor dat het bestand bestaat
if (!fs.existsSync(USED_PERSONS_FILE)) {
    fs.writeFileSync(USED_PERSONS_FILE, '');
}

// Endpoint om gebruikte personen op te halen
app.get('/used-persons', (req, res) => {
    fs.readFile(USED_PERSONS_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Fout bij lezen van bestand:', err);
            res.status(500).send('Fout bij het ophalen van gegevens.');
        } else {
            res.send(data);
        }
    });
});

// Endpoint om nieuwe gegevens toe te voegen aan het bestand
app.post('/used-persons', (req, res) => {
    const { person } = req.body; // Ontvang nieuwe persoon als string
    if (!person) {
        return res.status(400).send('Geen persoon opgegeven.');
    }

    // Voeg persoon toe aan bestand
    fs.appendFile(USED_PERSONS_FILE, `${person}\n`, (err) => {
        if (err) {
            console.error('Fout bij opslaan van gegevens:', err);
            res.status(500).send('Fout bij opslaan van gegevens.');
        } else {
            res.send('Persoon toegevoegd.');
        }
    });
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server draait op poort ${PORT}`);
});