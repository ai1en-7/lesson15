
// ДОБАВЛЯЕМ СТИЛИ НОВЫХ ИГР

const style = document.createElement("style");

style.textContent = `
    .extra-games {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 25px;
        margin-top: 25px;
    }

    .extra-game {
        background: var(--card, white);
        border: 1px solid var(--border, #eee);
        border-radius: 15px;
        padding: 20px;
    }

    .extra-visual {
        height: 130px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        font-size: 45px;
        background: #e9e5ff;
        margin-bottom: 18px;
    }

    .extra-game p {
        margin: 10px 0;
    }

    .extra-game button,
    .game-action {
        background: #7778df;
        color: white;
        border: none;
        padding: 12px 18px;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 12px;
    }

    .new-game {
        padding: 20px;
        border-radius: 15px;
        background: var(--bg, #f5f6fa);
        margin-top: 15px;
    }

    .new-game button {
        padding: 12px 17px;
        margin: 5px;
        border: none;
        border-radius: 10px;
        background: #7778df;
        color: white;
        cursor: pointer;
    }

    .new-game input {
        padding: 12px;
        width: 100px;
        border-radius: 8px;
        border: 1px solid #aaa;
        text-align: center;
    }

    .reaction-box {
        padding: 60px 10px;
        background: #e88c8c;
        color: white;
        border-radius: 12px;
        cursor: pointer;
    }

    .reaction-box.ready {
        background: #48b987;
    }

    .clicker-box {
        height: 230px;
        background: var(--card, white);
        position: relative;
        overflow: hidden;
        border-radius: 12px;
        margin-top: 15px;
    }

    .target-circle {
        position: absolute;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #7778df;
        border: 3px solid #c5c5ff;
    }

    .memory-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        margin: 20px auto;
        max-width: 300px;
    }

    .memory-card {
        height: 60px;
        font-size: 25px;
        background: #e5e5ff;
        color: #333;
        border: none;
        border-radius: 8px;
    }

    .memory-card.matched {
        background: #c9efd9;
    }

    .rps-buttons {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    @media (max-width: 700px) {
        .extra-games {
            grid-template-columns: 1fr;
        }
    }
`;

document.head.appendChild(style);


// ТЕМА

const themeButton = document.querySelector("#themeButton");

let theme = localStorage.getItem("playroom-theme");

if (theme === "dark") {
    document.body.classList.add("dark");
    themeButton.textContent = "☀";
}

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("playroom-theme", "dark");
        themeButton.textContent = "☀";
    } else {
        localStorage.setItem("playroom-theme", "light");
        themeButton.textContent = "☾";
    }
});


// АВТОМАТИЧЕСКИ ДОБАВЛЯЕМ ДВЕ НОВЫЕ ИГРЫ

const gameGrid = document.querySelector(".game-grid");

gameGrid.insertAdjacentHTML("beforeend", `
    <article class="game-card">
        <div class="game-visual visual-reaction extra-visual">
            <span>✊</span>
        </div>

        <div class="game-info">
            <div class="card-meta">
                <span>04 / УДАЧА</span>
                <span class="tag">ДУЭЛЬ</span>
            </div>

            <h3>Камень, ножницы, бумага</h3>
            <p>Сразись с компьютером и набери больше очков.</p>

            <button class="game-button" data-game="rps">
                Играть →
            </button>
        </div>
    </article>

    <article class="game-card">
        <div class="game-visual visual-guess extra-visual">
            <span>🧠</span>
        </div>

        <div class="game-info">
            <div class="card-meta">
                <span>05 / ПАМЯТЬ</span>
                <span class="tag">ЛОГИКА</span>
            </div>

            <h3>Найди пару</h3>
            <p>Открывай карточки и ищи одинаковые картинки.</p>

            <button class="game-button" data-game="memory">
                Играть →
            </button>
        </div>
    </article>
`);


// ОТКРЫТИЕ И ЗАКРЫТИЕ ИГР

function openGame(title) {
    modalTitle.textContent = title;
    modalEyebrow.textContent = "МИНИ-ИГРА";
    modal.classList.add("open");
    gameContent.innerHTML = "";
}

function closeGame() {
    modal.classList.remove("open");
    gameContent.innerHTML = "";
}

closeModal.addEventListener("click", closeGame);

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeGame();
    }
});


// ВЫБОР ИГРЫ

document.querySelectorAll("[data-game]").forEach((button) => {
    button.addEventListener("click", () => {
        const game = button.dataset.game;

        if (game === "reaction") {
            openGame("⚡ Проверь реакцию");
            startReaction();
        }

        if (game === "guess") {
            openGame("🔢 Секретное число");
            startNumber();
        }

        if (game === "target") {
            openGame("🎯 Поймай кружок");
            startClicker();
        }

        if (game === "rps") {
            openGame("✊ Камень, ножницы, бумага");
            startRPS();
        }

        if (game === "memory") {
            openGame("🧠 Найди пару");
            startMemory();
        }
    });
});


