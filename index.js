const modal = document.querySelector("#modal");
const gameContent = document.querySelector("#gameContent");
const modalTitle = document.querySelector("#modalTitle");
const modalEyebrow = document.querySelector("#modalEyebrow");
const closeModal = document.querySelector("#closeModal");

let reactionTimer;
let reactionStart = 0;
let reactionState = "idle";

let targetInterval;
let targetCountdown;


// Открытие игрового окна

function openGame(title, eyebrow, html) {
    modalTitle.textContent = title;
    modalEyebrow.textContent = eyebrow;

    gameContent.innerHTML = html;

    modal.classList.add("open");
}


// Закрытие игрового окна

function closeGame() {
    modal.classList.remove("open");

    clearTimeout(reactionTimer);
    clearInterval(targetInterval);
    clearInterval(targetCountdown);
}

closeModal.addEventListener("click", closeGame);

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeGame();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeGame();
    }
});


// Выбор игры

document.querySelectorAll("[data-game]").forEach(button => {

    button.addEventListener("click", () => {

        const game = button.dataset.game;

        if (game === "reaction") {
            startReaction();
        }

        if (game === "guess") {
            startGuess();
        }

        if (game === "target") {
            startTarget();
        }

    });

});


// ИГРА 1. ПРОВЕРКА РЕАКЦИИ

function startReaction() {

    reactionState = "idle";

    openGame(
        "Проверь реакцию",
        "ИГРА 01 · РЕАКЦИЯ",
        `
        <div class="game-panel">

            <p id="reactionMessage">
                Нажми кнопку, затем дождись зелёного сигнала.
                Не торопись!
            </p>

            <button class="big-button" id="reactionButton">
                Начать
            </button>

            <p class="result-text" id="reactionResult"></p>

        </div>
        `
    );

    const button = document.querySelector("#reactionButton");
    const message = document.querySelector("#reactionMessage");
    const result = document.querySelector("#reactionResult");

    button.addEventListener("click", () => {

        if (reactionState === "idle" || reactionState === "done") {

            reactionState = "waiting";

            button.className = "big-button waiting";
            button.textContent = "Жди зелёный...";

            message.textContent = "Не нажимай раньше времени!";
            result.textContent = "";

            reactionTimer = setTimeout(() => {

                if (!modal.classList.contains("open")) return;

                reactionState = "go";

                button.className = "big-button go";
                button.textContent = "ЖМИ!";

                reactionStart = performance.now();

            }, 1500 + Math.random() * 3000);

        }

        else if (reactionState === "waiting") {

            clearTimeout(reactionTimer);

            reactionState = "done";

            button.className = "big-button";
            button.textContent = "Попробовать ещё";

            result.textContent = "Слишком рано! Попробуй ещё раз.";

        }

        else if (reactionState === "go") {

            const time = Math.round(
                performance.now() - reactionStart
            );

            reactionState = "done";

            button.className = "big-button";
            button.textContent = "Ещё раз";

            result.textContent = `Твоя реакция: ${time} мс`;

            message.textContent = time < 250
                ? "Отличная реакция!"
                : "Неплохо. Можно попробовать быстрее!";

        }

    });

}


// ИГРА 2. УГАДАЙ ЧИСЛО

function startGuess() {

    const secret = Math.floor(Math.random() * 100) + 1;

    let attempts = 0;

    openGame(
        "Секретное число",
        "ИГРА 02 · ЛОГИКА",
        `
        <div class="game-panel">

            <p>
                Я загадал число от 1 до 100.
                У тебя неограниченное количество попыток.
            </p>

            <form class="guess-form" id="guessForm">

                <input
                    class="number-input"
                    id="guessInput"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="?"
                    required
                >

                <button class="action-button" type="submit">
                    Проверить
                </button>

            </form>

            <p class="result-text" id="guessResult">
                Введи число и попробуй угадать.
            </p>

            <p id="attemptsText">Попыток: 0</p>

        </div>
        `
    );

    const form = document.querySelector("#guessForm");
    const input = document.querySelector("#guessInput");

    const result = document.querySelector("#guessResult");
    const attemptsText = document.querySelector("#attemptsText");

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        const value = Number(input.value);

        if (
            !Number.isInteger(value) ||
            value < 1 ||
            value > 100
        ) {

            result.textContent = "Введи целое число от 1 до 100.";

            return;

        }

        attempts++;

        attemptsText.textContent = `Попыток: ${attempts}`;

        if (value === secret) {

            result.textContent =
                `Верно! Ты угадал(а) за ${attempts} попыток. ✨`;

            input.disabled = true;

            form.querySelector("button").disabled = true;

        }

        else if (value < secret) {

            result.textContent = "Моё число больше ↑";

        }

        else {

            result.textContent = "Моё число меньше ↓";

        }

        input.select();

    });

}


