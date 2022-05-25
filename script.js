let main = document.querySelector('.main'); //звоним игровому полю
const scoreElem = document.getElementById('score'); //звоним счету
const levelElem = document.getElementById('level'); //звоним уровню
const nextTetroElem = document.getElementById('next-tetro'); //звоним полю со следующей фигурой
const startBtn = document.getElementById('start'); //звоним кнопке старта
const pauseBtn = document.getElementById('pause'); //звоним кнопке паузы
const gameOver = document.getElementById('game-over'); //звоним окну геймовера

let score = 0; //счет очков
let currentLevel = 1; //уровни
let isPaused = true; //флаг остановки игры
let gameTimerID; //таймер падения фигур

//возможные уровни
let possibleLevels = {
    1: {
        scorePerLine: 10, //кол-во очков за заполнения одной линии
        speed: 400, //скорость падения фигур
        nextLevelScore: 100 //кол-во очков для перехода на следующий уровень
    },
    2: {
        scorePerLine: 15,
        speed: 300,
        nextLevelScore: 500
    },
    3: {
        scorePerLine: 20,
        speed: 200,
        nextLevelScore: 1000
    },
    4: {
        scorePerLine: 30,
        speed: 100,
        nextLevelScore: 2000
    },
    5: {
        scorePerLine: 50,
        speed: 50,
        nextLevelScore: Infinity
    },
};

//игровое поле
let playfield = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

//возможные фигуры
let figures = {
    O: [
        [1, 1],
        [1, 1]
    ],
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    L: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    J: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ]
};

//активная фигура
let activeTetro = getNewTetro();
//отображаем следующую фигуру
let nextTetro = getNewTetro();

//отрисовка игрового поля
function draw() {
    let mainInnerHTML = '';
    //циклы отрисовки игрового поля 
    //цикл прохода по вертикали
    for (let y = 0; y < playfield.length; y++) {
        //цикл прохода по горизонтали
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                mainInnerHTML += '<div class = "cell movingCell"></div>'; //рисуем движущуюся ячейку
            } else if (playfield[y][x] === 2) {
                mainInnerHTML += '<div class = "cell fixedCell"></div>'; //рисуем зафиксированную ячейку
            } else {
                mainInnerHTML += '<div class = "cell"></div>'; //рисуем пустую ячейку
            }

        }
    }
    main.innerHTML = mainInnerHTML; //кидаем в html отрисованное поле
};

//показ следующей фигуры
function drawNextTetro() {
    let nextTetroInnerHTML = '';
    for (let y = 0; y < nextTetro.shape.length; y++) {
        for (let x = 0; x < nextTetro.shape[y].length; x++) {
            if (nextTetro.shape[y][x]) {
                nextTetroInnerHTML += '<div class = "cell movingCell"></div>';
            } else {
                nextTetroInnerHTML += '<div class = "cell"></div>';
            }
        }
        nextTetroInnerHTML += '<br/>';
    }
    nextTetroElem.innerHTML = nextTetroInnerHTML; //кидаем в html следующую фигуру
};

//удаляем предыдущее положение фигуры
function removePrevActiveTetro() {
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                playfield[y][x] = 0;
            }
        }
    }
};

//добавляем активную фигуру
function addActiveTetro() {
    removePrevActiveTetro()
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if (activeTetro.shape[y][x] === 1) {
                playfield[activeTetro.y + y][activeTetro.x + x] = activeTetro.shape[y][x];
            }
        }
    }
};

//вращения фигуры
function rotateTetro() {
    //константа предыдщуего состояния фигуры
    const prevTetroState = activeTetro.shape;
    //добавляем вращение массива
    activeTetro.shape = activeTetro.shape[0].map((val, index) =>
        activeTetro.shape.map((row) => row[index]).reverse());
    if (hasCollision()) {
        activeTetro.shape = prevTetroState; //если поворот невозможен, возвращаем предыдущее состояние фигуры
    }
};

//проверка на столкновения с краем поля или зафиксированными фигурами
function hasCollision() {
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if (activeTetro.shape[y][x] && (playfield[activeTetro.y + y] === undefined ||
                playfield[activeTetro.y + y][activeTetro.x + x] === undefined ||
                playfield[activeTetro.y + y][activeTetro.x + x] === 2)) {
                return true; //если происходит столкновение возвращаем true
            }
        }
    }
    return false; //если столкновений нет возвращаем false
};

//удаление заполненного ряда
function removeFullLines() {
    let canRemovLine = true; //флаг возможности удаления линии
    let filledLines = 0; //количество заполненных линий для бонуса к счету, если более 1 за раз
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] !== 2) {
                canRemovLine = false; //если линия не заполнена не удаляем
                break; //и выходим из проверки
            }
        }
        if (canRemovLine) {
            //если в ряду все ячейки фиксированные, удаляем линию и рисуем вместо нее пустую
            playfield.splice(y, 1); //удаляем
            playfield.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //рисуем пустую линию
            filledLines += 1; //увеличиваем счетчик удаленных линий
        }
        canRemovLine = true;
    }

    //считаем очки в зависимости от количества заполненных линий за раз
    switch (filledLines) {
        case 1:
            //если удалили одну линию за раз
            score += possibleLevels[currentLevel].scorePerLine;
            break;
        case 2:
            //две
            score += possibleLevels[currentLevel].scorePerLine * 3;
            break;
        case 3:
            //три
            score += possibleLevels[currentLevel].scorePerLine * 6;
            break;
        case 4:
            //четыре
            score += possibleLevels[currentLevel].scorePerLine * 12;
            break;
    };
    //кидаем итоговый счет в html
    scoreElem.innerHTML = score;

    //если достигли определенного кол-ва очков, переходим на следующий уровень
    if (score >= possibleLevels[currentLevel].nextLevelScore) {
        currentLevel++;
        levelElem.innerHTML = currentLevel; //кидаем текущий уровень в html
    }
};

