// MATRIZ COM AS IMAGENS
const images = [
    'w_7.png', 'w_8.png', 'w_10.png', 'w_11.png', 'w_95.png', 'w_98.png', 'w_Vista.png', 'w_XP.png',
    'w_7.png', 'w_8.png', 'w_10.png', 'w_11.png', 'w_95.png', 'w_98.png', 'w_Vista.png', 'w_XP.png'
];

// VARIAVEIS DE CARTAS
let primeiraCarta, segundaCarta;
let cartaVirada = false;
let jogoBloqueado = false;
let paresEncontrado = 0;
let tempoInicial, contadorTempo;
let erroCount = 0; // Contador de erros

// APRESENTANDO A MATRIZ
const board = document.getElementById('game');

// CONTADORES
const timerDisplay = document.getElementById('timer');
const errorCountDisplay = document.getElementById('errorCount'); // Contador de erros

// FUNÇÃO PARA EMBARALHAR RANDOMICAMENTE
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// FUNÇÃO QUE CRIA AS CARTAS
function createBoard() {
    console.log("Criando o tabuleiro..."); // Debug
    const shuffledImages = shuffle(images);
    shuffledImages.forEach(imgSrc => {
        const carta = document.createElement('div');
        carta.classList.add('carta');
        carta.innerHTML = `<img src="./assets/img/png/${imgSrc}" alt="memory card">`;
        carta.addEventListener('click', flipCard);
        board.appendChild(carta);
    });
    console.log("Tabuleiro criado."); // Debug
}

// FUNÇÃO DO JOGO
function flipCard() {
    if (jogoBloqueado) return;
    if (this === primeiraCarta) return;
    this.classList.add('flipped');

    if (!cartaVirada) {
        cartaVirada = true;
        primeiraCarta = this;
        if (!tempoInicial) {
            tempoInicial = new Date();
            tempoInicialr();
        }
        return;
    }

    segundaCarta = this;
    checkForMatch();
}

// FUNÇÃO QUE COMPARA AS CARTAS
function checkForMatch() {
    if (primeiraCarta.innerHTML === segundaCarta.innerHTML) {
        disableCards();
        paresEncontrado++;
        if (paresEncontrado === 8) {
            endGame();
        }
    } else {
        erroCount++; // Incrementa o contador de erros
        errorCountDisplay.textContent = `Erros: ${erroCount}`; // Atualiza o display
        unflipCards();
    }
}

// FUNÇÃO PARA PARES NÃO ENCONTRADOS
function disableCards() {
    primeiraCarta.removeEventListener('click', flipCard);
    segundaCarta.removeEventListener('click', flipCard);
    resetBoard();
}

// FUNÇÃO PARA INICIAR O JOGO
function unflipCards() {
    jogoBloqueado = true;
    setTimeout(() => {
        primeiraCarta.classList.remove('flipped');
        segundaCarta.classList.remove('flipped');
        resetBoard();
    }, 500);
}

// FUNÇÃO PARA RESETAR O JOGO
function resetBoard() {
    [cartaVirada, jogoBloqueado] = [false, false];
    [primeiraCarta, segundaCarta] = [null, null];
}

// INICIAR O CONTADOR
function tempoInicialr() {
    contadorTempo = setInterval(() => {
        const elapsedTime = Math.floor((new Date() - tempoInicial) / 1000);
        timerDisplay.textContent = `Tempo: ${elapsedTime}s`;
    }, 1000);
}

// FIM DO JOGO
function endGame() {
    clearInterval(contadorTempo);
    alert('Parabéns! Você encontrou todos os pares!');
}

// FUNÇÃO PARA REINICIAR O JOGO
function restartGame() {
    board.innerHTML = '';
    paresEncontrado = 0;
    erroCount = 0;
    errorCountDisplay.textContent = `Erros: ${erroCount}`;
    tempoInicial = null;
    clearInterval(contadorTempo);
    timerDisplay.textContent = `Tempo: 0s`;
    cartaVirada = false;
    jogoBloqueado = false;
    primeiraCarta = null;
    segundaCarta = null;
    createBoard();
}


// FUNÇÃO PARA REEMBARALHAR AS CARTAS
function shuffleCards() {
    board.innerHTML = ''; // Limpar o tabuleiro
    createBoard(); // Criar o tabuleiro novamente com cartas embaralhadas
}

// EVENT LISTENERS PARA OS BOTÕES
document.getElementById('restartButton').addEventListener('click', restartGame);
document.getElementById('shuffleButton').addEventListener('click', shuffleCards);

createBoard();
