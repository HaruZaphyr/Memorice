document.addEventListener('DOMContentLoaded', () => {
  // ===== VARIABLES GLOBALES =====
  let difactual = null;
  let score = 0;
  let paresRestantes = 0;
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;

  let timeLeft = 60; // tiempo restante
  let scorePenalty = 0;
  let shuffleOnFail = false;
  let timerInterval = null;

  // ===== ELEMENTOS DOM =====
  const timerElement = document.getElementById('contador');
  const board = document.getElementById('board');
  const template = document.getElementById('card-template');
  const scoreElement = document.getElementById('score');
  const paresElement = document.getElementById('pares');
  const menudif = document.getElementById('menu-dificultad');

  const victoryModal = document.getElementById("victoryModal");
  const victoryScore = document.getElementById("victoryScore");
  const victoryTime = document.getElementById("victoryTime");
  const btnPlayAgain = document.getElementById("btnPlayAgain");
  const btnSalirVictory = document.getElementById("btnSalirVictory");

  // ===== FUNCIONES =====

  function actualizarTimer() {
    const minutos = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const segundos = String(timeLeft % 60).padStart(2, '0');
    timerElement.textContent = `${minutos}:${segundos}`;
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        mostrarDerrota();
        return;
      }
      timeLeft--;
      actualizarTimer();
    }, 1000);
  }

  function iniciarJuego(dificultad) {
    difactual = dificultad;
    // Configuración por dificultad
    if (dificultad === "facil") {
      timeLeft = 60;
      scorePenalty = 0;
      shuffleOnFail = false;
    } else if (dificultad === "medio") {
      timeLeft = 90;
      scorePenalty = 5;
      shuffleOnFail = false;
    } else if (dificultad === "dificil") {
      timeLeft = 120;
      scorePenalty = 10;
      shuffleOnFail = true;
    }

    // Reiniciar juego
    let emojis = [];
    if (dificultad === "facil") emojis = ['🍎','🍌','🍇','🍉'];
    if (dificultad === "medio") emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🍍','🥝'];
    if (dificultad === "dificil") emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🍍','🥝','🥥','🥭','🍑','🍐'];

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

    menudif.style.display = "none";
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    clearInterval(timerInterval);
    actualizarTimer();
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

      // Penalización por fallo
      timeLeft -= 5;
      if (timeLeft < 0) timeLeft = 0;

      score -= scorePenalty;
      if (score < 0) score = 0;

      scoreElement.textContent = score;
      actualizarTimer();

      // Reordenar cartas si es difícil
      if (shuffleOnFail) {
        const cards = Array.from(board.children);
        cards.sort(() => Math.random() - 0.5);
        board.innerHTML = "";
        cards.forEach(c => board.appendChild(c));
      }
    }
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  function mostrarVictoria() {
    victoryScore.textContent = `Puntaje: ${score}`;
    const minutos = Math.floor((difactual === "facil" ? 60 - timeLeft : timeLeft) / 60);
    const segs = (difactual === "facil" ? 60 - timeLeft : timeLeft) % 60;
    victoryTime.textContent = `Tiempo: ${String(minutos).padStart(2,"0")}:${String(segs).padStart(2,"0")}`;
    victoryModal.style.display = "flex";
  }

  function mostrarDerrota() {
    alert("¡Se terminó el tiempo! Intenta de nuevo.");
    menudif.style.display = "flex";
  }

  // ===== EVENTOS =====
  document.querySelectorAll(".btn-dif").forEach(btn => {
    btn.addEventListener("click", () => iniciarJuego(btn.dataset.dif));
  });

  document.getElementById('btnReiniciar').addEventListener("click", () => {
    if(difactual) iniciarJuego(difactual);
  });

  document.getElementById('btnDificultad').addEventListener("click", () => {
    menudif.style.display = "flex";
  });

  document.getElementById('btnSalir').addEventListener("click", () => {
    clearInterval(timerInterval);
    board.innerHTML = "";
    score = 0;
    paresRestantes = 0;
    timeLeft = 60;
    actualizarTimer();
    menudif.style.display = "flex";
    firstCard = secondCard = null;
    lockBoard = false;
  });

  // Modal victoria
  btnPlayAgain.addEventListener("click", () => {
    victoryModal.style.display = "none";
    menudif.style.display = "flex";
  });

  btnSalirVictory.addEventListener("click", () => {
    victoryModal.style.display = "none";
    clearInterval(timerInterval);
    board.innerHTML = "";
    score = 0;
    paresRestantes = 0;
    timeLeft = 60;
    actualizarTimer();
    menudif.style.display = "flex";
    firstCard = secondCard = null;
    lockBoard = false;
  });

});


