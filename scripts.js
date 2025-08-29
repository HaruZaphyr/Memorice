// --- Timer ---
let segundos = 0;
let minutos = 0;
let timer;
let jugando = false;

// Función para iniciar el timer
function iniciarTimer() {
    if (!jugando) {
        jugando = true;
        timer = setInterval(() => {
            segundos++;
            if (segundos === 60) {
                minutos++;
                segundos = 0;
            }
            document.getElementById("contador").textContent =
                `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
        }, 1000);
    }
}

// Reiniciar timer
function reiniciarTimer() {
    clearInterval(timer);
    segundos = 0;
    minutos = 0;
    jugando = false;
    document.getElementById("contador").textContent = "00:00";
}

// --- Botones ---
document.getElementById("btnReiniciar").addEventListener("click", () => {
    reiniciarTimer();
    iniciarTimer();
    alert("¡Juego reiniciado!");
});

document.getElementById("btnDificultad").addEventListener("click", () => {
    alert("Aquí podrías mostrar un menú de dificultad 😃");
});

document.getElementById("btnSalir").addEventListener("click", () => {
    if (confirm("¿Seguro que quieres salir del juego?")) {
        window.location.href = "index.html"; // o una página de inicio
    }
});

// 🔹 Iniciar el timer automáticamente cuando el jugador empiece
// (ejemplo: al cargar la página, lo puedes cambiar a cuando dé clic en 'empezar')
window.onload = iniciarTimer;
