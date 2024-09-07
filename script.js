document.addEventListener('DOMContentLoaded', () => {
    const languageIcon = document.getElementById('language-icon');
    const languageDropdown = document.getElementById('language-dropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    const statusElement = document.getElementById('status');
    const flipButton = document.getElementById('flip');
    const countdownElement = document.getElementById('countdown');
    const progressBar = document.getElementById('progress-bar');
    const accuracyElement = document.getElementById('signal-accuracy');
    const gameField = document.getElementById('game-field');
    let currentLanguage = 'en';
    let isDropdownVisible = false;
    let isCooldownActive = false;
    let accuracy = '+86';
    let activeStars = [];
    let cooldownEndTime = null;

    // Переводы для разных языков
    const translations = {
        ru: { status: 'VORTEX', flip: 'Получить Сигнал', countdown: 'Осталось:', wait: 'ЖДИТЕ...', accuracy: 'Точность Сигнала:' },
        en: { status: 'VORTEX', flip: 'Get Signal', countdown: 'Remaining:', wait: 'WAIT...', accuracy: 'Signal Accuracy:' },
        hi: { status: 'VORTEX', flip: 'सिग्नल प्राप्त करें', countdown: 'सेकंड बचा:', wait: 'रुको...', accuracy: 'सटीकता:' },
        pt: { status: 'VORTEX', flip: 'Receber Sinal', countdown: 'Restante:', wait: 'AGUARDE...', accuracy: 'Precisão:' },
        es: { status: 'VORTEX', flip: 'Recibir Señal', countdown: 'Restantes:', wait: 'ESPERE...', accuracy: 'Precisión:' },
        tr: { status: 'VORTEX', flip: 'Sinyal Al', countdown: 'Kaldı:', wait: 'BEKLEYIN...', accuracy: 'Doğruluk:' }
    };

    // Функция обновления языка интерфейса
    function updateLanguage(lang) {
        console.log(`Updating language to ${lang}`); // Логирование
        const translation = translations[lang];
        if (translation) {
            statusElement.innerText = translation.status;
            flipButton.innerText = translation.flip;
            countdownElement.innerText = `${translation.countdown} 0s`;
            accuracyElement.innerText = `${translation.accuracy} ${accuracy}%`;
            // Обновляем статус для текущего состояния ожидания
            if (isCooldownActive) {
                statusElement.innerText = translation.wait;
            }
        } else {
            console.error(`No translation found for language: ${lang}`);
        }
    }

    // Открытие и закрытие выпадающего меню выбора языка
    function toggleDropdown() {
        if (isDropdownVisible) {
            languageDropdown.style.display = 'none';
        } else {
            languageDropdown.style.display = 'grid';
        }
        isDropdownVisible = !isDropdownVisible;
    }

    // Обработка клика на иконку языка
    languageIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleDropdown();
    });

    // Обработка выбора языка из меню
    languageOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            event.preventDefault();
            const selectedLang = option.dataset.lang;
            console.log(`Selected language: ${selectedLang}`); // Логирование выбранного языка
            if (translations[selectedLang]) {
                languageIcon.src = option.src; // Меняем иконку языка
                currentLanguage = selectedLang;
                updateLanguage(currentLanguage);
                toggleDropdown(); // Закрываем меню после выбора
            } else {
                console.error(`No translation found for language: ${selectedLang}`);
            }
        });
    });

    // Закрытие выпадающего меню при клике вне области
    document.addEventListener('click', (event) => {
        if (isDropdownVisible && !languageDropdown.contains(event.target) && event.target !== languageIcon) {
            toggleDropdown();
        }
    });

    // Создание 5x5 игрового поля для Minesweeper
    const cells = [];
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell', i % 2 === 0 ? 'cell-even' : 'cell-odd');
        cells.push(cell);
        gameField.appendChild(cell);
    }

    // Функция для плавного уменьшения прогресс-бара и обратного отсчёта
    function updateCountdown() {
        const now = Date.now();
        const timeLeft = Math.max(0, cooldownEndTime - now);
        const secondsLeft = Math.ceil(timeLeft / 1000);

        if (timeLeft > 0) {
            const progress = 1 - timeLeft / 9000;
            progressBar.style.width = `${(1 - progress) * 100}%`; // Плавное уменьшение
            countdownElement.innerText = `${translations[currentLanguage].countdown} ${secondsLeft}s`;
            flipButton.disabled = true;
            flipButton.classList.add('disabled');
            isCooldownActive = true;
        } else {
            progressBar.style.width = '100%'; // Сбрасываем статус бар в исходное положение (100%)
            countdownElement.innerText = `${translations[currentLanguage].countdown} 0s`;
            flipButton.disabled = false;
            flipButton.classList.remove('disabled');
            isCooldownActive = false;
        }
    }

    // Функция запуска таймера обратного отсчёта и прогресс-бара
    function startCountdown(seconds) {
        cooldownEndTime = Date.now() + seconds * 1000;

        function countdownInterval() {
            updateCountdown();
            if (isCooldownActive) {
                requestAnimationFrame(countdownInterval);
            }
        }

        countdownInterval(); // Старт обратного отсчёта
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
        statusElement.innerText = translations[currentLanguage].wait; // Обновляем статус

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