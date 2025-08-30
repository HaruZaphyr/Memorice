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

  function iniciarJuego(dificultad) { //Dependiendo de la dificultad se agregan mas o menos pares lowkey
    let emojis = [];
    if (dificultad === "facil") {
      emojis = ['🍎','🍌','🍇','🍉'];         // 4 pares
    } else if (dificultad === "medio") {
      emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🍍','🥝']; // 8 pares
    } else if (dificultad === "dificil") {
      emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🍍','🥝','🥥','🥭','🍑','🍐']; // 12 pares
    }

    // Reiniciar tablero
    board.innerHTML = "";
    score = 0;
    paresRestantes = emojis.length;
    scoreElement.textContent = score;
    paresElement.textContent = paresRestantes;

    const cards = [...emojis, ...emojis]; //crea los pares de cartas
    cards.sort(() => Math.random() - 0.5);

    // Renderizar cartas
    cards.forEach(symbol => {
      const card = template.content.firstElementChild.cloneNode(true);
      card.querySelector('.card-front').textContent = symbol;
      card.addEventListener('click', () => flipCard(card));
      board.appendChild(card);
    });

    document.getElementById("menu-dificultad").style.display = "none"; //oculta el menu y inicia el timer
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
    lockBoard = false;
  }

  const botones = document.querySelectorAll(".btn-dif"); //Escucha que boton elegiste
  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const dificultad = btn.dataset.dif;
      difactual = dificultad;
      iniciarJuego(dificultad);
    });
  });

  const btnreset = document.getElementById('btnReiniciar');
  btnreset.addEventListener("click", () =>{
    iniciarJuego(difactual);
  });
  
  const menudif = document.getElementById('menu-dificultad');
  const btndif = document.getElementById('btnDificultad');
  btndif.addEventListener("click", () =>{
    menudif.style.display = "flex";
  });

  const btnsalir = document.getElementById('btnSalir');
  btnsalir.addEventListener("click", () =>{
    if(timerInterval) clearInterval(timerInterval);

    board.innerHTML = "";
    scoreElement.textContent = 0;
    paresElement.textContent = 0;
    timerElement.textContent = "00:00";

    pantallainicial.style.display = "flex";

    score = 0;
    paresRestantes = 0;
    seconds = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  });
  const pantallainicial = document.getElementById("pantalla-inicial");
  const btnPlay = document.getElementById("btnPlay");

  btnPlay.addEventListener("click", () =>{
    pantallainicial.style.display = "none";
    menudif.style.display = "flex";
  });
});