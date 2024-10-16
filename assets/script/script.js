// MATRIZ COM AS IMAGENS DAS CARTAS
const images = [
    'w_7.png', 'w_8.png', 'w_10.png', 'w_11.png', 'w_95.png', 'w_98.png', 'w_Vista.png', 'w_XP.png',
    'w_7.png', 'w_8.png', 'w_10.png', 'w_11.png', 'w_95.png', 'w_98.png', 'w_Vista.png', 'w_XP.png'
];

// VARIÁVEIS GLOBAIS DO JOGO
let primeiraCarta, segundaCarta; // Variáveis para armazenar as cartas selecionadas
let cartaVirada = false; // Controle para verificar se uma carta foi virada
let jogoBloqueado = true; // Controle para bloquear cliques antes de iniciar o jogo
let paresEncontrado = 0; // Contador de pares encontrados
let tempoInicial, contadorTempo; // Variáveis para controle de tempo
let erroCount = 0; // Contador de erros
let jogoConcluido = false; // Flag para verificar se o jogo foi concluído
let pontuacao = 0; // Variável para armazenar a pontuação do jogador
let tentativas = 0; // Variável para armazenar o número de tentativas
let jogadorNome = ""; // Variável para armazenar o nome do jogador

// ARRAY PARA ARMAZENAR OS RECORDES
let recordes = JSON.parse(localStorage.getItem('recordes')) || []; // Carrega os recordes do Local Storage ou inicia vazio

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
    if (jogoBloqueado) { // Se o jogo estiver bloqueado, exibe um alerta
        alert("Você deve primeiro clicar em 'Iniciar' e inserir seu nome."); // Alerta se o jogador tentar virar uma carta sem iniciar
        return; // Sai da função
    }

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

// FUNÇÃO PARA INICIAR O JOGO
function startGame() {
    // Solicita o nome do jogador
    jogadorNome = prompt("Por favor, insira seu nome:"); // Solicita ao usuário que insira seu nome
    if (!jogadorNome) { // Verifica se o nome foi fornecido
        alert("O nome do jogador é obrigatório!"); // Exibe um alerta se o nome não for fornecido
        return; // Interrompe a execução se o nome não for fornecido
    }

    resetGame(); // Reinicia o jogo

    // Mostra as cartas por 1.5 segundos
    setTimeout(() => {
        board.childNodes.forEach(carta => carta.classList.add('flipped')); // Vira todas as cartas para mostrar as imagens
    }, 100); // Atraso de 0.1 segundos para garantir que a animação de virar as cartas funcione corretamente

    setTimeout(() => {
        board.childNodes.forEach(carta => carta.classList.remove('flipped')); // Desvira todas as cartas após 1.5 segundos
        jogoBloqueado = false; // Permite que as cartas sejam viradas após o tempo
    }, 1500); // Tempo de 1.5 segundos para mostrar as cartas
}

// FUNÇÃO PARA RESETAR O JOGO
function resetGame() {
    // Limpa o tabuleiro e reinicia todas as variáveis do jogo
    board.innerHTML = ''; // Limpa o tabuleiro
    paresEncontrado = 0; // Reseta o contador de pares encontrados
    erroCount = 0; // Reseta o contador de erros
    pontuacao = 0; // Reseta a pontuação
    tentativas = 0; // Reseta o contador de tentativas
    cartaVirada = false; // Reseta o estado de carta virada
    primeiraCarta = null; // Reseta a primeira carta
    segundaCarta = null; // Reseta a segunda carta
    jogoBloqueado = true; // Bloqueia o jogo para novas tentativas
    tempoInicial = null; // Reseta o tempo inicial

    // Atualiza as exibições na tela
    errorCountDisplay.textContent = `Erros: ${erroCount}`; // Atualiza o contador de erros na tela
    scoreDisplay.textContent = `Pontuação: ${pontuacao}`; // Atualiza a pontuação na tela
    attemptsDisplay.textContent = `Tentativas: ${tentativas}`; // Atualiza o contador de tentativas na tela
    timerDisplay.textContent = `Tempo: 0s`; // Reseta o cronômetro na tela
    clearInterval(contadorTempo); // Para o cronômetro
    createBoard(); // Recria o tabuleiro
}

