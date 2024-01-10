document.addEventListener('DOMContentLoaded', () => {
    const html = document.querySelector('html');
    const banner = document.querySelector('.app__image');
    const titulo = document.querySelector('.app__title');
    const botoes = document.querySelectorAll('.app__card-button');
    const startPauseBt = document.querySelector('#start-pause');
    const timerElement = document.getElementById('timer');
    const somInicio = new Audio('/sons/play.wav');
    const beepSound = new Audio('/sons/beep.mp3');
    const pauseSound = new Audio('/sons/pause.mp3');
    const descansoCurtoButton = document.querySelector('.app__card-button--curto');
    const descansoLongoButton = document.querySelector('.app__card-button--longo');
    const focoButton = document.querySelector('.app__card-button--foco');


    let tempoPadraoFoco = 1500;
    let tempoPadraoCurto = 300;
    let tempoPadraoLongo = 900;
    let tempoDecorrido = tempoPadraoFoco;
    let intervaloId = null;
    let isPaused = true;

    const titulos = {
        foco: 'Otimize sua produtividade,<br><strong class="app__title-strong">mergulhe no que importa.</strong>',
        'descanso-curto': 'Que tal dar uma respirada?<br><strong class="app__title-strong">Faça uma pausa curta</strong>',
        'descanso-longo': 'Hora de voltar à superfície.<br><strong class="app__title-strong">Faça uma pausa longa.</strong>'
    };

    const audioElement = new Audio('/sons/luna-rise-part-one.mp3');
    const toggleMusica = document.getElementById('alternar-musica');

    if (focoButton) {
        focoButton.addEventListener('click', () => {
            iniciarContexto('foco');
        
        });
    }

    if (descansoCurtoButton) {
        descansoCurtoButton.addEventListener('click', () => {
            iniciarContexto('curto', 'curto');
        });
    }

    if (descansoLongoButton) {
        descansoLongoButton.addEventListener('click', () => {
            iniciarContexto('longo', 'longo');
        });
    }

    iniciarContexto('foco'); 

    function iniciarContexto(contexto) {
        atualizarContexto(contexto);
        adicionarClasseAtiva(contexto);
        atualizarImagemBanner(`/imagens/${contexto}.png`);

        switch (contexto) {
            case 'foco':
                tempoDecorrido = tempoPadraoFoco;
                break;
            case 'descanso-curto':
                tempoDecorrido = tempoPadraoCurto;
                break;
            case 'descanso-longo':
                tempoDecorrido = tempoPadraoLongo;
                break;
        }

        atualizarCronometro(tempoDecorrido);
    }

    startPauseBt.addEventListener('click', toggleContagem);

    function atualizarImagemBanner(caminhoImagem) {
        if (banner) {
            banner.src = caminhoImagem;
        }
    }

    function adicionarClasseAtiva(contexto) {
        const elementoAtivo = document.querySelector(`.app__card-button--${contexto}`);

        if (elementoAtivo) {
            botoes.forEach(botao => botao.classList.remove('active'));
            elementoAtivo.classList.add('active');
        }
    }

    function atualizarContexto(contexto) {
        adicionarClasseAtiva(contexto);
        html.setAttribute('data-contexto', contexto);
        atualizarElemento(titulo, titulos[contexto] || '');
    }

    function atualizarElemento(elemento, valor) {
        if (elemento) {
            elemento.innerHTML = valor;
        }
    }

    function toggleMusicaHandler() {
        toggleMusica.checked ? audioElement.play() : audioElement.pause();
    }

    function toggleContagem() {
        if (intervaloId) {
            clearInterval(intervaloId);
            intervaloId = null;
            pauseSound.play();
        } else {
            somInicio.play();
            intervaloId = setInterval(contagemRegressiva, 1000);
        }

        isPaused = !isPaused;
        const imgSrc = isPaused ? '/imagens/play_arrow.png' : '/imagens/pause.png';
        startPauseBt.querySelector('img').src = imgSrc;
    }

    function contagemRegressiva() {
        tempoDecorrido -= 1;
        atualizarCronometro(tempoDecorrido);

        if (tempoDecorrido <= 0) {
            handleTempoEsgotado();
        }
    }

    function handleTempoEsgotado() {
        clearInterval(intervaloId);
        beepSound.play();
        setTimeout(() => {
            alert('Tempo esgotado!');
            beepSound.pause();
            resetarTempo();
            toggleContagem();
        }, 0);
    }

    function resetarTempo() {
        switch (html.getAttribute('data-contexto')) {
            case 'foco':
                tempoDecorrido = tempoPadraoFoco;
                break;
            case 'descanso-curto':
                tempoDecorrido = tempoPadraoCurto;
                break;
            case 'descanso-longo':
                tempoDecorrido = tempoPadraoLongo;
                break;
        }
        atualizarCronometro(tempoDecorrido);
    }

    function atualizarCronometro(segundos) {
        const minutos = Math.floor(segundos / 60);
        const segundosRestantes = segundos % 60;
        const minutosFormatados = minutos < 10 ? `0${minutos}` : minutos;
        const segundosFormatados = segundosRestantes < 10 ? `0${segundosRestantes}` : segundosRestantes;

        timerElement.innerText = `${minutosFormatados}:${segundosFormatados}`;
    }

    toggleMusica.addEventListener('change', toggleMusicaHandler);
    startPauseBt.addEventListener('click', toggleContagem);
    botoes.forEach(botao => botao.addEventListener('click', () => iniciarContexto(botao.dataset.contexto)));
});
