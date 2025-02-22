const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const texts = [
    "The quick brown fox jumps over the lazy dog.",
    "Practice makes a man perfect.",
    "Typing speed increases with practice.",
    "This is a simple typing test game.",
];

// API to get a random text
app.get("/text", (req, res) => {
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    console.log("Serving text:", randomText);
    res.json({ text: randomText });
});

// Start the server on port 5500
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