// ИГРА 1. РЕАКЦИЯ

function startReaction() {
    gameContent.innerHTML = `
        <div class="new-game">
            <p id="reactionMessage">Нажми старт и жди зелёного цвета!</p>
            <div class="reaction-box" id="reactionBox">
                Нажми СТАРТ
            </div>
            <p id="reactionResult"></p>
            <button id="reactionStart">Старт</button>
        </div>
    `;

    const box = document.querySelector("#reactionBox");
    const start = document.querySelector("#reactionStart");
    const message = document.querySelector("#reactionMessage");
    const result = document.querySelector("#reactionResult");

    let timer;
    let startTime;
    let waiting = false;
    let ready = false;

    start.addEventListener("click", () => {
        clearTimeout(timer);

        waiting = true;
        ready = false;

        box.classList.remove("ready");
        box.textContent = "Жди...";
        message.textContent = "Не нажимай раньше времени!";
        result.textContent = "";

        timer = setTimeout(() => {
            ready = true;
            waiting = false;
            startTime = Date.now();

            box.classList.add("ready");
            box.textContent = "ЖМИ!";
        }, Math.random() * 3000 + 1500);
    });

    box.addEventListener("click", () => {
        if (ready) {
            const reaction = Date.now() - startTime;

            result.textContent = `Твоя реакция: ${reaction} мс`;
            box.textContent = "Отлично!";
            ready = false;
        } else if (waiting) {
            clearTimeout(timer);
            waiting = false;
            box.textContent = "Слишком рано!";
            message.textContent = "Попробуй ещё раз.";
        }
    });
}


// ИГРА 2. УГАДАЙ ЧИСЛО

function startNumber() {
    const secret = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;

    gameContent.innerHTML = `
        <div class="new-game">
            <p>Я загадал число от 1 до 100.</p>

            <input type="number" id="numberInput"
                placeholder="Число" min="1" max="100">

            <button id="guessBtn">Проверить</button>

            <p id="numberMessage"></p>
            <p id="attempts"></p>
        </div>
    `;

    const input = document.querySelector("#numberInput");
    const button = document.querySelector("#guessBtn");

    button.addEventListener("click", () => {
        const number = Number(input.value);
        const message = document.querySelector("#numberMessage");

        if (!input.value || number < 1 || number > 100) {
            message.textContent = "Введи число от 1 до 100!";
            return;
        }

        attempts++;

        if (number === secret) {
            message.textContent = "🎉 Правильно! Ты угадала!";
            button.disabled = true;
        } else if (number < secret) {
            message.textContent = "Моё число больше ↑";
        } else {
            message.textContent = "Моё число меньше ↓";
        }

        document.querySelector("#attempts").textContent =
            `Попыток: ${attempts}`;

        input.value = "";
    });
}


// ИГРА 3. ПОЙМАЙ КРУЖОК

function startClicker() {
    gameContent.innerHTML = `
        <div class="new-game">
            <h3>Очки: <span id="score">0</span></h3>
            <h3>Время: <span id="time">10</span></h3>

            <div class="clicker-box" id="clickerBox"></div>

            <button id="clickerStart">Начать игру</button>
        </div>
    `;

    const box = document.querySelector("#clickerBox");
    const scoreText = document.querySelector("#score");
    const timeText = document.querySelector("#time");
    const button = document.querySelector("#clickerStart");

    let score = 0;
    let time = 10;
    let active = false;

    button.addEventListener("click", () => {
        if (active) return;

        active = true;
        score = 0;
        time = 10;

        scoreText.textContent = score;
        timeText.textContent = time;
        button.disabled = true;

        function createTarget() {
            if (!active) return;

            box.innerHTML = `
                <button class="target-circle"
                    style="left:${Math.random() * 80 + 5}%;
                    top:${Math.random() * 75 + 5}%">
                </button>
            `;

            box.querySelector(".target-circle").addEventListener("click", () => {
                score++;
                scoreText.textContent = score;
                createTarget();
            });
        }

        createTarget();

        const timer = setInterval(() => {
            time--;
            timeText.textContent = time;

            if (time === 0) {
                clearInterval(timer);
                active = false;

                box.innerHTML = `<h3 style="padding:80px 10px">
                    Игра окончена! Очки: ${score}
                </h3>`;

                button.disabled = false;
                button.textContent = "Играть снова";
            }
        }, 1000);
    });
}


// ИГРА 4. КАМЕНЬ, НОЖНИЦЫ, БУМАГА

