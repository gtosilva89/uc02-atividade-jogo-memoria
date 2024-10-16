// MATRIZ COM AS IMAGENS
const images = [
    'w_7.png', 'w_8.png', 'w_10.png', 'w_11.png', 'w_95.png', 'w_98.png', 'w_Vista.png', 'w_XP.png',
    'w_7.png', 'w_8.png', 'w_10.png', 'w_11.png', 'w_95.png', 'w_98.png', 'w_Vista.png', 'w_XP.png'
];

// VARIAVEIS DE CARTAS
let primeiraCarta, segundaCarta; // Variáveis para armazenar as cartas selecionadas
let cartaVirada = false; // Controle para verificar se uma carta está virada
let jogoBloqueado = false; // Controle para bloquear cliques durante animações
let paresEncontrado = 0; // Contador de pares encontrados
let tempoInicial, contadorTempo; // Variáveis para controle de tempo
let erroCount = 0; // Contador de erros
let jogoConcluido = false; // Flag para verificar se o jogo foi concluído

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
    const shuffledImages = shuffle(images);
    shuffledImages.forEach(imgSrc => {
        const carta = document.createElement('div');
        carta.classList.add('carta');
        carta.innerHTML = `<img src="./assets/img/png/${imgSrc}" alt="memory card">`;
        carta.addEventListener('click', flipCard);
        board.appendChild(carta);
    });
}

// FUNÇÃO DO JOGO
function flipCard() {
    if (jogoBloqueado) return; // Bloqueia cliques durante animações
    if (this === primeiraCarta) return; // Impede clicar na mesma carta

    this.classList.add('flipped'); // Vira a carta

    if (!cartaVirada) {
        cartaVirada = true; // Marca que uma carta foi virada
        primeiraCarta = this; // Armazena a primeira carta
        if (!tempoInicial) {
            tempoInicial = new Date(); // Inicia o tempo
            tempoInicialr(); // Chama a função para contar o tempo
        }
        return;
    }

    segundaCarta = this; // Armazena a segunda carta
    checkForMatch(); // Checa se as cartas são iguais
}

// FUNÇÃO QUE COMPARA AS CARTAS
function checkForMatch() {
    if (primeiraCarta.innerHTML === segundaCarta.innerHTML) {
        // Se as cartas são iguais
        primeiraCarta.classList.add('certa'); // Adiciona borda verde
        segundaCarta.classList.add('certa'); // Adiciona borda verde
        disableCards(); // Desabilita as cartas
        paresEncontrado++;
        if (paresEncontrado === 8) {
            endGame(); // Termina o jogo se todos os pares forem encontrados
        }
    } else {
        // Se as cartas são diferentes
        erroCount++; // Incrementa o contador de erros
        errorCountDisplay.textContent = `Erros: ${erroCount}`; // Atualiza o display de erros
        primeiraCarta.classList.add('errada'); // Adiciona borda vermelha
        segundaCarta.classList.add('errada'); // Adiciona borda vermelha
        unflipCards(); // Desvira as cartas após um tempo
    }
}

// FUNÇÃO PARA PARES NÃO ENCONTRADOS
function disableCards() {
    primeiraCarta.removeEventListener('click', flipCard); // Remove o evento de clique da primeira carta
    segundaCarta.removeEventListener('click', flipCard); // Remove o evento de clique da segunda carta
    resetBoard(); // Reseta as variáveis de controle
}

// FUNÇÃO PARA INICIAR O JOGO
function unflipCards() {
    jogoBloqueado = true; // Bloqueia novos cliques
    setTimeout(() => {
        primeiraCarta.classList.remove('flipped'); // Desvira a primeira carta
        segundaCarta.classList.remove('flipped'); // Desvira a segunda carta
        primeiraCarta.classList.remove('errada'); // Remove a borda vermelha
        segundaCarta.classList.remove('errada'); // Remove a borda vermelha
        resetBoard(); // Reseta as variáveis de controle
    }, 500); // Espera meio segundo antes de desvirar
}

// FUNÇÃO PARA RESETAR O JOGO
function resetBoard() {
    [cartaVirada, jogoBloqueado] = [false, false]; // Reseta os estados das cartas
    [primeiraCarta, segundaCarta] = [null, null]; // Reseta as cartas selecionadas
}

// INICIAR O CONTADOR
function tempoInicialr() {
    contadorTempo = setInterval(() => {
        const elapsedTime = Math.floor((new Date() - tempoInicial) / 1000); // Calcula o tempo decorrido
        timerDisplay.textContent = `Tempo: ${elapsedTime}s`; // Atualiza o display de tempo
    }, 1000);
}

// FIM DO JOGO
function endGame() {
    clearInterval(contadorTempo); // Para o contador de tempo
    jogoConcluido = true; // Marca o jogo como concluído
    const elapsedTime = Math.floor((new Date() - tempoInicial) / 1000); // Calcula o tempo total
    alert(`Parabéns! Você encontrou todos os pares!\nTempo: ${elapsedTime} segundos\nErros: ${erroCount}`); // Mostra mensagem de finalização
}

// FUNÇÃO PARA REINICIAR O JOGO
function restartGame() {
    board.innerHTML = ''; // Limpa o tabuleiro
    paresEncontrado = 0; // Reseta o contador de pares encontrados
    erroCount = 0; // Reseta o contador de erros
    errorCountDisplay.textContent = `Erros: ${erroCount}`; // Atualiza o display de erros
    tempoInicial = null; // Reseta o tempo
    clearInterval(contadorTempo); // Para o contador de tempo
    timerDisplay.textContent = `Tempo: 0s`; // Reseta o display de tempo
    cartaVirada = false; // Reseta o estado de carta virada
    jogoBloqueado = false; // Reseta o estado de bloqueio
    primeiraCarta = null; // Reseta a primeira carta
    segundaCarta = null; // Reseta a segunda carta
    createBoard(); // Cria um novo tabuleiro
}

// EVENT LISTENERS PARA OS BOTÕES
document.getElementById('restartButton').addEventListener('click', restartGame); // Adiciona evento de reiniciar

createBoard(); // Cria o tabuleiro inicialmente
