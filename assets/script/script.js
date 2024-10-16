// MATRIZ COM AS IMAGENS DAS CARTAS
const images = [
    'w_7.png', 'w_8.png', 'w_10.png', 'w_11.png', 'w_95.png', 'w_98.png', 'w_Vista.png', 'w_XP.png',
    'w_7.png', 'w_8.png', 'w_10.png', 'w_11.png', 'w_95.png', 'w_98.png', 'w_Vista.png', 'w_XP.png'
];

// VARIÁVEIS GLOBAIS DO JOGO
let primeiraCarta, segundaCarta; // Variáveis para armazenar as cartas selecionadas
let cartaVirada = false; // Controle para verificar se uma carta foi virada
let jogoBloqueado = false; // Controle para bloquear cliques durante animações
let paresEncontrado = 0; // Contador de pares encontrados
let tempoInicial, contadorTempo; // Variáveis para controle de tempo
let erroCount = 0; // Contador de erros
let jogoConcluido = false; // Flag para verificar se o jogo foi concluído
let pontuacao = 0; // Variável para armazenar a pontuação do jogador
let tentativas = 0; // Variável para armazenar o número de tentativas

// ELEMENTOS DO DOM
const board = document.getElementById('game'); // Elemento do tabuleiro
const timerDisplay = document.getElementById('timer'); // Exibição do cronômetro
const errorCountDisplay = document.getElementById('errorCount'); // Exibição do contador de erros
const scoreDisplay = document.getElementById('score'); // Exibição da pontuação
const attemptsDisplay = document.getElementById('attempts'); // Exibição do contador de tentativas

// FUNÇÃO PARA EMBARALHAR AS IMAGENS
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5); // Embaralha as imagens aleatoriamente
}

// FUNÇÃO PARA CRIAR O TABULEIRO DO JOGO
function createBoard() {
    const shuffledImages = shuffle(images); // Embaralha as imagens
    shuffledImages.forEach(imgSrc => {
        const carta = document.createElement('div'); // Cria uma nova div para cada carta
        carta.classList.add('carta'); // Adiciona a classe "carta"
        carta.innerHTML = `<img src="./assets/img/png/${imgSrc}" alt="memory card">`; // Insere a imagem da carta
        carta.addEventListener('click', flipCard); // Adiciona evento de clique para virar a carta
        board.appendChild(carta); // Adiciona a carta ao tabuleiro
    });

    scoreDisplay.textContent = `Pontuação: ${pontuacao}`; // Inicializa a pontuação na tela
    attemptsDisplay.textContent = `Tentativas: ${tentativas}`; // Inicializa o contador de tentativas na tela
}

// FUNÇÃO PARA VIRAR A CARTA
function flipCard() {
    if (jogoBloqueado || this === primeiraCarta) return; // Bloqueia o clique se o jogo estiver bloqueado ou a carta for a mesma

    this.classList.add('flipped'); // Adiciona a classe que vira a carta

    if (!cartaVirada) { // Se ainda não houver uma carta virada
        tentativas++; // Incrementa o contador de tentativas
        attemptsDisplay.textContent = `Tentativas: ${tentativas}`; // Atualiza o contador de tentativas na tela
        cartaVirada = true; // Marca que uma carta foi virada
        primeiraCarta = this; // Armazena a primeira carta virada
        if (!tempoInicial) { // Se o cronômetro não começou ainda
            tempoInicial = new Date(); // Inicia o tempo
            startTimer(); // Inicia a função do cronômetro
        }
        return; // Sai da função
    }

    segundaCarta = this; // Armazena a segunda carta virada
    checkForMatch(); // Verifica se as cartas combinam
}

// FUNÇÃO PARA VERIFICAR SE AS CARTAS SÃO IGUAIS
function checkForMatch() {
    if (primeiraCarta.innerHTML === segundaCarta.innerHTML) { // Se as cartas são iguais
        primeiraCarta.classList.add('certa'); // Adiciona a classe "certa" à primeira carta
        segundaCarta.classList.add('certa'); // Adiciona a classe "certa" à segunda carta
        disableCards(); // Desabilita o clique nas cartas corretas
        paresEncontrado++; // Incrementa o contador de pares encontrados

        // Pontuação baseada na quantidade de tentativas
        if (tentativas === 1) {
            pontuacao += 15; // 1ª tentativa: 15 pontos
        } else if (tentativas === 2) {
            pontuacao += 7; // 2ª tentativa: 7 pontos
        } else {
            pontuacao += 2; // A partir da 3ª tentativa: 2 pontos
        }

        scoreDisplay.textContent = `Pontuação: ${pontuacao}`; // Atualiza a exibição da pontuação
        tentativas = 0; // Reseta o contador de tentativas

        attemptsDisplay.textContent = `Tentativas: ${tentativas}`; // Atualiza o contador de tentativas na tela

        if (paresEncontrado === 8) { // Se todos os pares foram encontrados
            endGame(); // Finaliza o jogo
        }
    } else { // Se as cartas não são iguais
        erroCount++; // Incrementa o contador de erros
        errorCountDisplay.textContent = `Erros: ${erroCount}`; // Atualiza o contador de erros na tela
        primeiraCarta.classList.add('errada'); // Adiciona a classe "errada" à primeira carta
        segundaCarta.classList.add('errada'); // Adiciona a classe "errada" à segunda carta
        unflipCards(); // Desvira as cartas erradas
    }
}

