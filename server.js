const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'moon')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'moon', 'moon.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});