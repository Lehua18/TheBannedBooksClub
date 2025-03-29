const express = require('express');
const path = require('path');
const app = express();

// Serve static files (your HTML, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Redirect all forum.html subpaths to forum.html
app.get('/Banned%20Books%20Club/forum.html/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'forum.html'));
});

// Start the server
const PORT = process.env.PORT || 63342;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
