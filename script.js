// --- Mascote e Sons (Configurações Iniciais) ---
const MASCOT_IMAGES = {
    happy: 'img/cerebro_feliz.png',
    sad: 'img/cerebro_triste.png',
    neutral: 'img/cerebro_neutro.png',
    animated: 'img/cerebro_animado.png',
    in_love: 'img/cerebro_apaixonado.png',
    loving: 'img/cerebro_amando.png',
    confused: 'img/cerebro_confuso.png',
    proud: 'img/cerebro_orgulhoso.png',
    surprised: 'img/cerebro_surpresa.png',
    thoughtful: 'img/cerebro_pensativo.png', // Usado para o botão Home
    tired: 'img/cerebro_cansado.png',
    worried: 'img/cerebro_preocupado.png'
};

const SOUNDS = {
    correct: new Audio('som/som_acerto.mp3'),
    incorrect: new Audio('som/som_erro.mp3'),
    moduleComplete: new Audio('som/som_modulo_completo.mp3'),
    challengeUnlocked: new Audio('som/som_desafio_desbloqueado.mp3'),
    buttonClick: new Audio('som/som_clique.mp3'),
    timerTick: new Audio('som/som_timer_tick.mp3'),
    timerUrgent: new Audio('som/som_timer_urgente.mp3')
};

function playSound(type) {
    if (SOUNDS[type]) {
        SOUNDS[type].currentTime = 0; // Reinicia o áudio para que possa ser tocado rapidamente
        SOUNDS[type].play();
    }
}

function updateMascotExpression(expression) {
    // Atualiza a imagem do mascote no cabeçalho e na área de feedback
    const headerMascot = document.getElementById('mascot-header');
    const feedbackMascot = document.getElementById('mascot-feedback');
    
    if (headerMascot && MASCOT_IMAGES[expression]) {
        headerMascot.src = MASCOT_IMAGES[expression];
        headerMascot.alt = `Mascote Cérebro ${expression}`;
    }
    if (feedbackMascot && MASCOT_IMAGES[expression]) {
        feedbackMascot.src = MASCOT_IMAGES[expression];
        feedbackMascot.alt = `Mascote Cérebro ${expression}`;
    }

    // A imagem do botão Home é gerenciada separadamente para manter a expressão 'pensativa'
    const homeButtonImg = document.querySelector('#home-button img');
    if (homeButtonImg) {
        homeButtonImg.src = MASCOT_IMAGES['thoughtful']; // O botão Home sempre usa a expressão pensativa/confusa
        homeButtonImg.alt = "Voltar ao Menu - Mascote Cérebro Pensativo";
    }
}


// --- Variáveis Globais ---
let allModules = [];
let currentModule = null;
let currentExerciseIndex = 0;
let currentModuleScore = 0;
let answeredCorrectlyInModule = 0; // Acertos para a pontuação final do módulo
let totalExercisesInModule = 0; // Total de exercícios incluindo fixação

// --- Elementos HTML ---
const moduleSelectionScreen = document.getElementById('module-selection');
const siteExplanationScreen = document.getElementById('site-explanation'); // Nova referência
const moduleListContainer = document.getElementById('module-list');
const moduleContentScreen = document.getElementById('module-content');
const moduleTitleElement = document.getElementById('module-title');
const textBaseContentElement = document.getElementById('text-base-content');
const exerciseContainer = document.getElementById('exercise-container');
const nextExerciseBtn = document.getElementById('next-exercise-btn');
const checkAnswerBtn = document.getElementById('check-answer-btn');
const feedbackArea = document.getElementById('feedback-area');
const feedbackText = document.getElementById('feedback-text');
const mascotFeedback = document.getElementById('mascot-feedback');
const continueBtn = document.getElementById('continue-btn');
const challengeScreen = document.getElementById('challenge-screen');
const challengeTitle = document.getElementById('challenge-title');
const timerDisplay = document.getElementById('timer-display');
const challengePairsContainer = document.getElementById('challenge-pairs');
const challengeFeedbackArea = document.getElementById('challenge-feedback-area');
const challengeFeedbackText = document.getElementById('challenge-feedback-text');
const challengeRestartBtn = document.getElementById('challenge-restart-btn');
const challengeBackToModulesBtn = document.getElementById('challenge-back-to-modules-btn');

const homeButton = document.getElementById('home-button');
const correctAnswersDisplay = document.getElementById('correct-answers-display');
const progressBarFill = document.getElementById('progress-bar-fill');


// --- Funções Principais ---

