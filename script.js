const wordsList = [
    { word: 'GRAVITY', hint: 'The force that attracts a body towards the center of the earth' },
    { word: 'NEBULA', hint: 'A giant cloud of dust and gas in space' },
    { word: 'GALAXY', hint: 'A system of millions or billions of stars' },
    { word: 'ORBIT', hint: 'The curved path of a celestial object' },
    { word: 'ASTRONAUT', hint: 'A person trained to travel in a spacecraft' },
    { word: 'SUPERNOVA', hint: 'A star that suddenly increases greatly in brightness' },
    { word: 'ECLIPSE', hint: 'An obscuring of the light from one celestial body by the passage of another' },
    { word: 'COMET', hint: 'A celestial object consisting of a nucleus of ice and dust' },
    { word: 'METEOR', hint: 'A small body of matter from outer space that enters the earth\'s atmosphere' },
    { word: 'WORMHOLE', hint: 'A hypothetical connection between widely separated regions of space-time' },
    { word: 'CONSTELLATION', hint: 'A group of stars forming a recognizable pattern' },
    { word: 'ASTEROID', hint: 'A small rocky body orbiting the sun' },
    { word: 'COSMOS', hint: 'The universe seen as a well-ordered whole' }
];

let currentWord = '';
let guessedLetters = [];
let wrongLetters = [];
let maxGuesses = 6;

const wordDisplay = document.getElementById('word-display');
const hintText = document.getElementById('hint-text');
const letterInput = document.getElementById('letter-input');
const launchBtn = document.getElementById('launch-btn');
const spaceDebris = document.getElementById('space-debris');
const lifeSupportCount = document.getElementById('life-support-count');
const statusMessage = document.getElementById('status-message');
const statusTitle = document.getElementById('status-title');
const reorbitBtn = document.getElementById('reorbit-btn');

// Initialize Stars Background
function createStarfield() {
    const layers = ['starfield', 'starfield2', 'starfield3'];
    layers.forEach(id => {
        const container = document.getElementById(id);
        const starCount = id === 'starfield' ? 100 : id === 'starfield2' ? 50 : 25;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.style.position = 'absolute';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            const size = Math.random() * 2 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.backgroundColor = '#fff';
            star.style.borderRadius = '50%';
            star.style.boxShadow = `0 0 ${Math.random() * 5 + 2}px #fff`;
            star.style.opacity = Math.random() * 0.8 + 0.2;
            container.appendChild(star);
        }
    });
}

function initGame() {
    // Pick random word
    const randomObj = wordsList[Math.floor(Math.random() * wordsList.length)];
    currentWord = randomObj.word.toUpperCase();
    hintText.textContent = `Hint: ${randomObj.hint}`;
    
    // Reset state
    guessedLetters = [];
    wrongLetters = [];
    updateLifeSupport();
    
    // Clear DOM
    wordDisplay.innerHTML = '';
    spaceDebris.innerHTML = '';
    statusMessage.classList.add('hidden');
    letterInput.value = '';
    letterInput.disabled = false;
    launchBtn.disabled = false;
    
    // Create slots
    for (let i = 0; i < currentWord.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'letter-slot floating';
        slot.style.animationDelay = `${(i * 0.2) - 2}s`;
        slot.dataset.index = i;
        slot.dataset.letter = currentWord[i];
        wordDisplay.appendChild(slot);
    }
    
    letterInput.focus();
}

function updateLifeSupport() {
    const remaining = maxGuesses - wrongLetters.length;
    lifeSupportCount.textContent = remaining;
    if (remaining <= 2) {
        lifeSupportCount.parentElement.style.color = 'var(--wrong-red)';
        lifeSupportCount.parentElement.style.textShadow = '0 0 10px var(--wrong-red)';
    } else {
        lifeSupportCount.parentElement.style.color = 'var(--neon-pink)';
        lifeSupportCount.parentElement.style.textShadow = '0 0 8px var(--neon-pink)';
    }
}

function handleGuess() {
    const input = letterInput.value.toUpperCase();
    letterInput.value = '';
    letterInput.focus();
    
    if (!input || !/^[A-Z]$/.test(input)) return;
    if (guessedLetters.includes(input) || wrongLetters.includes(input)) return;
    
    launchAnimation(input);
}

