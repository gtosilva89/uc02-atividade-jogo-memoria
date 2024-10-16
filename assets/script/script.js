// MATRIZ COM AS IMAGENS
const images = [
    'w_7.png', 'w_8.png', 'w_10.png', 'w_11.png', 'w_95.png', 'w_98.png', 'w_Vista.png', 'w_XP.png',
    'w_7.png', 'w_8.png', 'w_10.png', 'w_11.png', 'w_95.png', 'w_98.png', 'w_Vista.png', 'w_XP.png'
];

// VARIÁVEIS DE JOGO
let primeiraCarta, segundaCarta; // Variáveis para armazenar as cartas selecionadas
let cartaVirada = false; // Indica se uma carta foi virada
let jogoBloqueado = false; // Impede novas ações enquanto o jogo está em andamento
let paresEncontrado = 0; // Contador de pares encontrados
let tempoInicial, contadorTempo; // Variáveis para controle do tempo
let erroCount = 0; // Contador de erros
let jogoConcluido = false; // Indica se o jogo foi concluído

// SELECIONANDO O TABULEIRO
const board = document.getElementById('game'); // Seleciona o elemento do tabuleiro

// SELECIONANDO CONTADORES
const timerDisplay = document.getElementById('timer'); // Seleciona o display do timer
const errorCountDisplay = document.getElementById('errorCount'); // Seleciona o display de erros

// FUNÇÃO PARA EMBARALHAR AS IMAGENS RANDOMICAMENTE
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5); // Embaralha o array de imagens
}

// FUNÇÃO QUE CRIA AS CARTAS NO TABULEIRO
function createBoard() {
    console.log("Criando o tabuleiro..."); // Mensagem de depuração
    const shuffledImages = shuffle(images); // Embaralha as imagens
    shuffledImages.forEach(imgSrc => {
        const carta = document.createElement('div'); // Cria um novo elemento de carta
        carta.classList.add('carta'); // Adiciona a classe 'carta'
        carta.innerHTML = `<img src="./assets/img/png/${imgSrc}" alt="memory card">`; // Define o conteúdo da carta
        carta.addEventListener('click', flipCard); // Adiciona o evento de clique para virar a carta
        board.appendChild(carta); // Adiciona a carta ao tabuleiro
    });
    console.log("Tabuleiro criado."); // Mensagem de depuração
}

// FUNÇÃO QUE MANIPULA O CLIQUE NA CARTA
function flipCard() {
    if (jogoBloqueado) return; // Se o jogo estiver bloqueado, não faz nada
    if (this === primeiraCarta) return; // Se a carta já foi selecionada, não faz nada
    this.classList.add('flipped'); // Vira a carta

    if (!cartaVirada) {
        cartaVirada = true; // Marca que uma carta foi virada
        primeiraCarta = this; // Armazena a primeira carta selecionada
        if (!tempoInicial) { // Se o tempo ainda não foi iniciado
            tempoInicial = new Date(); // Registra a hora de início
            tempoInicialr(); // Inicia o contador de tempo
        }
        return; // Sai da função
    }

    segundaCarta = this; // Armazena a segunda carta selecionada
    checkForMatch(); // Verifica se as cartas formam um par
}

// FUNÇÃO QUE COMPARA AS DUAS CARTAS SELECIONADAS
function checkForMatch() {
    if (primeiraCarta.innerHTML === segundaCarta.innerHTML) { // Se as cartas forem iguais
        disableCards(); // Desabilita as cartas para que não sejam mais clicáveis
        paresEncontrado++; // Incrementa o contador de pares encontrados
        if (paresEncontrado === 8) { // Se todos os pares foram encontrados
            endGame(); // Chama a função de fim de jogo
        }
    } else {
        erroCount++; // Incrementa o contador de erros
        errorCountDisplay.textContent = `Erros: ${erroCount}`; // Atualiza o display de erros
        unflipCards(); // Vira as cartas de volta
    }
}

