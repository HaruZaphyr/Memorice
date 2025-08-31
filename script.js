document.addEventListener('DOMContentLoaded', () => {
  let difactual = null;
  let timeLeft = 0;   // tiempo restante
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

  // Modales
  const victoryModal = document.getElementById("victoryModal"); 
  const victoryScore = document.getElementById("victoryScore");
  const victoryTime = document.getElementById("victoryTime");
  const btnPlayAgain = document.getElementById("btnPlayAgain");
  const btnSalirVictory = document.getElementById("btnSalirVictory");

  const defeatModal = document.getElementById("defeatModal");
  const defeatScore = document.getElementById("defeatScore");
  console.log("defeatScore:", defeatScore);
  const btnReintentar = document.getElementById("btnReintentar");
  const btnSalirDefeat = document.getElementById("btnSalirDefeat");

  const btnsalir = document.getElementById('btnSalir');

  // VARIABLES JUEGO
  let score = 1500;
  let paresRestantes = 0;
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;

  // TIMER
  function startTimer() {
    actualizarTimer();
    timerInterval = setInterval(() => {
      timeLeft--;
      actualizarTimer();

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        mostrarDerrota();
      }
    }, 1000);
  }

  function actualizarTimer() {
    const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const sec = String(timeLeft % 60).padStart(2, '0');
    timerElement.textContent = `${min}:${sec}`;
  }

  function reiniciarJuego() {
    if (timerInterval) clearInterval(timerInterval);
    board.innerHTML = "";
    score = 0;
    paresRestantes = 0;
    timeLeft = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    scoreElement.textContent = score;
    paresElement.textContent = paresRestantes;
    timerElement.textContent = "00:00";
  }

  // INICIAR JUEGO
  function iniciarJuego(dificultad) {
    if (!dificultad) return;

    // tiempo inicial por dificultad
    if (dificultad === "facil") timeLeft = 240;
    else if (dificultad === "medio") timeLeft = 120;
    else if (dificultad === "dificil") timeLeft = 60;

    let emojis = [];
    if (dificultad === "facil") emojis = ['🍎','🍌','🍇','🍉'];
    else if (dificultad === "medio") emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🍍','🥝'];
    else emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🍍','🥝','🥥','🥭','🍑','🍐'];

    board.innerHTML = "";
    score = 0;
    paresRestantes = emojis.length;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    scoreElement.textContent = score;
    paresElement.textContent = paresRestantes;

    const cardsSymbols = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

    cardsSymbols.forEach(sym => {
      const card = template.content.firstElementChild.cloneNode(true);
      const front = card.querySelector('.card-front');
      front.textContent = sym;

      card.classList.remove('is-flipped', 'matched');
      card.addEventListener('click', () => flipCard(card));
      board.appendChild(card);
    });

    menudif.style.display = "none";
    pantallainicial.style.display = "none";

    if (timerInterval) clearInterval(timerInterval);
    startTimer();
  }

  // LÓGICA CARTAS
  function flipCard(card) {
    if (lockBoard || card.classList.contains('is-flipped') || card.classList.contains('matched')) return;

    card.classList.add('is-flipped');
    if (!firstCard) { firstCard = card; return; }

    secondCard = card;
    lockBoard = true;

    const firstSym = firstCard.querySelector('.card-front').textContent;
    const secondSym = secondCard.querySelector('.card-front').textContent;

    if (firstSym === secondSym) {
      score += 125;
      paresRestantes--;

      firstCard.classList.add('matched');
      secondCard.classList.add('matched');

      resetCards(true);
    } else {
      // Penalizaciones según dificultad
      if (difactual === "medio" || difactual === "dificil") {
        score = Math.max(0, score - 20);
        timeLeft = Math.max(0, timeLeft - 5); // penaliza 5 seg
        actualizarTimer();
      }

      setTimeout(() => {
        firstCard.classList.remove('is-flipped');
        secondCard.classList.remove('is-flipped');

        if (difactual === "dificil") {
          // Reordenar solo cartas no acertadas
          const cardsToShuffle = Array.from(board.children)
            .filter(c => !c.classList.contains('matched'));

          const emojisToShuffle = cardsToShuffle
            .map(c => c.querySelector('.card-front').textContent)
            .sort(() => Math.random() - 0.5);

          cardsToShuffle.forEach((c, i) => {
            c.querySelector('.card-front').textContent = emojisToShuffle[i];
          });
        }

        firstCard = null;
        secondCard = null;
        lockBoard = false;
      }, 1000);
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

  // MENÚ DIFICULTAD
  document.querySelectorAll(".btn-dif").forEach(btn => {
    btn.addEventListener("click", () => {
      difactual = btn.dataset.dif;
      iniciarJuego(difactual);
    });
  });

  document.getElementById('btnDificultad').addEventListener("click", () => menudif.style.display = "flex");
  document.getElementById('btnReiniciar').addEventListener("click", () => iniciarJuego(difactual));
  btnsalir.addEventListener("click", () => {
    if (timerInterval) clearInterval(timerInterval);
    reiniciarJuego();
    pantallainicial.style.display = "flex";
    menudif.style.display = "none";
  });

  function mostrarVictoria() {
  guardarPuntaje(score);
  victoryScore.textContent = `Puntaje: ${score}`;
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  victoryTime.textContent = `Tiempo restante: ${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  victoryModal.style.display = "flex";
}

function mostrarDerrota() {
  guardarPuntaje(score);
  defeatScore.textContent = `Puntaje: ${score}`;
  defeatModal.style.display = "flex";
}

  // Eventos modales
  btnPlayAgain.addEventListener("click", () => {
    victoryModal.style.display = "none";
    menudif.style.display = "flex";
  });

  btnSalirVictory.addEventListener("click", () => {
    victoryModal.style.display = "none";
    reiniciarJuego();
    pantallainicial.style.display = "flex";
  });

  btnReintentar.addEventListener("click", () => {
    defeatModal.style.display = "none";
    menudif.style.display = "flex";
  });

  btnSalirDefeat.addEventListener("click", () => {
    defeatModal.style.display = "none";
    reiniciarJuego();
    pantallainicial.style.display = "flex";
  });

  // BOTÓN PLAY INICIAL
  btnPlay.addEventListener("click", () => {
    pantallainicial.style.display = "none";
    menudif.style.display = "flex";
  });
});



/*----------------------------------- panel de mrda */
// Guardar un puntaje en localStorage
function guardarPuntaje(puntos) {
  let highScores = JSON.parse(localStorage.getItem("memoriceScores")) || [];
  highScores.push(puntos);
  highScores.sort((a, b) => b - a); // ordenar descendente
  highScores = highScores.slice(0, 5); // solo guardar top 5
  localStorage.setItem("memoriceScores", JSON.stringify(highScores));
  mostrarPuntajes();
}

// Mostrar puntajes en el panel
function mostrarPuntajes() {
  const scoreList = document.getElementById("scoreList");
  const highScores = JSON.parse(localStorage.getItem("memoriceScores")) || [];
  scoreList.innerHTML = "";
  highScores.forEach(score => {
    const li = document.createElement("li");
    li.textContent = score;
    scoreList.appendChild(li);
  });
}

// Inicializar puntajes al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  mostrarPuntajes();
});
 
