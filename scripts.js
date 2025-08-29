// ====== TIMER ======
let seconds = 0;
const timerElement = document.getElementById('timer');

function updateTimer() {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  timerElement.textContent = `${minutes}:${secs}`; 
  seconds++;
}

setInterval(updateTimer, 1000);

// ====== MEMORIZE ======
const board = document.getElementById('board');
const template = document.getElementById('card-template');

// Pares de emojis (duplicados)
const emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🍍','🥝'];
const cards = [...emojis, ...emojis];

// Mezclar array (shuffle)
cards.sort(() => 0.5 - Math.random());

// Crear las cartas en el tablero
cards.forEach(symbol => {
  const card = template.content.firstElementChild.cloneNode(true);
  card.querySelector('.card-front').textContent = symbol;
  card.addEventListener('click', () => {
    card.classList.toggle('is-flipped');
  });
  board.appendChild(card);
});
