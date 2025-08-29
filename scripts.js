// TIMER
let seconds = 0;
const timerElement = document.getElementById('contador');

function updateTimer() {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  timerElement.textContent = `${minutes}:${secs}`;
  seconds++;
}

setInterval(updateTimer, 1000);

// MEMORICE
const board = document.getElementById('board');
const template = document.getElementById('card-template');
const scoreElement = document.getElementById('score');
const paresElement = document.getElementById('pares');

let score = 0;
let paresRestantes = 8;

// Emojis duplicados
const emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🍍','🥝'];
const cards = [...emojis, ...emojis];

// Mezclar
cards.sort(() => Math.random() - 0.5);

// Crear cartas
cards.forEach(symbol => {
  const card = template.content.firstElementChild.cloneNode(true);
  card.querySelector('.card-front').textContent = symbol;
  card.addEventListener('click', () => {
    card.classList.toggle('is-flipped');
  });
  board.appendChild(card);
});