async function loadModuleData() {
    // A ordem aqui é importante para a exibição na tela de seleção
    const jsonFiles = ['data.json', 'data2.json', 'data3.json', 'data4.json', 'data5.json', 'data6.json'];
    
    allModules = []; 
    console.log("Iniciando carregamento dos módulos...");
    for (const file of jsonFiles) {
        try {
            const response = await fetch(file);
            if (!response.ok) {
                console.error(`Erro HTTP ao carregar ${file}: Status ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status} from ${file}`);
            }
            const data = await response.json(); 
            
            // AQUI É A LÓGICA CRÍTICA DE CARREGAMENTO!
            // Para lidar com o data.json que você enviou que tem a estrutura `{"modulos": [...]}`
            // e os outros dataX.json que são objetos de módulo diretos.
            if (file === 'data.json' && data.modulos && Array.isArray(data.modulos)) {
                 allModules.push(...data.modulos); // Pega todos os módulos do array (se data.json tiver muitos)
                 console.log(`Módulo(s) de data.json carregado(s). Total de módulos até agora: ${allModules.length}`);
            } else {
                 allModules.push(data); // Para os dataX.json que são objetos de módulo diretos
                 console.log(`Módulo de ${file} carregado. Total de módulos até agora: ${allModules.length}`);
            }
        } catch (error) {
            console.error(`NÃO FOI POSSÍVEL CARREGAR OU PARSEAR o módulo de ${file}:`, error);
        }
    }
    
    if (allModules.length === 0) {
        console.warn("Nenhum módulo foi carregado com sucesso. Verifique os arquivos JSON e seus caminhos no console.");
        moduleListContainer.innerHTML = "<p>Nenhum módulo de estudo disponível. Verifique o console (F12) para erros de carregamento.</p>";
    } else {
        console.log(`Carregamento concluído. Total de módulos para exibir: ${allModules.length}`);
        displayModuleSelection();
    }
}

function displayModuleSelection() {
    siteExplanationScreen.classList.remove('hidden'); // Mostra a explicação
    moduleSelectionScreen.classList.remove('hidden'); // Mostra a seleção de módulos
    moduleContentScreen.classList.add('hidden');
    challengeScreen.classList.add('hidden');
    homeButton.classList.add('hidden'); // Esconder botão Home na tela de seleção de módulo

    moduleListContainer.innerHTML = ''; 

    allModules.forEach(module => {
        const moduleCard = document.createElement('div');
        moduleCard.classList.add('module-card');
        moduleCard.innerHTML = `
            <h3>${module.titulo}</h3>
            <p>${module.descricao}</p>
            <p>Desafios: ${module.niveis_desafio_pontuacao.facil} (Fácil), ${module.niveis_desafio_pontuacao.medio} (Médio), ${module.niveis_desafio_pontuacao.dificil} (Difícil)</p>
        `;
        moduleCard.addEventListener('click', () => selectModule(module.id));
        moduleListContainer.appendChild(moduleCard);
    });
    updateMascotExpression('happy'); // Cérebro feliz na tela inicial
}

function selectModule(moduleId) {
    currentModule = allModules.find(m => m.id === moduleId);
    if (currentModule) {
        siteExplanationScreen.classList.add('hidden'); // Esconde a explicação
        moduleSelectionScreen.classList.add('hidden'); // Esconde a seleção de módulos
        moduleContentScreen.classList.remove('hidden');
        challengeScreen.classList.add('hidden');
        homeButton.classList.remove('hidden'); // Mostrar botão Home

        moduleTitleElement.textContent = currentModule.titulo;
        
        // Exibir o texto base do módulo (se existir)
        if (currentModule.texto_base) {
            textBaseContentElement.innerHTML = `<pre>${currentModule.texto_base}</pre>`;
            textBaseContentElement.parentElement.classList.remove('hidden'); 
        } else {
            textBaseContentElement.innerHTML = `<p>Texto de referência não disponível para este módulo.</p>`;
            textBaseContentElement.parentElement.classList.add('hidden'); 
        }
        
        currentExerciseIndex = 0;
        currentModuleScore = 0;
        answeredCorrectlyInModule = 0;
        totalExercisesInModule = currentModule.exercicios.length + currentModule.exercicios_fixacao.length;
        
        updateProgressBar(); // Inicializa a barra de progresso para 0%
        correctAnswersDisplay.textContent = `Acertos: ${answeredCorrectlyInModule}/${totalExercisesInModule}`; 

        displayExercise();
        updateMascotExpression('animated'); // Cérebro animado para começar!
    } else {
        console.error(`Módulo com ID ${moduleId} não encontrado.`);
        alert('Módulo não encontrado. Retornando ao menu principal.');
        goToHome();
    }
}