// FUNÇÃO PARA FINALIZAR O JOGO
function endGame() {
    clearInterval(contadorTempo); // Para o cronômetro
    jogoConcluido = true; // Marca o jogo como concluído
    const tempoDecorrido = Math.floor((new Date() - tempoInicial) / 1000); // Calcula o tempo total

    // Adiciona o recorde ao array de recordes
    addRecord(jogadorNome, pontuacao, tempoDecorrido); // Adiciona o recorde do jogador

    // Exibe a mensagem de vitória na tela
    const mensagemVitoria = document.getElementById('mensagemVitoria'); // Seleciona a div da mensagem de vitória
    const textoVitoria = document.getElementById('textoVitoria'); // Seleciona o parágrafo onde o texto será exibido
    const closeVictoryButton = document.getElementById('closeVictoryButton'); // Seleciona o botão de fechar a mensagem de vitória

    // Insere a mensagem de vitória com tempo, erros, pontuação e nome do jogador
    textoVitoria.textContent = `Parabéns, ${jogadorNome}! Você encontrou todos os pares!\nTempo: ${tempoDecorrido} segundos\nErros: ${erroCount}\nPontuação: ${pontuacao}\nContinue assim e melhore a cada jogada!`;
    mensagemVitoria.style.display = 'block'; // Exibe a div de vitória

    // Evento para fechar a mensagem de vitória
    closeVictoryButton.addEventListener('click', () => {
        mensagemVitoria.style.display = 'none'; // Esconde a div de vitória ao clicar no botão de fechar
    });

    // Cria o elemento de áudio
    const audioVitoria = new Audio('./assets/sound/vitoria.mp3'); // Cria o elemento de áudio com o caminho do som
    audioVitoria.play(); // Toca o áudio de vitória

    // Inicia o contador regressivo de 5 segundos
    let contador = 5; // Define o valor inicial do contador
    const intervaloContador = setInterval(() => { // Define o intervalo para o contador
        contador--; // Decrementa o valor do contador
        textoVitoria.textContent = `Parabéns, ${jogadorNome}! Você encontrou todos os pares!\nTempo: ${tempoDecorrido} segundos\nErros: ${erroCount}\nPontuação: ${pontuacao}\nContinue assim e melhore a cada jogada!\nFechar em ${contador}...`; // Atualiza a mensagem de vitória na tela
        if (contador === 0) { // Quando o contador chega a 0
            clearInterval(intervaloContador); // Para o contador
            mensagemVitoria.style.display = 'none'; // Esconde a div de vitória

            // Mensagem de atualização do Windows
            alert("O seu Windows será atualizado."); // Exibe a mensagem de atualização

            // Exibe a imagem de tela azul por 3 segundos
            document.body.innerHTML = `<img src="./assets/img/jpg/tela_azul.jpg" alt="Tela Azul" style="width: 100%; height: 100%; object-fit: cover;">`; // Substitui o conteúdo da body pela imagem de tela azul
            setTimeout(() => {
                location.reload(); // Atualiza a página após 3 segundos
            }, 3000); // Espera 3 segundos antes de atualizar a página
        }
    }, 1000); // Atualiza o contador a cada segundo
}

// FUNÇÃO PARA ADICIONAR UM REGISTRO
function addRecord(nome, pontuacao, tempo) {
    // Adiciona o recorde ao array e mantém apenas os 20 melhores
    recordes.push({ nome: nome, pontuacao: pontuacao, tempo: tempo }); // Adiciona o recorde
    recordes.sort((a, b) => b.pontuacao - a.pontuacao); // Ordena os recordes pela pontuação (decrescente)
    if (recordes.length > 20) { // Se o número de recordes for maior que 20
        recordes = recordes.slice(0, 20); // Mantém apenas os 20 melhores
    }
    localStorage.setItem('recordes', JSON.stringify(recordes)); // Armazena os recordes no Local Storage
}

