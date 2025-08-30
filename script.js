document.addEventListener('DOMContentLoaded', () => {
  // ===== TIMER =====
  let difactual = null;
  let seconds = 0;
  const timerElement = document.getElementById('contador');
  let timerInterval = null;

  function startTimer() {
    timerInterval = setInterval(() => {
      const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
      const secs = String(seconds % 60).padStart(2, '0');
      timerElement.textContent = `${minutes}:${secs}`;
      seconds++;
    }, 1000);
  }

  // ===== MEMORICE =====
  const board = document.getElementById('board');
  const template = document.getElementById('card-template');
  const scoreElement = document.getElementById('score');
  const paresElement = document.getElementById('pares');

  let score = 0;
  let paresRestantes = 0;

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;

  let flipTimeout = 1000;
  let penalizacionFallos = 0;

  function iniciarJuego(dificultad) {
    let emojis = [];
    if (dificultad === "facil") {
      emojis = ['🍎','🍌','🍇','🍉'];
      flipTimeout = 1000;
      penalizacionFallos = 0;
    } else if (dificultad === "medio") {
      emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🍍','🥝'];
      flipTimeout = 800;
      penalizacionFallos = 0;
    } else if (dificultad === "dificil") {
      emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🍍','🥝','🥥','🥭','🍑','🍐'];
      flipTimeout = 500;
      penalizacionFallos = 5;
    }

    // Reiniciar tablero
    board.innerHTML = "";
    score = 0;
    paresRestantes = emojis.length;
    scoreElement.textContent = score;
    paresElement.textContent = paresRestantes;

    const cards = [...emojis, ...emojis];
    cards.sort(() => Math.random() - 0.5);

    // Renderizar cartas
    cards.forEach(symbol => {
      const card = template.content.firstElementChild.cloneNode(true);
      card.querySelector('.card-front').textContent = symbol;
      card.addEventListener('click', () => flipCard(card));
      board.appendChild(card);
    });

    document.getElementById("menu-dificultad").style.display = "none";
    seconds = 0;
    if (timerInterval) clearInterval(timerInterval);
    startTimer();
  }

  function flipCard(card) {
    if (lockBoard || card.classList.contains('is-flipped')) return;

    card.classList.add('is-flipped');

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    lockBoard = true;

    const firstSymbol = firstCard.querySelector('.card-front').textContent;
    const secondSymbol = secondCard.querySelector('.card-front').textContent;

    if (firstSymbol === secondSymbol) {
      score += 10;
      paresRestantes--;
      resetCards(true);
    } else {
      setTimeout(() => resetCards(false), flipTimeout);
    }

    scoreElement.textContent = score;
    paresElement.textContent = paresRestantes;

    // Condición de victoria
    if (paresRestantes === 0) {
      clearInterval(timerInterval);
      mostrarVictoria();
    }
  }

  function resetCards(match) {
    if (!match) {
      firstCard.classList.remove('is-flipped');
      secondCard.classList.remove('is-flipped');

      // Mezclar cartas visibles en medio/difícil
      if (difactual === "medio" || difactual === "dificil") {
        const cardsArray = Array.from(board.children);
        cardsArray.sort(() => Math.random() - 0.5);
        board.innerHTML = '';
        cardsArray.forEach(c => board.appendChild(c));
      }

      // Penalización en difícil
      if (difactual === "dificil") {
        score = Math.max(0, score - penalizacionFallos);
        scoreElement.textContent = score;
      }
    }

    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  const botones = document.querySelectorAll(".btn-dif");
  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const dificultad = btn.dataset.dif;
      difactual = dificultad;
      iniciarJuego(dificultad);
    });
  });

  const btnreset = document.getElementById('btnReiniciar');
  btnreset.addEventListener("click", () => {
    iniciarJuego(difactual);
  });

  const menudif = document.getElementById('menu-dificultad');
  const btndif = document.getElementById('btnDificultad');
  btndif.addEventListener("click", () => {
    menudif.style.display = "flex";
  });

  const btnsalir = document.getElementById('btnSalir');
  btnsalir.addEventListener("click", () => {
    if(timerInterval) clearInterval(timerInterval);

    board.innerHTML = "";
    scoreElement.textContent = 0;
    paresElement.textContent = 0;
    timerElement.textContent = "00:00";

    menudif.style.display = "flex";

    score = 0;
    paresRestantes = 0;
    seconds = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  });
});

// Modal de victoria
const victoryModal = document.getElementById("victoryModal");
const victoryScore = document.getElementById("victoryScore");
const victoryTime = document.getElementById("victoryTime");

function mostrarVictoria() {
  victoryScore.textContent = `Puntaje: ${score}`;
  let minutos = Math.floor(seconds / 60);
  let segs = seconds % 60;
  victoryTime.textContent = `Tiempo: ${String(minutos).padStart(2,"0")}:${String(segs).padStart(2,"0")}`;
  victoryModal.style.display = "flex";
}

document.getElementById("playAgain").addEventListener("click", () => {
  victoryModal.style.display = "none";
  document.getElementById("menu-dificultad").style.display = "flex"; // mostrar selección de dificultad
});

document.getElementById("goMenu").addEventListener("click", () => {
  victoryModal.style.display = "none";
  const menudif = document.getElementById('menu-dificultad');
  menudif.style.display = "flex";

  if(timerInterval) clearInterval(timerInterval);
  board.innerHTML = "";
  scoreElement.textContent = 0;
  paresElement.textContent = 0;
  timerElement.textContent = "00:00";

  score = 0;
  paresRestantes = 0;
  seconds = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
});