function startRPS() {
    let playerScore = 0;
    let computerScore = 0;

    gameContent.innerHTML = `
        <div class="new-game">
            <p>Выбери один вариант:</p>

            <div class="rps-buttons">
                <button data-choice="Камень">✊</button>
                <button data-choice="Ножницы">✌️</button>
                <button data-choice="Бумага">✋</button>
            </div>

            <p id="rpsResult">Сделай свой ход!</p>
            <h3 id="rpsScore">Ты: 0 | Компьютер: 0</h3>
        </div>
    `;

    const choices = ["Камень", "Ножницы", "Бумага"];

    document.querySelectorAll("[data-choice]").forEach((button) => {
        button.addEventListener("click", () => {
            const player = button.dataset.choice;

            const computer = choices[
                Math.floor(Math.random() * 3)
            ];

            let result = "";

            if (player === computer) {
                result = "Ничья!";
            } else if (
                (player === "Камень" && computer === "Ножницы") ||
                (player === "Ножницы" && computer === "Бумага") ||
                (player === "Бумага" && computer === "Камень")
            ) {
                result = "Ты победила! 🎉";
                playerScore++;
            } else {
                result = "Компьютер победил!";
                computerScore++;
            }

            document.querySelector("#rpsResult").innerHTML = `
                Ты: ${player}<br>
                Компьютер: ${computer}<br>
                <strong>${result}</strong>
            `;

            document.querySelector("#rpsScore").textContent =
                `Ты: ${playerScore} | Компьютер: ${computerScore}`;
        });
    });
}


// ИГРА 5. НАЙДИ ПАРУ

function startMemory() {
    const emojis = [
        "🐱", "🐶", "🐸", "🐼", "🦊", "🐰",
        "🐱", "🐶", "🐸", "🐼", "🦊", "🐰"
    ];

    let firstCard = null;
    let secondCard = null;
    let locked = false;
    let pairs = 0;
    let moves = 0;

    gameContent.innerHTML = `
        <div class="new-game">
            <p>Найди одинаковые карточки!</p>
            <p>Ходы: <span id="moves">0</span></p>
            <p>Пары: <span id="pairs">0</span>/6</p>

            <div class="memory-grid" id="memoryGrid"></div>

            <button id="memoryRestart">Начать заново</button>
        </div>
    `;

    const grid = document.querySelector("#memoryGrid");

    function createCards() {
        grid.innerHTML = "";

        firstCard = null;
        secondCard = null;
        locked = false;
        pairs = 0;
        moves = 0;

        document.querySelector("#moves").textContent = moves;
        document.querySelector("#pairs").textContent = pairs;

        const shuffled = [...emojis].sort(() => Math.random() - 0.5);

        shuffled.forEach((emoji) => {
            const card = document.createElement("button");

            card.className = "memory-card";
            card.textContent = "?";
            card.dataset.emoji = emoji;

            card.addEventListener("click", () => {
                if (
                    locked ||
                    card.classList.contains("matched") ||
                    card.classList.contains("open")
                ) return;

                card.textContent = emoji;
                card.classList.add("open");

                if (!firstCard) {
                    firstCard = card;
                    return;
                }

                secondCard = card;
                moves++;

                document.querySelector("#moves").textContent = moves;

                if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
                    firstCard.classList.add("matched");
                    secondCard.classList.add("matched");

                    firstCard = null;
                    secondCard = null;

                    pairs++;
                    document.querySelector("#pairs").textContent = pairs;

                    if (pairs === 6) {
                        setTimeout(() => {
                            if (modal.classList.contains("active")) {
                                grid.insertAdjacentHTML(
                                    "afterend",
                                    "<p>🎉 Ты нашла все пары!</p>"
                                );
                            }
                        }, 300);
                    }
                } else {
                    locked = true;

                    setTimeout(() => {
                        firstCard.textContent = "?";
                        secondCard.textContent = "?";

                        firstCard.classList.remove("open");
                        secondCard.classList.remove("open");

                        firstCard = null;
                        secondCard = null;
                        locked = false;
                    }, 800);
                }
            });

            grid.appendChild(card);
        });
    }

    document.querySelector("#memoryRestart").addEventListener(
        "click",
        createCards
    );

    createCards();
}


// ЗАДАНИЕ ДНЯ

const tasks = [
    "Сделай 10 приседаний.",
    "Послушай любимую песню.",
    "Выучи 5 новых английских слов.",
    "Прочитай 5 страниц книги.",
    "Выпей стакан воды.",
    "Сделай небольшую прогулку.",
    "Нарисуй что-нибудь за 2 минуты.",
    "Устрой себе 10 минут без телефона.",
    "Попробуй сделать что-то новое.",
    "Напиши три вещи, за которые ты благодарна."
];

const taskButton = document.querySelector("#newTaskButton");
const dailyTask = document.querySelector("#dailyTask");

taskButton.addEventListener("click", () => {
    const randomTask = tasks[
        Math.floor(Math.random() * tasks.length)
    ];

    dailyTask.textContent = randomTask;
});
