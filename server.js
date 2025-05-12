const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '.')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const highScoreFile = 'highscore.json';

function readHighScore() {
    try {
        const data = fs.readFileSync(highScoreFile, 'utf8');
        return JSON.parse(data).highScore;
    } catch (err) {
        console.error('Error reading high score:', err);
        return 0;
    }
}

function writeHighScore(newHighScore) {
    try {
        fs.writeFileSync(highScoreFile, JSON.stringify({ highScore: newHighScore }));
        console.log('High score updated successfully.');
    } catch (err) {
        console.error('Error writing high score:', err);
    }
}

app.get('/highscore', (req, res) => {
    const highScore = readHighScore();
    res.json({ highScore });
});

app.post('/highscore', (req, res) => {
    const newScore = parseInt(req.body.highScore, 10);

    if (isNaN(newScore)) {
        return res.status(400).json({ message: 'Invalid score received.' });
    }

    const currentHighScore = readHighScore();

    if (newScore >= currentHighScore) { 
        writeHighScore(newScore);
        return res.json({ message: 'High score updated.' }); 
    }

    return res.json({ message: 'Not a new high score.' });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});