/*document.addEventListener('DOMContentLoaded', () => {
  let difactual = null;
  let seconds = 0;
  let timerInterval = null;
  const timerElement = document.getElementById('contador');
  const board = document.getElementById('board');
  const template = document.getElementById('card-template');
  const scoreElement = document.getElementById('score');
  const paresElement = document.getElementById('pares');
  const menudif = document.getElementById('menu-dificultad');

  const victoryModal = document.getElementById("victoryModal");
  const victoryScore = document.getElementById("victoryScore");
  const victoryTime = document.getElementById("victoryTime");
  const btnPlayAgain = document.getElementById("btnPlayAgain"); 
  const btnSalirVictory = document.getElementById("btnSalirVictory");

  let score = 0;
  let paresRestantes = 0;
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;

  function startTimer() {
    timerInterval = setInterval(() => {
      const min = String(Math.floor(seconds / 60)).padStart(2, '0');
      const sec = String(seconds % 60).padStart(2, '0');
      timerElement.textContent = `${min}:${sec}`;
      seconds++;
    }, 1000);
  }

  function reiniciarJuego() {
    if (timerInterval) clearInterval(timerInterval);
    board.innerHTML = "";
    score = 0;
    paresRestantes = 0;
    seconds = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    scoreElement.textContent = score;
    paresElement.textContent = paresRestantes;
    timerElement.textContent = "00:00";
  }

  function iniciarJuego(dificultad) {
    if(!dificultad) return;
    let emojis = [];
    if(dificultad==="facil") emojis = ['🍎','🍌','🍇','🍉'];
    else if(dificultad==="medio") emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🍍','🥝'];
    else emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🍍','🥝','🥥','🥭','🍑','🍐'];

    board.innerHTML = "";
    score = 0;
    paresRestantes = emojis.length;
    scoreElement.textContent = score;
    paresElement.textContent = paresRestantes;

    const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

    cards.forEach(sym => {
      const card = template.content.firstElementChild.cloneNode(true);
      card.querySelector('.card-front').textContent = sym;
      card.addEventListener('click', () => flipCard(card));
      board.appendChild(card);
    });

    menudif.style.display = "none";
    seconds = 0;
    if(timerInterval) clearInterval(timerInterval);
    startTimer();
  }

  function flipCard(card) {
    if(lockBoard || card.classList.contains('is-flipped')) return;

    card.classList.add('is-flipped');
    if(!firstCard){ firstCard = card; return; }

    secondCard = card;
    lockBoard = true;

    const firstSym = firstCard.querySelector('.card-front').textContent;
    const secondSym = secondCard.querySelector('.card-front').textContent;

    if(firstSym === secondSym){
      score += 10;
      paresRestantes--;
      resetCards(true);
    } else {
      setTimeout(()=> resetCards(false), 1000);
    }

    scoreElement.textContent = score;
    paresElement.textContent = paresRestantes;

    if(paresRestantes===0){
      clearInterval(timerInterval);
      mostrarVictoria();
    }
  }

  function resetCards(match){
    if(!match){
      firstCard.classList.remove('is-flipped');
      secondCard.classList.remove('is-flipped');
    }
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  // BOTONES
  document.querySelectorAll(".btn-dif").forEach(btn=>{
    btn.addEventListener("click", ()=> {
      difactual = btn.dataset.dif;
      iniciarJuego(difactual);
    });
  });

  document.getElementById('btnDificultad').addEventListener("click", ()=> menudif.style.display="flex");
  document.getElementById('btnReiniciar').addEventListener("click", ()=> iniciarJuego(difactual));
  document.getElementById('btnSalir').addEventListener("click", ()=>{
    reiniciarJuego();
    menudif.style.display = "flex";
  });

  // MODAL DE VICTORIA
  function mostrarVictoria(){
    victoryScore.textContent = `Puntaje: ${score}`;
    const min = Math.floor(seconds/60);
    const sec = seconds%60;
    victoryTime.textContent = `Tiempo: ${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    victoryModal.style.display = "flex";
  }

  btnPlayAgain.addEventListener("click", ()=>{
    victoryModal.style.display = "none";
    menudif.style.display = "flex"; // abrir menú para nueva partida
  });

  btnSalirVictory.addEventListener("click", ()=>{
    victoryModal.style.display = "none";
    reiniciarJuego();
    pantallainicial.style.display = "flex";
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
*/