// FUNÇÃO PARA DESABILITAR AS CARTAS CORRETAS
function disableCards() {
    primeiraCarta.removeEventListener('click', flipCard); // Remove o evento de clique da primeira carta
    segundaCarta.removeEventListener('click', flipCard); // Remove o evento de clique da segunda carta
    resetBoard(); // Reseta as variáveis de controle
}

// FUNÇÃO PARA DESVIRAR AS CARTAS ERRADAS
function unflipCards() {
    jogoBloqueado = true; // Bloqueia novos cliques
    setTimeout(() => { // Define um atraso para desvirar as cartas
        primeiraCarta.classList.remove('flipped', 'errada'); // Remove as classes da primeira carta
        segundaCarta.classList.remove('flipped', 'errada'); // Remove as classes da segunda carta
        resetBoard(); // Reseta as variáveis de controle
    }, 500); // Atraso de meio segundo antes de desvirar
}

// FUNÇÃO PARA RESETAR AS VARIÁVEIS DO JOGO
function resetBoard() {
    [cartaVirada, jogoBloqueado] = [false, false]; // Reseta as variáveis de controle
    [primeiraCarta, segundaCarta] = [null, null]; // Reseta as cartas selecionadas
}

// FUNÇÃO PARA INICIAR O CRONÔMETRO
function startTimer() {
    contadorTempo = setInterval(() => { // Define o intervalo do cronômetro
        const tempoDecorrido = Math.floor((new Date() - tempoInicial) / 1000); // Calcula o tempo decorrido
        timerDisplay.textContent = `Tempo: ${tempoDecorrido}s`; // Atualiza o tempo na tela
    }, 1000); // Atualiza o cronômetro a cada segundo
}

// FUNÇÃO PARA FINALIZAR O JOGO
function endGame() {
    clearInterval(contadorTempo); // Para o cronômetro
    jogoConcluido = true; // Marca o jogo como concluído
    const tempoDecorrido = Math.floor((new Date() - tempoInicial) / 1000); // Calcula o tempo total

    // Exibe a mensagem de vitória na tela
    const mensagemVitoria = document.getElementById('mensagemVitoria'); // Seleciona a div da mensagem de vitória
    const textoVitoria = document.getElementById('textoVitoria'); // Seleciona o parágrafo onde o texto será exibido
    const contadorVitoria = document.getElementById('contadorVitoria'); // Seleciona o parágrafo onde o contador será exibido

    // Insere a mensagem de vitória com tempo, erros e pontuação
    textoVitoria.textContent = `Parabéns! Você encontrou todos os pares!\nTempo: ${tempoDecorrido} segundos\nErros: ${erroCount}\nPontuação: ${pontuacao}`;
    mensagemVitoria.style.display = 'block'; // Exibe a div de vitória

    // Cria o elemento de áudio
    const audioVitoria = new Audio('./assets/sound/vitoria.mp3'); // Cria o elemento de áudio com o caminho do som
    audioVitoria.play(); // Toca o áudio de vitória

    // Inicia o contador regressivo de 5 segundos
    let contador = 5; // Define o valor inicial do contador
    const intervaloContador = setInterval(() => { // Define o intervalo para o contador
        contador--; // Decrementa o valor do contador
        contadorVitoria.textContent = contador; // Atualiza o contador na tela
        if (contador === 0) { // Quando o contador chega a 0
            clearInterval(intervaloContador); // Para o contador
            mensagemVitoria.style.display = 'none'; // Esconde a div de vitória
        }
    }, 1000); // Atualiza o contador a cada segundo
}

// FUNÇÃO PARA REINICIAR O JOGO
function restartGame() {
    board.innerHTML = ''; // Limpa o tabuleiro
    paresEncontrado = 0; // Reseta o contador de pares encontrados
    erroCount = 0; // Reseta o contador de erros
    pontuacao = 0; // Reseta a pontuação
    tentativas = 0; // Reseta o contador de tentativas
    errorCountDisplay.textContent = `Erros: ${erroCount}`; // Atualiza o contador de erros na tela
    scoreDisplay.textContent = `Pontuação: ${pontuacao}`; // Atualiza a pontuação na tela
    attemptsDisplay.textContent = `Tentativas: ${tentativas}`; // Atualiza o contador de tentativas na tela
    tempoInicial = null; // Reseta o tempo inicial
    clearInterval(contadorTempo); // Para o cronômetro
    timerDisplay.textContent = `Tempo: 0s`; // Reseta o cronômetro na tela
    createBoard(); // Recria o tabuleiro
}

// EVENTO PARA O BOTÃO DE REINICIAR
document.getElementById('restartButton').addEventListener('click', restartGame); // Adiciona o evento de clique ao botão de reiniciar

createBoard(); // Cria o tabuleiro inicialmente
