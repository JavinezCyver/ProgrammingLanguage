const textToType = document.getElementById("textToType");
const typingArea = document.getElementById("typingArea");
const restartBtn = document.getElementById("restartBtn");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const scoreElement = document.createElement("p"); // New Score Element
document.querySelector(".container").appendChild(scoreElement);

let timer = 10;
let interval;
let text = "";
let timerRunning = false;
let wordsTyped = 0;

// Fetch new text from the server
function fetchText() {
    fetch("http://127.0.0.1:5000/text")
        .then(response => response.json())
        .then(data => {
            textToType.innerText = data.text;
            text = data.text;
            typingArea.value = "";
            timer = 10;
            timerElement.innerText = "10";
            wpmElement.innerText = "0";
            scoreElement.innerText = "";
            timerRunning = false;
            clearInterval(interval);
        })
        .catch(error => console.error("Error fetching text:", error));
}

// Function to start the timer
function startTimer() {
    interval = setInterval(() => {
        if (timer > 0) {
            timer--;
            timerElement.innerText = timer;
        } else {
            clearInterval(interval);
            typingArea.disabled = true;
            calculateScore();
        }
    }, 1000);
}

// Function to calculate accuracy and WPM
function calculateScore() {
    const typedText = typingArea.value.trim();
    const originalWords = text.split(" ");
    const typedWords = typedText.split(" ");
    
    // Accuracy Calculation
    let correctWords = 0;
    originalWords.forEach((word, index) => {
        if (typedWords[index] === word) {
            correctWords++;
        }
    });
    const accuracy = ((correctWords / originalWords.length) * 100).toFixed(2);

    // Words Per Minute (WPM)
    wordsTyped = typedWords.length;
    let wpm = Math.round((wordsTyped / (10 - timer)) * 60);
    wpm = wpm > 0 ? wpm : 0;

    // Display Score
    scoreElement.innerHTML = `🎯 Accuracy: <b>${accuracy}%</b> | ⌨️ WPM: <b>${wpm}</b>`;
}

// Event Listener for Typing Input
typingArea.addEventListener("input", () => {
    if (!timerRunning) {
        timerRunning = true;
        startTimer();
    }
    
    // Check if the user finished typing
    if (typingArea.value.trim() === text) {
        clearInterval(interval);
        typingArea.disabled = true;
        calculateScore();
    }
});

// Restart Button
restartBtn.addEventListener("click", () => {
    fetchText();
    typingArea.disabled = false;
    timerRunning = false;
});

// Load a random text on startup
document.addEventListener("DOMContentLoaded", fetchText);

