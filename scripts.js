// Tablero y plantilla
const board = document.getElementById('board');
const template = document.getElementById('card-template');

// Emojis del juego
const emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🍍','🥝'];

// Duplicamos el array para formar pares
const cardsArray = [...emojis, ...emojis];

// Barajamos (shuffle)
cardsArray.sort(() => Math.random() - 0.5);

// Generamos las cartas
cardsArray.forEach(symbol => {
  const card = template.content.firstElementChild.cloneNode(true);
  card.querySelector('.card-front').textContent = symbol;

  card.addEventListener('click', () => {
    card.classList.toggle('is-flipped');
  });

  board.appendChild(card);
});