// FUNÇÃO PARA MOSTRAR AS REGRAS
function showRules() {
    const regrasDiv = document.getElementById('regras'); // Seleciona a div de regras
    const regrasContent = document.getElementById('regrasContent'); // Seleciona o contêiner das regras

    // Define as regras do jogo com estilo para remover marcadores de lista
    const regrasTexto = `
    <p>Bem-vindo ao Jogo da Memória! Aqui estão as regras:</p>
    <ul style="list-style-type: none; padding-left: 0;">
        <li>O objetivo do jogo é encontrar todos os pares de cartas.</li>
        <li>Clique no botão "Iniciar" e insira seu nome para começar.</li>
        <li>As cartas serão mostradas por 1.5 segundos ao início do jogo.</li>
        <li>Após o tempo, as cartas serão viradas novamente.</li>
        <li>Em cada turno, você pode virar duas cartas.</li>
        <li>Se as cartas forem iguais, elas permanecerão viradas.</li>
        <li>Se não forem iguais, elas serão viradas novamente após um breve atraso.</li>
        <li>Você ganhará pontos com base em quantas tentativas você levou para encontrar um par.</li>
        <li>O jogo termina quando todos os pares forem encontrados.</li>
        <li>Tente completar o jogo com o menor número de erros e tentativas!</li>
    </ul>`;

    regrasContent.innerHTML = regrasTexto; // Insere as regras na div
    regrasDiv.style.display = 'block'; // Exibe a div de regras

    // Define um temporizador para esconder as regras após 10 segundos
    setTimeout(() => {
        regrasDiv.style.display = 'none'; // Esconde a div de regras após 10 segundos
    }, 10000); // 10 segundos
}


// FUNÇÃO PARA MOSTRAR OS RECORDES
function showRecords() {
    const recordesDiv = document.getElementById('recordes'); // Seleciona a div de recordes
    const recordesContent = document.getElementById('recordesContent'); // Seleciona o contêiner dos recordes

    // Limpa o conteúdo anterior
    recordesContent.innerHTML = '';

    // Exibe os recordes
    recordes.forEach((recorde, index) => {
        const recordeElement = document.createElement('p'); // Cria um novo parágrafo para cada recorde
        recordeElement.textContent = `${index + 1}. ${recorde.nome} - Pontuação: ${recorde.pontuacao} - Tempo: ${recorde.tempo} segundos`; // Formata o texto do recorde
        recordesContent.appendChild(recordeElement); // Adiciona o parágrafo ao contêiner de recordes
    });

    recordesDiv.style.display = 'block'; // Exibe a div de recordes
}

// Evento para o botão de regras
document.getElementById('rulesButton').addEventListener('click', showRules); // Adiciona o evento de clique ao botão de regras

// Evento para o botão de fechar as regras
document.getElementById('closeRulesButton').addEventListener('click', () => {
    const regrasDiv = document.getElementById('regras'); // Seleciona a div de regras
    regrasDiv.style.display = 'none'; // Esconde a div de regras ao clicar no botão de fechar
});

// Evento para o botão de recordes
document.getElementById('recordsButton').addEventListener('click', showRecords); // Adiciona o evento de clique ao botão de recordes

// Evento para o botão de fechar os recordes
document.getElementById('closeRecordsButton').addEventListener('click', () => {
    const recordesDiv = document.getElementById('recordes'); // Seleciona a div de recordes
    recordesDiv.style.display = 'none'; // Esconde a div de recordes ao clicar no botão de fechar
});

// EVENTOS PARA OS BOTÕES
document.getElementById('startButton').addEventListener('click', startGame); // Adiciona o evento de clique ao botão de iniciar
document.getElementById('restartButton').addEventListener('click', resetGame); // Adiciona o evento de clique ao botão de reiniciar

createBoard(); // Cria o tabuleiro inicialmente