function displayExercise() {
    hideFeedback();
    nextExerciseBtn.classList.add('hidden');
    checkAnswerBtn.classList.remove('hidden');

    // Assegura que o display de acertos e a barra de progresso estão atualizados para o NOVO exercício
    correctAnswersDisplay.textContent = `Acertos: ${answeredCorrectlyInModule}/${currentExerciseIndex + 1} de ${totalExercisesInModule}`; 
    updateProgressBar(); // Atualiza a barra de progresso

    if (currentExerciseIndex >= totalExercisesInModule) {
        handleModuleCompletion();
        return;
    }

    const isFixation = currentExerciseIndex >= currentModule.exercicios.length;
    const exercise = isFixation 
        ? currentModule.exercicios_fixacao[currentExerciseIndex - currentModule.exercicios.length]
        : currentModule.exercicios[currentExerciseIndex];

    exerciseContainer.innerHTML = '';

    const questionElement = document.createElement('p');
    questionElement.id = 'exercise-question';
    questionElement.textContent = exercise.pergunta;
    exerciseContainer.appendChild(questionElement);

    if (exercise.contexto_texto_ref) {
        const contextRef = document.createElement('small');
        contextRef.textContent = `(Referência: ${exercise.contexto_texto_ref})`;
        exerciseContainer.appendChild(contextRef);
    }

    if (exercise.tipo === 'multipla_escolha') {
        const optionsList = document.createElement('ul');
        optionsList.classList.add('options-list');
        exercise.opcoes.forEach((option) => {
            const listItem = document.createElement('li');
            listItem.textContent = option;
            listItem.dataset.option = option;
            listItem.addEventListener('click', () => {
                optionsList.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
                listItem.classList.add('selected');
            });
            optionsList.appendChild(listItem);
        });
        exerciseContainer.appendChild(optionsList);
    } else if (exercise.tipo === 'verdadeiro_falso') {
        const optionsList = document.createElement('ul');
        optionsList.classList.add('options-list');
        ['VERDADEIRO', 'FALSO'].forEach(option => {
            const listItem = document.createElement('li');
            listItem.textContent = option;
            listItem.dataset.option = option === 'VERDADEIRO' ? 'true' : 'false';
            listItem.addEventListener('click', () => {
                optionsList.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
                listItem.classList.add('selected');
            });
            optionsList.appendChild(listItem);
        });
        exerciseContainer.appendChild(optionsList);
    } else if (exercise.tipo === 'pergunta_resposta') {
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = 'Digite sua resposta aqui...';
        inputField.id = 'answer-input';
        exerciseContainer.appendChild(inputField);
    }
}

function checkAnswer() {
    let isCorrect = false;
    let selectedAnswer = '';

    const isFixation = currentExerciseIndex >= currentModule.exercicios.length;
    const exercise = isFixation 
        ? currentModule.exercicios_fixacao[currentExerciseIndex - currentModule.exercicios.length]
        : currentModule.exercicios[currentExerciseIndex];

    if (exercise.tipo === 'multipla_escolha' || exercise.tipo === 'verdadeiro_falso') {
        const selectedOption = exerciseContainer.querySelector('.options-list li.selected');
        if (selectedOption) {
            selectedAnswer = selectedOption.dataset.option;
            const correctAnswer = exercise.tipo === 'verdadeiro_falso' ? String(exercise.resposta_correta) : exercise.resposta_correta;
            isCorrect = selectedAnswer === correctAnswer;
        }
    } else if (exercise.tipo === 'pergunta_resposta') {
        const inputField = document.getElementById('answer-input');
        if (inputField) {
            selectedAnswer = inputField.value.trim().toLowerCase();
            isCorrect = exercise.respostas_aceitas.some(res => res.toLowerCase() === selectedAnswer);
        }
    }

    if (isCorrect) {
        currentModuleScore += 5;
        answeredCorrectlyInModule++;
        showFeedback("Correto!", true, exercise.explicacao);
        playSound('correct');
        updateMascotExpression('happy');
    } else {
        showFeedback("Incorreto. Tente novamente.", false, exercise.explicacao);
        playSound('incorrect');
        updateMascotExpression('sad');
    }
    correctAnswersDisplay.textContent = `Acertos: ${answeredCorrectlyInModule}/${currentExerciseIndex + 1} de ${totalExercisesInModule}`; 
    updateProgressBar(); 

    checkAnswerBtn.classList.add('hidden');
    continueBtn.classList.remove('hidden');
}