function launchAnimation(letter) {
    // Create flying capsule
    const capsule = document.createElement('div');
    capsule.className = 'capsule-anim';
    capsule.textContent = letter;
    
    const inputRect = letterInput.getBoundingClientRect();
    capsule.style.left = `${inputRect.left}px`;
    capsule.style.top = `${inputRect.top}px`;
    
    document.body.appendChild(capsule);
    
    // Disable input during animation
    letterInput.disabled = true;
    launchBtn.disabled = true;
    
    // Determine path
    const isCorrect = currentWord.includes(letter);
    
    // Allow DOM to render the capsule before setting transform
    requestAnimationFrame(() => {
        if (isCorrect) {
            guessedLetters.push(letter);
            // Find first slot
            const slots = document.querySelectorAll('.letter-slot');
            let targetSlot = null;
            slots.forEach(slot => {
                if (slot.dataset.letter === letter && !targetSlot) {
                    targetSlot = slot;
                }
            });
            
            if (targetSlot) {
                const targetRect = targetSlot.getBoundingClientRect();
                const deltaX = targetRect.left - inputRect.left + (targetRect.width - 80) / 2;
                const deltaY = targetRect.top - inputRect.top + (targetRect.height - 80) / 2;
                
                capsule.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.6)`;
                capsule.style.borderColor = 'var(--neon-pink)';
                capsule.style.color = 'var(--neon-pink)';
                capsule.style.boxShadow = '0 0 20px var(--neon-pink)';
            }
        } else {
            wrongLetters.push(letter);
            // Random space debris coordinate
            const randomX = (Math.random() - 0.5) * window.innerWidth * 0.8;
            const randomY = -window.innerHeight * 0.5 - (Math.random() * 100);
            
            capsule.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 360}deg)`;
            capsule.style.borderColor = 'var(--wrong-red)';
            capsule.style.color = 'var(--wrong-red)';
            capsule.style.opacity = '0.5';
        }
        
        // Wait for animation
        setTimeout(() => {
            document.body.removeChild(capsule);
            processGuessResult(letter, isCorrect);
        }, 800);
    });
}

function processGuessResult(letter, isCorrect) {
    if (isCorrect) {
        const slots = document.querySelectorAll('.letter-slot');
        slots.forEach(slot => {
            if (slot.dataset.letter === letter) {
                slot.textContent = letter;
                slot.classList.add('filled');
            }
        });
    } else {
        updateLifeSupport();
        
        // Add to debris visually
        const debris = document.createElement('div');
        debris.className = 'debris-letter';
        debris.textContent = letter;
        debris.style.left = `${Math.random() * 80 + 10}%`;
        debris.style.top = `${Math.random() * 40 + 10}%`;
        
        // Animate drifting
        debris.animate([
            { transform: 'translate(0, 0) rotate(0deg)' },
            { transform: `translate(${(Math.random() - 0.5) * 300}px, ${(Math.random() - 0.5) * 300}px) rotate(${Math.random() * 360}deg)` }
        ], {
            duration: 10000 + Math.random() * 10000,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out'
        });
        
        spaceDebris.appendChild(debris);
    }
    
    checkWinLoss();
}

function checkWinLoss() {
    let hasWon = true;
    for (let char of currentWord) {
        if (!guessedLetters.includes(char)) {
            hasWon = false;
            break;
        }
    }
    
    if (hasWon) {
        endGame(true);
    } else if (wrongLetters.length >= maxGuesses) {
        endGame(false);
    } else {
        letterInput.disabled = false;
        launchBtn.disabled = false;
        letterInput.focus();
    }
}

function endGame(isWin) {
    statusMessage.classList.remove('hidden');
    if (isWin) {
        statusTitle.textContent = "MISSION ACCOMPLISHED!";
        statusTitle.style.color = 'var(--neon-blue)';
        statusTitle.style.textShadow = '0 0 15px var(--neon-blue)';
        statusMessage.style.borderColor = 'var(--neon-blue)';
        statusMessage.style.boxShadow = '0 0 50px rgba(0, 243, 255, 0.4)';
    } else {
        statusTitle.textContent = "CRITICAL FAILURE!";
        statusTitle.style.color = 'var(--wrong-red)';
        statusTitle.style.textShadow = '0 0 15px var(--wrong-red)';
        statusMessage.style.borderColor = 'var(--wrong-red)';
        statusMessage.style.boxShadow = '0 0 50px rgba(255, 51, 102, 0.4)';
        
        // Reveal word
        const slots = document.querySelectorAll('.letter-slot');
        slots.forEach(slot => {
            if (!guessedLetters.includes(slot.dataset.letter)) {
                slot.textContent = slot.dataset.letter;
                slot.style.color = 'var(--wrong-red)';
                slot.style.textShadow = 'none';
                slot.style.borderColor = 'var(--wrong-red)';
                slot.style.animation = 'none';
            }
        });
    }
    letterInput.disabled = true;
    launchBtn.disabled = true;
}

// Event Listeners
launchBtn.addEventListener('click', handleGuess);
letterInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleGuess();
});
reorbitBtn.addEventListener('click', initGame);

// Start
createStarfield();
initGame();
