const languageMap = {
    "pt-BR": "𝗕𝗥",
    "en-US": "𝗨𝗦"
};

const languageFlagMap = {
    "pt-BR": "br",
    "en-US": "us"
};

const previousGuessTextMap = {
  'en-US': 'Previous guess',
  'pt-BR': 'Palpite anterior'
};

function updatePreviousGuessTextDisplay(guess, lang) {
  const label = previousGuessTextMap[lang] || previousGuessTextMap['en-US'];
  const display = guess ? `${label}: ${guess}` : `${label}: —`;
  document.getElementById('previousGuessText').textContent = display;
}

let currentLang = "en-US";
let inputDigits = ["", "", ""];
let currentIndex = 0;
let tentativas = 0;
let numeroSecreto = Math.floor(Math.random() * 100) + 1;
const maxTentativas = 10;
let ultimoPalpite = "";

const languageBtn = document.getElementById("currentLanguage");
const languageMenu = document.getElementById("languageOptions");
const digitBoxes = document.querySelectorAll(".digit");
const mensagem = document.getElementById("message");
const tentativasRestantes = document.getElementById("remainingAttempts");
const setaCima = document.getElementById("arrowUp");
const setaBaixo = document.getElementById("arrowDown");
const remainingAttemptsText = {
  'en-US': 'Remaining attempts',
  'pt-BR': 'Tentativas restantes'
};

function updateRemainingAttemptsDisplay(attemptsLeft, lang) {
  const text = remainingAttemptsText[lang] || remainingAttemptsText['en-US'];
  document.getElementById('remainingAttempts').textContent = `${text}: ${attemptsLeft}`;
}

const textos = {
    "pt-BR": {
        titulo: "NUMBLER",
        instrucao: "Tente adivinhar o número secreto entre 1 e 100. Você tem 10 tentativas!",
        enter: "ENTER",
        jogarNovamente: "Jogar Novamente",
        tentativas: "Tentativas restantes: ",
        perdeu: numero => `Você perdeu! O número secreto era <strong>${numero}</strong>.`,
        acertou: (numero, tentativas) =>
            `Parabéns! Você acertou o número <strong>${numero}</strong> com <strong>${tentativas}</strong> tentativa(s).`,
        maior: "O número secreto é maior!",
        menor: "O número secreto é menor!",
        invalido: "Digite um número entre 001 e 100.",
        vazio: "Você não digitou nenhum número.",
        exemplo: "Exemplos",
        dicaExemplo: "O número é <strong>maior</strong> que 21.",
        comoJogarTitulo: "Como Jogar",
        comoJogarSub: "Adivinhe o Numbler em 10 tentativas.",
        dica1: "Cada palpite deve ser um número entre 1 e 100.",
        dica2: "As setas indicam se o número secreto é maior ou menor que seu palpite.",
        palpiteAnterior: palpite => palpite ? `Palpite anterior: ${palpite}` : "Palpite anterior: —"
    },
    "en-US": {
        titulo: "NUMBLER",
        instrucao: "Try to guess the secret number between 1 and 100. You have 10 attempts!",
        enter: "ENTER",
        jogarNovamente: "Play Again",
        tentativas: "Remaining attempts: ",
        perdeu: numero => `You lost! The secret number was <strong>${numero}</strong>.`,
        acertou: (numero, tentativas) =>
            `Congratulations! You guessed the number <strong>${numero}</strong> in <strong>${tentativas}</strong> attempt(s).`,
        maior: "The secret number is higher!",
        menor: "The secret number is lower!",
        invalido: "Enter a number between 001 and 100.",
        vazio: "You haven't entered a number.",
        exemplo: "Examples",
        dicaExemplo: "The number is <strong>bigger</strong> than 21.",
        comoJogarTitulo: "How To Play",
        comoJogarSub: "Guess the Numbler in 10 tries.",
        dica1: "Each guess has to be a number between 1 and 100.",
        dica2: "The arrows indicate if the secret number is higher or lower than your guess.",
        palpiteAnterior: palpite => palpite ? `Previous guess: ${palpite}` : "Previous guess: —"
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang && textos[savedLang]) {
        currentLang = savedLang;
    }
    languageBtn.innerHTML = `<span class="fi fi-${languageFlagMap[currentLang]}"></span>${languageMap[currentLang]}`;
    atualizarIdioma(currentLang);
    atualizarCaixa();
    atualizarPalpiteAnterior(ultimoPalpite);
    atualizarTentativasRestantes(); // keep this
});

languageBtn.addEventListener("click", () => {
    languageMenu.classList.toggle("hidden");
});

languageMenu.querySelectorAll("li").forEach(item => {
    item.addEventListener("click", () => {
        const selectedLang = item.getAttribute("data-lang");
        if (selectedLang && textos[selectedLang]) {
            localStorage.setItem("selectedLanguage", selectedLang);
            location.reload();
        }
    });
});

function atualizarIdioma(lang) {
    const t = textos[lang];
    document.querySelector("h1").textContent = t.titulo;
    document.querySelector(".container p").textContent = t.instrucao;
    document.getElementById("enter").textContent = t.enter;
    atualizarTentativasRestantes();
    mensagem.textContent = "";

    // ✅ Modal localization
    const modalTitle = document.querySelector("#howToPlayModal h2");
    const modalSubtitle = document.querySelector("#howToPlayModal p");
    const modalList = document.querySelector("#howToPlayModal ul");

    if (modalTitle) modalTitle.textContent = t.comoJogarTitulo;
    if (modalSubtitle) modalSubtitle.textContent = t.comoJogarSub;
    if (modalList) {
        modalList.innerHTML = `
            <li>${t.dica1}</li>
            <li>${t.dica2}</li>
        `;
    }
}