function showFeedback(message, isCorrect, explanation) {
    feedbackArea.classList.remove('hidden', 'correct', 'incorrect');
    feedbackArea.classList.add(isCorrect ? 'correct' : 'incorrect');
    feedbackText.innerHTML = `<strong>${message}</strong><br>${explanation}`;
    mascotFeedback.classList.remove('hidden');
}

function hideFeedback() {
    feedbackArea.classList.add('hidden');
    feedbackText.textContent = '';
    mascotFeedback.classList.add('hidden');
    feedbackArea.classList.remove('correct', 'incorrect');
}

function updateProgressBar() {
    const progress = ((currentExerciseIndex) / totalExercisesInModule) * 100; // Use currentExerciseIndex para o progresso dos exercícios já feitos
    progressBarFill.style.width = `${progress}%`;
    if (progress > 100) { // Garante que a barra não passe de 100% no final
        progressBarFill.style.width = '100%';
    }
}

function handleModuleCompletion() {
    nextExerciseBtn.classList.add('hidden');
    checkAnswerBtn.classList.add('hidden');
    continueBtn.classList.add('hidden');
    hideFeedback();
    updateProgressBar(); // Finaliza a barra de progresso em 100%

    const finalPercentage = (answeredCorrectlyInModule / totalExercisesInModule) * 100;
    let challengeLevel = '';
    let alertMessage = '';

    if (finalPercentage >= 90) {
        challengeLevel = 'dificil';
        alertMessage = `Parabéns, Cérebro! Você completou o módulo com ${finalPercentage.toFixed(0)}% de acertos e desbloqueou o desafio DIFÍCIL!`;
        playSound('challengeUnlocked');
        updateMascotExpression('proud');
    } else if (finalPercentage >= 80) {
        challengeLevel = 'medio';
        alertMessage = `Muito bem, Cérebro! Você completou o módulo com ${finalPercentage.toFixed(0)}% de acertos e desbloqueou o desafio MÉDIO!`;
        playSound('challengeUnlocked');
        updateMascotExpression('happy');
    } else if (finalPercentage >= 70) {
        challengeLevel = 'facil';
        alertMessage = `Bom trabalho, Cérebro! Você completou o módulo com ${finalPercentage.toFixed(0)}% de acertos e desbloqueou o desafio FÁCIL!`;
        playSound('challengeUnlocked');
        updateMascotExpression('neutral');
    } else {
        alertMessage = `Você completou o módulo com ${finalPercentage.toFixed(0)}% de acertos, Cérebro. Tente melhorar sua pontuação para desbloquear um desafio!`;
        updateMascotExpression('worried');
    }

    alert(alertMessage);

    if (challengeLevel) {
        startChallenge(challengeLevel);
    } else {
        displayModuleSelection();
    }
}


// --- Funções de Navegação ---
function goToNextExercise() {
    currentExerciseIndex++;
    displayExercise();
    hideFeedback();
    updateMascotExpression('animated');
}

function handleContinueClick() {
    goToNextExercise();
}

function goToHome() {
    siteExplanationScreen.classList.remove('hidden'); // Volta a mostrar a explicação
    displayModuleSelection(); // Mostra os módulos e esconde o conteúdo do módulo
    updateMascotExpression('thoughtful'); // Cérebro pensativo/confuso ao voltar para o menu
    currentModule = null;
    currentExerciseIndex = 0;
    currentModuleScore = 0;
    answeredCorrectlyInModule = 0;
    totalExercisesInModule = 0;
    clearInterval(challengeTimerInterval); // Para o timer do desafio se estiver rodando
    hideFeedback();
    hideChallengeFeedback();
}


// --- Funções do Desafio ---
let challengeTimerInterval;
let challengeTimeLeft;
let selectedChallengeWords = [];
let matchedChallengePairs = 0;
let challengeCurrentLevel = '';

function startChallenge(level) {
    moduleContentScreen.classList.add('hidden');
    challengeScreen.classList.remove('hidden');
    homeButton.classList.remove('hidden');
    
    challengeCurrentLevel = level;
    const challengeData = currentModule.desafios[level];
    if (!challengeData) {
        alert('Desafio não encontrado para este nível.');
        displayModuleSelection();
        return;
    }

    challengeTitle.textContent = `Desafio: ${level.toUpperCase()} - ${currentModule.titulo}`;
    challengeTimeLeft = challengeData.tempo_limite_segundos;
    timerDisplay.textContent = challengeTimeLeft;
    challengePairsContainer.innerHTML = '';
    selectedChallengeWords = [];
    matchedChallengePairs = 0;
    hideChallengeFeedback();

    const words = challengeData.palavras.map(p => ({ value: p.ingles, type: 'ingles' }));
    const translations = challengeData.palavras.map(p => ({ value: p.portugues, type: 'portugues' }));
    
    const allChallengeItems = shuffleArray([...words, ...translations]);

    allChallengeItems.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('challenge-item', item.type === 'ingles' ? 'challenge-word' : 'challenge-translation');
        div.textContent = item.value;
        div.dataset.value = item.value;
        div.dataset.type = item.type;
        div.addEventListener('click', () => selectChallengeItem(div, item.value, item.type));
        challengePairsContainer.appendChild(div);
    });

    startChallengeTimer();
}

