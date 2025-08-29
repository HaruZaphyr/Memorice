document.addEventListener('DOMContentLoaded', () => {
  // ===== TIMER =====
  let seconds = 0;
  const timerElement = document.getElementById('contador');

  function updateTimer() {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    timerElement.textContent = `${minutes}:${secs}`;
    seconds++;
  }

  setInterval(updateTimer, 1000);

  // ===== MEMORICE =====
  const board = document.getElementById('board');
  const template = document.getElementById('card-template');
  const scoreElement = document.getElementById('score');
  const paresElement = document.getElementById('pares');

  let score = 0;
  let paresRestantes = 8;

  paresElement.textContent = paresRestantes;
  scoreElement.textContent = score;

  const emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🍍','🥝'];
  const cards = [...emojis, ...emojis];
  cards.sort(() => Math.random() - 0.5);

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;

  function flipCard(card) {
    if (lockBoard || card.classList.contains('is-flipped')) return;

    card.classList.add('is-flipped');

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    lockBoard = true; // bloqueamos tablero inmediatamente

    const firstSymbol = firstCard.querySelector('.card-front').textContent;
    const secondSymbol = secondCard.querySelector('.card-front').textContent;

    if (firstSymbol === secondSymbol) {
      // Pareja encontrada
      score += 10;
      paresRestantes--;
      resetCards(true);
    } else {
      // No coinciden: voltear después de 1s
      setTimeout(() => resetCards(false), 1000);
    }

    scoreElement.textContent = score;
    paresElement.textContent = paresRestantes;
  }

  function resetCards(match) {
    if (!match) {
      firstCard.classList.remove('is-flipped');
      secondCard.classList.remove('is-flipped');
    }
    firstCard = null;
    secondCard = null;
    lockBoard = false; // desbloqueamos tablero después de procesar
  }

  // Crear cartas
  cards.forEach(symbol => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.querySelector('.card-front').textContent = symbol;
    card.addEventListener('click', () => flipCard(card));
    board.appendChild(card);
  });
});

