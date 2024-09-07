document.addEventListener('DOMContentLoaded', () => {
    const languageIcon = document.getElementById('language-icon');
    const languageDropdown = document.getElementById('language-dropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    const statusElement = document.getElementById('status');
    const flipButton = document.getElementById('flip');
    const countdownElement = document.getElementById('countdown');
    const progressBar = document.getElementById('progress-bar');
    const accuracyElement = document.getElementById('signal-accuracy'); // Исправлено здесь
    const gameField = document.getElementById('game-field');
    let currentLanguage = 'en';
    let isCooldownActive = false;
    let accuracy = '+86';
    let activeStars = []; // Массив для активных звёзд

    // Переводы для разных языков
    const translations = {
        ru: { status: 'VORTEX', flip: 'Получить Сигнал', countdown: 'Осталось:', wait: 'ЖДИТЕ...', accuracy: 'Точность:' },
        en: { status: 'VORTEX', flip: 'Get Signal', countdown: 'Remaining:', wait: 'WAIT...', accuracy: 'Signal Accuracy:' },
        hi: { status: 'VORTEX', flip: 'सिग्नल प्राप्त करें', countdown: 'सेकंड बचा:', wait: 'रुको...', accuracy: 'सटीकता:' },
        pt: { status: 'VORTEX', flip: 'Receber Sinal', countdown: 'Restante:', wait: 'AGUARDE...', accuracy: 'Precisão:' },
        es: { status: 'VORTEX', flip: 'Recibir Señal', countdown: 'Restantes:', wait: 'ESPERE...', accuracy: 'Precisión:' },
        tr: { status: 'VORTEX', flip: 'Sinyal Al', countdown: 'Kaldı:', wait: 'BEKLEYIN...', accuracy: 'Doğruluk:' }
    };

    // Обновление языка интерфейса
    function updateLanguage(lang) {
        const translation = translations[lang];
        statusElement.innerText = translation.status;
        flipButton.innerText = translation.flip;
        countdownElement.innerText = `${translation.countdown} 0s`;
        accuracyElement.innerText = `${translations[currentLanguage].accuracy || ''}${accuracy}%`;
    }

    // Функция для открытия/закрытия выпадающего списка выбора языка
    function toggleDropdown() {
        languageDropdown.classList.toggle('show');
    }

    languageIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleDropdown();
    });

    languageOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            event.preventDefault();
            const selectedLang = option.dataset.lang;
            languageIcon.src = option.src;
            currentLanguage = selectedLang;
            updateLanguage(currentLanguage);
            toggleDropdown();
        });
    });

    // Создание 5x5 игрового поля для Minesweeper
    const cells = [];
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell', i % 2 === 0 ? 'cell-even' : 'cell-odd');
        cells.push(cell);
        gameField.appendChild(cell);
    }

    // Функция для запуска обратного отсчёта с таймером и прогресс-баром
    function startCountdown(seconds) {
        console.log(`Countdown started for ${seconds} seconds`); // Логирование
        countdownElement.innerText = `${translations[currentLanguage].countdown} ${seconds}s`;
        let timeLeft = seconds * 1000;
        progressBar.style.width = '100%';

        const interval = setInterval(() => {
            timeLeft -= 1000;
            const progress = (timeLeft / (seconds * 1000)) * 100;
            progressBar.style.width = `${progress}%`;
            const secondsLeft = Math.ceil(timeLeft / 1000);
            countdownElement.innerText = `${translations[currentLanguage].countdown} ${secondsLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(interval);
                flipButton.disabled = false;
                isCooldownActive = false;
                countdownElement.innerText = `${translations[currentLanguage].countdown} 0s`;
                progressBar.style.width = '100%'; // Возвращаем статус бар в исходное положение (100%)
            }
        }, 1000);
    }

    // Сброс активных звёзд (очистка поля)
    function resetStars() {
        activeStars.forEach(cell => {
            cell.classList.remove('star');
        });
        activeStars = []; // Очищаем массив звёзд
    }

    // Показывание случайных звёзд на поле
    function revealCells() {
        const cellsToReveal = Math.floor(Math.random() * 3) + 5; // Показываем от 5 до 7 звёзд
        const randomCells = cells.sort(() => 0.5 - Math.random()).slice(0, cellsToReveal);

        let revealDelay = 0; // Задержка для каждой звезды

        randomCells.forEach((cell, index) => {
            setTimeout(() => {
                cell.classList.add('star'); // Добавляем класс "star" для отображения звезды
                activeStars.push(cell); // Сохраняем звезду как активную
            }, revealDelay); // Показываем звезду с задержкой

            revealDelay += 750; // Увеличиваем задержку для следующей звезды
        });

        startCountdown(9); // Запускаем обратный отсчёт с 9 секундами
    }

    // Обработчик клика на кнопку "Получить сигнал"
    flipButton.addEventListener('click', () => {
        if (isCooldownActive) return;

        flipButton.disabled = true;
        isCooldownActive = true;
        statusElement.innerText = translations[currentLanguage].wait;

        // Задержка перед показом новых звёзд
        setTimeout(() => {
            resetStars(); // Сброс старых звёзд
            statusElement.innerText = translations[currentLanguage].status;
            revealCells(); // Показываем новые звёзды
        }, 1500); // Задержка в 1.5 секунды перед показом новых звёзд
    });

    // Инициализация языка интерфейса
    updateLanguage(currentLanguage);
});