function selectChallengeItem(element, value, type) {
    if (element.classList.contains('matched')) return;

    playSound('buttonClick');

    challengePairsContainer.querySelectorAll(`.challenge-item.${type}.selected`).forEach(el => {
        el.classList.remove('selected');
        selectedChallengeWords = selectedChallengeWords.filter(item => item.element !== el);
    });

    element.classList.add('selected');
    selectedChallengeWords.push({ element, value, type });

    if (selectedChallengeWords.length === 2 && selectedChallengeWords[0].type !== selectedChallengeWords[1].type) {
        const item1 = selectedChallengeWords[0];
        const item2 = selectedChallengeWords[1];

        let isMatch = false;
        const challengeWords = currentModule.desafios[challengeCurrentLevel].palavras;
        for (const pair of challengeWords) {
            if ((item1.value === pair.ingles && item2.value === pair.portugues) ||
                (item1.value === pair.portugues && item2.value === pair.ingles)) {
                isMatch = true;
                break;
            }
        }
        
        if (isMatch) {
            item1.element.classList.add('matched');
            item2.element.classList.add('matched');
            item1.element.classList.remove('selected');
            item2.element.classList.remove('selected');
            matchedChallengePairs++;
            playSound('correct');
            updateMascotExpression('happy');

            if (matchedChallengePairs === currentModule.desafios[challengeCurrentLevel].palavras.length) {
                endChallenge(true);
            }
        } else {
            item1.element.classList.add('incorrect');
            item2.element.classList.add('incorrect');
            playSound('incorrect');
            updateMascotExpression('confused');

            setTimeout(() => {
                item1.element.classList.remove('selected', 'incorrect');
                item2.element.classList.remove('selected', 'incorrect');
            }, 700);
        }
        selectedChallengeWords = [];
    } else if (selectedChallengeWords.length === 2 && selectedChallengeWords[0].type === selectedChallengeWords[1].type) {
        selectedChallengeWords[0].element.classList.remove('selected');
        selectedChallengeWords.shift();
        updateMascotExpression('thoughtful');
    }
}


function startChallengeTimer() {
    clearInterval(challengeTimerInterval);
    challengeTimerInterval = setInterval(() => {
        challengeTimeLeft--;
        timerDisplay.textContent = challengeTimeLeft;
        if (challengeTimeLeft <= 10 && challengeTimeLeft > 0) {
            playSound('timerUrgent');
        } else if (challengeTimeLeft > 0) {
            playSound('timerTick');
        }

        if (challengeTimeLeft <= 0) {
            clearInterval(challengeTimerInterval);
            endChallenge(false);
        }
    }, 1000);
}

function endChallenge(success) {
    clearInterval(challengeTimerInterval);
    if (success) {
        challengeFeedbackText.textContent = `Parabéns, Cérebro! Você completou o desafio!`;
        updateMascotExpression('proud');
        playSound('moduleComplete');
    } else {
        challengeFeedbackText.textContent = `Tempo esgotado, Cérebro! Ou você não pareou tudo. Tente novamente!`;
        updateMascotExpression('sad');
        playSound('incorrect');
    }
    challengeFeedbackArea.classList.remove('hidden');
    challengeRestartBtn.classList.remove('hidden');
    challengeBackToModulesBtn.classList.remove('hidden');
}

function hideChallengeFeedback() {
    challengeFeedbackArea.classList.add('hidden');
    challengeRestartBtn.classList.add('hidden');
    challengeBackToModulesBtn.classList.add('hidden');
    challengeFeedbackText.textContent = '';
}

// --- Funções Utilitárias ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


// --- Event Listeners ---
nextExerciseBtn.addEventListener('click', goToNextExercise);
checkAnswerBtn.addEventListener('click', checkAnswer);
continueBtn.addEventListener('click', handleContinueClick);
challengeRestartBtn.addEventListener('click', () => {
    startChallenge(challengeCurrentLevel); 
});
challengeBackToModulesBtn.addEventListener('click', displayModuleSelection);
homeButton.addEventListener('click', goToHome);


// --- Inicialização ---
document.addEventListener('DOMContentLoaded', loadModuleData);