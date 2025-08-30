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

  function iniciarJuego(dificultad) {
    if(!dificultad) return; // evita iniciar sin dificultad
    let emojis = [];
    if (dificultad === "facil") {
      emojis = ['🍎','🍌','🍇','🍉'];
    } else if (dificultad === "medio") {
      emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🍍','🥝'];
    } else if (dificultad === "dificil") {
      emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🍍','🥝','🥥','🥭','🍑','🍐'];
    }

    // Reiniciar tablero
    board.innerHTML = "";
    score = 0;
    paresRestantes = emojis.length;
    scoreElement.textContent = score;
    paresElement.textContent = paresRestantes;

    const cards = [...emojis, ...emojis];
    cards.sort(() => Math.random() - 0.5);

    cards.forEach(symbol => {
      const card = template.content.firstElementChild.cloneNode(true);
      card.querySelector('.card-front').textContent = symbol;
      card.addEventListener('click', () => flipCard(card));
      board.appendChild(card);
    });

    document.getElementById("menu-dificultad").style.display = "none";
    seconds = 0;
    if(timerInterval) clearInterval(timerInterval);
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
      setTimeout(() => resetCards(false), 1000);
    }

    scoreElement.textContent = score;
    paresElement.textContent = paresRestantes;

    if (paresRestantes === 0) {
      clearInterval(timerInterval);
      mostrarVictoria();
    }
  }

  function resetCards(match) {
    if (!match) {
      firstCard.classList.remove('is-flipped');
      secondCard.classList.remove('is-flipped');
    }
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  // ===== BOTONES DE DIFICULTAD =====
  const botones = document.querySelectorAll(".btn-dif");
  const menudif = document.getElementById('menu-dificultad');
  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      difactual = btn.dataset.dif;
      iniciarJuego(difactual);
    });
  });

  // Mostrar menú de dificultad
  document.getElementById('btnDificultad').addEventListener("click", () => {
    menudif.style.display = "flex";
  });

  // Reiniciar juego
  document.getElementById('btnReiniciar').addEventListener("click", () => {
    iniciarJuego(difactual);
  });

  // Salir
  document.getElementById('btnSalir').addEventListener("click", () => {
    if(timerInterval) clearInterval(timerInterval);
    reiniciarJuego();
    menudif.style.display = "flex";
  });

  function reiniciarJuego() {
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
  }

  // ===== MODAL DE VICTORIA =====
  const victoryModal = document.getElementById("victoryModal");
  const victoryScore = document.getElementById("victoryScore");
  const victoryTime = document.getElementById("victoryTime");
  const btnPlayAgain = document.getElementById("btnPlayAgain");
  const btnSalirVictory = document.getElementById("btnSalirVictory");

  function mostrarVictoria() {
    victoryScore.textContent = `Puntaje: ${score}`;
    const minutos = Math.floor(seconds / 60);
    const segs = seconds % 60;
    victoryTime.textContent = `Tiempo: ${String(minutos).padStart(2,"0")}:${String(segs).padStart(2,"0")}`;
    victoryModal.style.display = "flex";
  }

  // Volver a jugar → abre menú de dificultad
  btnPlayAgain.addEventListener("click", () => {
    victoryModal.style.display = "none";
    menudif.style.display = "flex"; 
  });

  // Salir desde modal victoria
  btnSalirVictory.addEventListener("click", () => {
    victoryModal.style.display = "none";
    reiniciarJuego();
    menudif.style.display = "flex";
  });

});
