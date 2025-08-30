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
    let flipTimeout = 1000;   // tiempo para voltear de nuevo
    let penalizacionFallos = 0; // puntos a restar si falla
    let emojis = [];
    
   if(dificultad === "facil") {
      emojis = ['🍎','🍌','🍇','🍉'];
      flipTimeout = 1000;
      penalizacionFallos = 0;
    } else if(dificultad === "medio") {
      emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🍍','🥝'];
      flipTimeout = 800;
      penalizacionFallos = 0;
    } else if(dificultad === "dificil") {
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

    if(firstSymbol !== secondSymbol) {
      setTimeout(() => resetCards(false), flipTimeout);
    } else {
      resetCards(true);
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
    if(!match) {
      firstCard.classList.remove('is-flipped');
      secondCard.classList.remove('is-flipped');
    
      // Mezclar cartas visibles (medio y difícil)
      if(paresRestantes > 0 && (difactual === 'medio' || difactual === 'dificil')){
        let cardsArray = Array.from(board.children);
        cardsArray.sort(() => Math.random() - 0.5);
        board.innerHTML = '';
        cardsArray.forEach(c => board.appendChild(c));
      }
    
      // Restar puntos en difícil
      if(difactual === 'dificil') {
        score = Math.max(0, score - penalizacionFallos);
        scoreElement.textContent = score;
      }
    }
  }

  // Botones de dificultad
  const botones = document.querySelectorAll(".btn-dif");
  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const dificultad = btn.dataset.dif;
      difactual = dificultad;
      iniciarJuego(dificultad);
    });
  });

  // Botón reiniciar
  document.getElementById('btnReiniciar').addEventListener("click", () => {
    iniciarJuego(difactual);
  });

  // Botón mostrar menú dificultad
  const menudif = document.getElementById('menu-dificultad');
  document.getElementById('btnDificultad').addEventListener("click", () => {
    menudif.style.display = "flex";
  });

  // Botón salir
  document.getElementById('btnSalir').addEventListener("click", () => {
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

    menudif.style.display = "flex";
  });

});