// FUNÇÃO PARA DESABILITAR AS CARTAS ENCONTRADAS
function disableCards() {
    primeiraCarta.removeEventListener('click', flipCard); // Remove o evento de clique da primeira carta
    segundaCarta.removeEventListener('click', flipCard); // Remove o evento de clique da segunda carta
    resetBoard(); // Reseta o estado do jogo
}

// FUNÇÃO PARA VIRAR AS CARTAS DE VOLTA CASO NÃO SEJAM IGUAIS
function unflipCards() {
    jogoBloqueado = true; // Bloqueia o jogo para novas ações
    setTimeout(() => {
        primeiraCarta.classList.remove('flipped'); // Vira de volta a primeira carta
        segundaCarta.classList.remove('flipped'); // Vira de volta a segunda carta
        resetBoard(); // Reseta o estado do jogo
    }, 500); // Espera 500ms antes de virar as cartas
}

// FUNÇÃO PARA RESETAR O JOGO
function resetBoard() {
    [cartaVirada, jogoBloqueado] = [false, false]; // Reseta as variáveis de controle
    [primeiraCarta, segundaCarta] = [null, null]; // Reseta as cartas selecionadas
}

// FUNÇÃO PARA INICIAR O CONTADOR DE TEMPO
function tempoInicialr() {
    contadorTempo = setInterval(() => { // Inicia um intervalo para atualizar o tempo
        const elapsedTime = Math.floor((new Date() - tempoInicial) / 1000); // Calcula o tempo decorrido em segundos
        timerDisplay.textContent = `Tempo: ${elapsedTime}s`; // Atualiza o display do timer
    }, 1000); // Atualiza a cada segundo
}

// FUNÇÃO QUE MANIPULA O FIM DO JOGO
function endGame() {
    clearInterval(contadorTempo); // Para o contador de tempo
    jogoConcluido = true; // Marca o jogo como concluído
    const elapsedTime = Math.floor((new Date() - tempoInicial) / 1000); // Calcula o tempo total do jogo
    alert(`Parabéns! Você encontrou todos os pares!\nTempo: ${elapsedTime} segundos\nErros: ${erroCount}`); // Exibe alerta de fim de jogo
}

// FUNÇÃO PARA REINICIAR O JOGO
function restartGame() {
    board.innerHTML = ''; // Limpa o tabuleiro
    paresEncontrado = 0; // Reseta o contador de pares encontrados
    erroCount = 0; // Reseta o contador de erros
    errorCountDisplay.textContent = `Erros: ${erroCount}`; // Atualiza o display de erros
    tempoInicial = null; // Reseta o tempo inicial
    clearInterval(contadorTempo); // Para o contador de tempo
    timerDisplay.textContent = `Tempo: 0s`; // Reseta o display do timer
    cartaVirada = false; // Reseta o estado de carta virada
    jogoBloqueado = false; // Reseta o estado do jogo bloqueado
    primeiraCarta = null; // Reseta a primeira carta
    segundaCarta = null; // Reseta a segunda carta
    createBoard(); // Cria o tabuleiro novamente
}

// FUNÇÃO PARA REEMBARALHAR AS CARTAS
function shuffleCards() {
    if (jogoConcluido) { // Verifica se o jogo foi concluído
        alert("O jogo já foi concluído! Reinicie para jogar novamente."); // Alerta ao usuário
        return; // Impede o reembaralhamento
    }
    board.innerHTML = ''; // Limpa o tabuleiro
    createBoard(); // Cria o tabuleiro novamente com cartas embaralhadas
}

// EVENT LISTENERS PARA OS BOTÕES
document.getElementById('restartButton').addEventListener('click', restartGame); // Adiciona evento de clique ao botão de reiniciar
document.getElementById('shuffleButton').addEventListener('click', shuffleCards); // Adiciona evento de clique ao botão de reembaralhar

createBoard(); // Cria o tabuleiro ao carregar o jogo