//генератор новых фигур
function getNewTetro() {
    const possibleFigures = 'OISZLJT'; //набор всех возможных фигур
    const rand = Math.floor(Math.random() * 7); //рандомный выбор индекса фигуры из возможных
    const newTetro = figures[possibleFigures[rand]]; //полученная фигура
    return {
        x: Math.floor((10 - newTetro[0].length) / 2), //координата по X
        y: 0, //координата по Y
        shape: newTetro //какой вид у фигуры
    };
};

//проверка - если фигура не двигается дальше, делаем ее фиксированной
function fixTetra() {
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield[y][x] === 1) {
                playfield[y][x] = 2; //если фигура дошла до границ поля или другой фигуры - фиксируем ее
            }
        }
    }
};

//движения фигур вниз
function moveTetroDown() {
    activeTetro.y += 1;
    if (hasCollision()) {
        //если фигура столкнулась с границей поля или другой фигурой возвращаем ее предыдущее положение
        activeTetro.y -= 1;
        //затем фиксируем фигуру
        fixTetra();
        //проверяем заполнена ли линия, если да, то удаляем 
        removeFullLines();
        //вызываем новую фигуру
        activeTetro = nextTetro;
        if (hasCollision()) {
            //если новую фигуру вызвать нельзя, завершаем игру
            reset();
        }
        nextTetro = getNewTetro();
    }
};

//падение фигуры по нажатию пробела
function dropTetro() {
    for (let y = activeTetro.y; y < playfield.length; y++) {
        activeTetro.y += 1; //перемещаем фигуру вниз до конца
        if (hasCollision()) {
            activeTetro.y -= 1;
            break;
        }
    }
};

//сброса игрового поля
function reset() {
    //ставим на паузу
    isPaused = true;
    //сбрасываем таймер
    clearTimeout(gameTimerID);
    //рисуем чистое поле
    playfield = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    draw(); //рисуем новое игровое поле
    gameOver.style.display = 'block'; //отображаем Game Over
}

//функция обновления состояния игрового поля
function updateGame() {
    if (!isPaused) {
        //если не на паузе
        addActiveTetro(); //добавляем активную фигуру
        draw(); //рисуем поле с активной фигурой
        drawNextTetro(); //рисуем следующую фигуру
    }
};

//добавляем управление
document.onkeydown = function (e) {
    if (!isPaused) {
        if (e.keyCode === 37) {
            //двигаем фигуру влево
            activeTetro.x -= 1;
            if (hasCollision()) {
                //если фигура столкнулась с чем-то, возвращаем прошлую координату
                activeTetro.x += 1;
            }
        } else if (e.keyCode === 39) {
            //двигаем фигуру вправо
            activeTetro.x += 1;
            if (hasCollision()) {
                activeTetro.x -= 1;
            }
        } else if (e.keyCode === 40) {
            //ускоряем фигуру
            moveTetroDown();
        } else if (e.keyCode === 38) {
            //вращение фигуры
            rotateTetro();
        } else if (e.keyCode === 32) {
            //падение фигуры при нажатии пробела
            dropTetro();
        }
        updateGame();
    }
};

//ставим игру на паузу по кнопке
pauseBtn.addEventListener('click', (e) => {
    if (e.target.innerHTML === 'Pause') {
        e.target.innerHTML = 'Continue'; //после нажатия кнопки меняем ее название с Pause на Continue
        clearTimeout(gameTimerID); //останавливаем таймер
    } else {
        e.target.innerHTML = 'Pause'; //после повторного нажатия меняем название кнопки обратно
        gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed); //и запускаем таймер
    }
    isPaused = !isPaused; //продолжаем саму игру изменив флаг паузы
});

//начинаем игру по кнопке старта
startBtn.addEventListener('click', (e) => {
    e.target.innerHTML = 'Start Again'; //меняем название кнопки
    gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed); //запускаем таймер
    isPaused = false; //убираем флаг паузы игры
    gameOver.style.display = 'none'; //убираем отображение Game Over
});

scoreElem.innerHTML = score; //кидаем текущие очки в игре в html
levelElem.innerHTML = currentLevel; //кидаем текущий уровень в игре в html

draw(); //отрисовывем поле 

//начало игры
function startGame() {
    moveTetroDown(); //двигаем фигуру вниз
    if (!isPaused) {
        //если не на паузе
        updateGame(); //обновляем состояние игры
        gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed); //запускаем таймер
    }
};

