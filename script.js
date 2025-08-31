document.addEventListener('DOMContentLoaded', () => {
  let difactual = null;
  let seconds = 0;
  let timerInterval = null;

  // ELEMENTOS DOM
  const timerElement = document.getElementById('contador');
  const board = document.getElementById('board');
  const template = document.getElementById('card-template');
  const scoreElement = document.getElementById('score');
  const paresElement = document.getElementById('pares');
  const menudif = document.getElementById('menu-dificultad');
  const pantallainicial = document.getElementById("pantalla-inicial");
  const btnPlay = document.getElementById("btnPlay");
  const victoryModal = document.getElementById("victoryModal");
  const victoryScore = document.getElementById("victoryScore");
  const victoryTime = document.getElementById("victoryTime");
  const btnPlayAgain = document.getElementById("btnPlayAgain");
  const btnSalirVictory = document.getElementById("btnSalirVictory");
  const btnsalir = document.getElementById('btnSalir');

  // VARIABLES JUEGO
  let score = 0;
  let paresRestantes = 0;
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;

  // TIMER
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

  // INICIAR JUEGO
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

  // LÓGICA CARTAS
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
      // Penalización según dificultad
      if(difactual === "medio" || difactual === "dificil") {
        score = Math.max(0, score - 2);
      }

      // Reordenar cartas al fallar si es difícil
      if(difactual === "dificil") {
        setTimeout(() => {
          const cardsArray = Array.from(board.children);
          cardsArray.forEach(c => board.removeChild(c));
          cardsArray.sort(() => Math.random() - 0.5)
                    .forEach(c => board.appendChild(c));
        }, 1000);
      }

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

  // MENÚ DIFICULTAD
  document.querySelectorAll(".btn-dif").forEach(btn=>{
    btn.addEventListener("click", ()=> {
      difactual = btn.dataset.dif;
      iniciarJuego(difactual);
    });
  });

  document.getElementById('btnDificultad').addEventListener("click", ()=> menudif.style.display="flex");
  document.getElementById('btnReiniciar').addEventListener("click", ()=> iniciarJuego(difactual));
  btnsalir.addEventListener("click", ()=>{
    if(timerInterval) clearInterval(timerInterval);
    reiniciarJuego();
    pantallainicial.style.display = "flex";
    menudif.style.display = "none";
  });

  // MODAL VICTORIA
  function mostrarVictoria(){
    victoryScore.textContent = `Puntaje: ${score}`;
    const min = Math.floor(seconds/60);
    const sec = seconds%60;
    victoryTime.textContent = `Tiempo: ${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    victoryModal.style.display = "flex";
  }

  btnPlayAgain.addEventListener("click", ()=>{
    victoryModal.style.display = "none";
    menudif.style.display = "flex";
  });

  btnSalirVictory.addEventListener("click", ()=>{
    victoryModal.style.display = "none";
    reiniciarJuego();
    pantallainicial.style.display = "flex";
  });

  // BOTÓN PLAY INICIAL
  btnPlay.addEventListener("click", ()=>{
    pantallainicial.style.display = "none";
    menudif.style.display = "flex";
  });
});