function atualizarTentativasRestantes() {
    const t = textos[currentLang];
    tentativasRestantes.textContent = `${t.tentativas}${maxTentativas - tentativas}`;
}

function atualizarCaixa() {
    digitBoxes.forEach((box, i) => {
        const valor = inputDigits[i];
        box.textContent = valor;
        box.classList.toggle("filled", valor !== "");
    });
}

function atualizarPalpiteAnterior(palpite) {
    const t = textos[currentLang];
    const el = document.getElementById("previousGuessText");
    if (el) el.textContent = t.palpiteAnterior(palpite);
}

function animarDigito(index) {
    const box = digitBoxes[index];
    box.classList.remove("pulsar");
    void box.offsetWidth;
    box.classList.add("pulsar");
}

function animarSeta(seta) {
    const classe = seta === setaCima ? "up-animate" : "down-animate";
    seta.classList.remove(classe);
    void seta.offsetWidth;
    seta.classList.add(classe);
    setTimeout(() => seta.classList.remove(classe), 600);
}

function animarShake() {
    digitBoxes.forEach(box => {
        box.classList.add("shake");
        setTimeout(() => box.classList.remove("shake"), 400);
    });
}

function mostrarResultadoModal(mensagemFinal) {
    const resultModal = document.getElementById("resultModal");
    const resultMessage = document.getElementById("resultMessage");
    const playAgainBtn = document.getElementById("playAgainBtn");

    setTimeout(() => {
        resultMessage.innerHTML = mensagemFinal;
        resultModal.classList.add('active');
        resultModal.focus();
    }, 1000);

    playAgainBtn.addEventListener("click", () => {
        location.reload();
    });
}

function chutarNumero() {
    const t = textos[currentLang];

    if (inputDigits.every(d => d === "")) {
        mensagem.textContent = t.vazio;
        mensagem.style.color = "#ea7980";
        mensagem.style.fontWeight = "bold";
        animarShake();
        return;
    }

    const palpite = parseInt(inputDigits.join(""));

    if (isNaN(palpite) || palpite < 1 || palpite > 100) {
        mensagem.textContent = t.invalido;
        mensagem.style.color = "#ea7980";
        mensagem.style.fontWeight = "bold";
        animarShake();
        return;
    }

    mensagem.style.color = "";
    mensagem.style.fontWeight = "";

    tentativas++;
    ultimoPalpite = palpite;
    atualizarPalpiteAnterior(ultimoPalpite);
    atualizarTentativasRestantes();

    if (palpite === numeroSecreto) {
        digitBoxes.forEach(box => {
            box.classList.add("flip");
            if (box.textContent.trim() !== "") {
                box.classList.add("correct");
            }
        });
        desativarJogo();
        mostrarResultadoModal(t.acertou(numeroSecreto, tentativas));
    } else if (tentativas >= maxTentativas) {
        digitBoxes.forEach(box => {
            box.classList.add("flip");
            if (box.textContent.trim() !== "") {
                box.classList.add("wrong");
            }
        });
        desativarJogo();
        mostrarResultadoModal(t.perdeu(numeroSecreto));
    } else {
        mensagem.textContent = palpite < numeroSecreto ? t.maior : t.menor;
        if (palpite < numeroSecreto) animarSeta(setaCima);
        else animarSeta(setaBaixo);

        digitBoxes.forEach((box, i) => {
            box.classList.add("flip");
            setTimeout(() => {
                inputDigits[i] = "";
                atualizarCaixa();
            }, 200);
            setTimeout(() => box.classList.remove("flip"), 400);
        });
        currentIndex = 0;
    }
}

function limparPalpite() {
    inputDigits = ["", "", ""];
    currentIndex = 0;
    atualizarCaixa();
}

function desativarJogo() {
    document.removeEventListener("keydown", capturarTecla);
    document.querySelectorAll(".key").forEach(btn => btn.disabled = true);
}

function inserirNumero(tecla) {
    if (!/^[0-9]$/.test(tecla)) return;
    if (currentIndex >= 3) return;

    inputDigits[currentIndex] = tecla;
    animarDigito(currentIndex);
    currentIndex++;
    atualizarCaixa();
}

function removerNumero() {
    if (currentIndex > 0) {
        currentIndex--;
        inputDigits[currentIndex] = "";
        atualizarCaixa();
    }
}

function capturarTecla(e) {
    const modal = document.getElementById('howToPlayModal');
    if (modal.classList.contains('active')) return;

    const tecla = e.key;
    if (tecla === "Enter") return chutarNumero();
    if (tecla === "Backspace") return removerNumero();
    inserirNumero(tecla);
}

document.addEventListener("keydown", capturarTecla);

document.querySelectorAll(".key").forEach(btn => {
    btn.addEventListener("click", () => {
        const modal = document.getElementById('howToPlayModal');
        if (modal.classList.contains('active')) return;

        if (btn.id === "backspace") {
            removerNumero();
        } else if (
            btn.id === "enter" ||
            btn.textContent === "Play Again" ||
            btn.textContent === "Jogar Novamente"
        ) {
            chutarNumero();
        } else {
            inserirNumero(btn.textContent);
        }
    });
});

// Modal logic
const modal = document.getElementById('howToPlayModal');
const openBtn = document.getElementById('howToPlayBtn');
const closeBtn = modal.querySelector('.close-btn');

openBtn.addEventListener("click", () => {
    modal.classList.add('active');
    modal.focus();
});

closeBtn.addEventListener("click", () => {
    modal.classList.remove('active');
    openBtn.focus();
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        openBtn.focus();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        openBtn.focus();
    }
});