// ИГРА 3. ПОЙМАЙ КРУЖОК

function startTarget() {

    let score = 0;
    let time = 10;

    openGame(
        "Поймай кружок",
        "ИГРА 03 · ВНИМАНИЕ",
        `
        <div class="game-panel">

            <div class="score-line">

                <span id="targetScore">Очки: 0</span>

                <span id="targetTime">Время: 10</span>

            </div>

            <div class="target-zone" id="targetZone">

                <p style="padding-top:85px">
                    Нажми «Старт»
                </p>

            </div>

            <button class="action-button" id="targetStart">
                Старт
            </button>

            <p class="result-text" id="targetResult">
                Попробуй поймать как можно больше кружков.
            </p>

        </div>
        `
    );

    const zone = document.querySelector("#targetZone");

    const scoreText = document.querySelector("#targetScore");
    const timeText = document.querySelector("#targetTime");

    const result = document.querySelector("#targetResult");
    const start = document.querySelector("#targetStart");


    start.addEventListener("click", () => {

        clearInterval(targetInterval);
        clearInterval(targetCountdown);

        score = 0;
        time = 10;

        scoreText.textContent = "Очки: 0";
        timeText.textContent = "Время: 10";

        result.textContent = "Лови!";

        start.disabled = true;

        zone.innerHTML = "";


        function moveDot() {

            zone.innerHTML = "";

            const dot = document.createElement("button");

            dot.className = "target-dot";

            dot.setAttribute("aria-label", "Поймать кружок");

            dot.style.left =
                `${Math.random() * (zone.clientWidth - 42)}px`;

            dot.style.top =
                `${Math.random() * (zone.clientHeight - 42)}px`;


            dot.addEventListener("click", () => {

                score++;

                scoreText.textContent = `Очки: ${score}`;

                moveDot();

            });

            zone.append(dot);

        }


        moveDot();

        targetInterval = setInterval(moveDot, 950);


        targetCountdown = setInterval(() => {

            time--;

            timeText.textContent = `Время: ${time}`;

            if (time <= 0) {

                clearInterval(targetInterval);
                clearInterval(targetCountdown);

                zone.innerHTML = `
                    <p style="padding-top:85px">
                        Раунд завершён!
                    </p>
                `;

                result.textContent =
                    `Твой результат: ${score} очков.`;

                start.disabled = false;

            }

        }, 1000);

    });

}


// ПЕРЕКЛЮЧЕНИЕ ТЕМЫ

const themeButton = document.querySelector("#themeButton");

const savedTheme = localStorage.getItem("playroom-theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

}

themeButton.textContent =
    document.body.classList.contains("dark") ? "☀" : "☾";


themeButton.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const theme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem("playroom-theme", theme);

    themeButton.textContent =
        theme === "dark" ? "☀" : "☾";

});


// СЛУЧАЙНОЕ ЗАДАНИЕ ДНЯ

const tasks = [

    "Включи любимую песню и потанцуй хотя бы 30 секунд.",

    "Найди вокруг себя предмет самого необычного цвета.",

    "Сделай 10 шагов назад, а затем 10 вперёд. Просто так.",

    "Напиши кому-нибудь приятное сообщение.",

    "Придумай смешное название сегодняшнему дню.",

    "Посмотри в окно и найди три красивые детали.",

    "Устрой себе минуту без телефона."

];


document.querySelector("#newTaskButton").addEventListener("click", () => {

    const randomIndex = Math.floor(Math.random() * tasks.length);

    const task = tasks[randomIndex];

    document.querySelector("#dailyTask").textContent = task;

});