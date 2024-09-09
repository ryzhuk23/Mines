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
    const leftArrowButton = document.getElementById('left-arrow');
    const rightArrowButton = document.getElementById('right-arrow');

    let currentLanguage = 'en';
    let isDropdownVisible = false;
    let isCooldownActive = false;
    let accuracy = '92';
    let activeStars = [];
    let cooldownEndTime = null;
    let currentTrapIndex = 1; // Начальный индекс для "3 TRAPS"

    const trapLevels = ["1 TRAP", "3 TRAPS", "5 TRAPS", "7 TRAPS"]; // Уровни ловушек

    const translations = {
        ru: { status: '3 ЛОВУШКИ', flip: 'Получить Сигнал', countdown: 'Осталось:', wait: 'ЖДИТЕ...', accuracy: 'Точность Сигнала:', stars: 'ЗВЁЗД' },
        en: { status: '3 TRAPS', flip: 'Get Signal', countdown: 'Remaining:', wait: 'HACKING...', accuracy: 'Signal Accuracy:', stars: 'STARS' },
        hi: { status: '3 TRAPS', flip: 'सिग्नल प्राप्त करें', countdown: 'सेकंड बचा:', wait: 'रुको...', accuracy: 'सटीकता:', stars: 'सितारे' },
        pt: { status: '3 TRAPS', flip: 'Receber Sinal', countdown: 'Restante:', wait: 'AGUARDE...', accuracy: 'Precisão:', stars: 'ESTRELAS' },
        es: { status: '3 TRAPS', flip: 'Recibir Señal', countdown: 'Restantes:', wait: 'ESPERE...', accuracy: 'Precisión:', stars: 'ESTRELLAS' },
        tr: { status: '3 TRAPS', flip: 'Sinyal Al', countdown: 'Kaldı:', wait: 'BEKLEYIN...', accuracy: 'Doğruluk:', stars: 'YILDIZ' }
    };

    function updateLanguage(lang) {
        const translation = translations[lang];
        if (translation) {
            flipButton.innerText = translation.flip;
            countdownElement.innerText = `${translation.countdown} 0s`;
            accuracyElement.innerText = `${translation.accuracy} ${accuracy}%`;
            if (isCooldownActive) {
                statusElement.innerText = translation.wait;
            } else if (activeStars.length > 0) {
                statusElement.innerText = `${activeStars.length} ${translation.stars}`;
            } else {
                statusElement.innerText = trapLevels[currentTrapIndex];
            }
        } else {
            console.error(`No translation found for language: ${lang}`);
        }
    }

    function toggleDropdown() {
        if (isDropdownVisible) {
            languageDropdown.style.display = 'none';
        } else {
            languageDropdown.style.display = 'grid';
        }
        isDropdownVisible = !isDropdownVisible;
    }

    languageIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleDropdown();
    });

    languageOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            event.preventDefault();
            const selectedLang = option.dataset.lang;
            if (translations[selectedLang]) {
                languageIcon.src = option.src;
                currentLanguage = selectedLang;
                updateLanguage(currentLanguage);
                toggleDropdown();
            } else {
                console.error(`No translation found for language: ${selectedLang}`);
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (isDropdownVisible && !languageDropdown.contains(event.target) && event.target !== languageIcon) {
            toggleDropdown();
        }
    });

    const cells = [];
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell', i % 2 === 0 ? 'cell-even' : 'cell-odd');
        cells.push(cell);
        gameField.appendChild(cell);
    }

    function updateCountdown() {
        const now = Date.now();
        const timeLeft = Math.max(0, cooldownEndTime - now);
        const secondsLeft = Math.ceil(timeLeft / 1000);

        if (timeLeft > 0) {
            const progress = 1 - timeLeft / 9000;
            progressBar.style.width = `${(1 - progress) * 100}%`;
            countdownElement.innerText = `${translations[currentLanguage].countdown} ${secondsLeft}s`;
            flipButton.disabled = true;
            flipButton.classList.add('disabled');
            isCooldownActive = true;
        } else {
            progressBar.style.width = '0%';
            countdownElement.innerText = `${translations[currentLanguage].countdown} 0s`;
            flipButton.disabled = false;
            flipButton.classList.remove('disabled');
            isCooldownActive = false;
        }
    }

    function startCountdown(seconds) {
        cooldownEndTime = Date.now() + seconds * 1000;

        function countdownInterval() {
            updateCountdown();
            if (isCooldownActive) {
                requestAnimationFrame(countdownInterval);
            }
        }

        countdownInterval();
    }

    function resetStarsWithAnimation() {
        const fadeOutDuration = 500;
        const fadeInDuration = 500;

        activeStars.forEach(cell => {
            cell.classList.add('star-fade-out');
            setTimeout(() => {
                cell.classList.remove('star');
                cell.classList.remove('star-fade-out');
                cell.classList.add('fade-in');
                setTimeout(() => {
                    cell.classList.remove('fade-in', 'fade-out');
                }, fadeInDuration);
            }, fadeOutDuration);
        });
        activeStars = [];
    }

    function animateCell(cell, callback) {
        cell.classList.remove('fade-in', 'fade-out');
        cell.classList.add('fade-out');
        setTimeout(() => {
            cell.classList.remove('fade-out');
            callback();
            cell.classList.add('fade-in');
        }, 500);
    }

    function revealCells() {
        const starsToReveal = getRandomStarsForTrapLevel();
        const randomCells = cells.sort(() => 0.5 - Math.random()).slice(0, starsToReveal);

        statusElement.innerText = `${starsToReveal} ${translations[currentLanguage].stars}`;

        let revealDelay = 0;
        randomCells.forEach((cell, index) => {
            setTimeout(() => {
                animateCell(cell, () => {
                    cell.classList.add('star');
                    activeStars.push(cell);
                });
            }, revealDelay);

            revealDelay += 750;
        });

        startCountdown(9);
    }

    function getRandomStarsForTrapLevel() {
        let starsCount = 0;
        switch (trapLevels[currentTrapIndex]) {
            case "1 TRAP":
                starsCount = Math.floor(Math.random() * 3) + 5; // от 5 до 7 звёзд
                break;
            case "3 TRAPS":
                starsCount = Math.floor(Math.random() * 3) + 4; // от 4 до 6 звёзд
                break;
            case "5 TRAPS":
                starsCount = Math.floor(Math.random() * 3) + 3; // от 3 до 5 звёзд
                break;
            case "7 TRAPS":
                starsCount = Math.floor(Math.random() * 3) + 2; // от 2 до 4 звёзд
                break;
        }
        return starsCount;
    }

    flipButton.addEventListener('click', () => {
        if (isCooldownActive) return;

        flipButton.disabled = true;
        isCooldownActive = true;
        statusElement.innerText = translations[currentLanguage].wait;

        resetStarsWithAnimation();

        setTimeout(() => {
            revealCells();
            accuracy = Math.floor(Math.random() * 21) + 80;
            accuracyElement.innerText = `${translations[currentLanguage].accuracy} ${accuracy}%`;

            // Обновляем статус на текущее количество ловушек
            statusElement.innerText = trapLevels[currentTrapIndex];

            // Разблокируем кнопку "Get Signal" после завершения
            flipButton.disabled = false;
            isCooldownActive = false;
        }, 1500);
    });

    leftArrowButton.addEventListener('click', () => {
        if (!isCooldownActive) {
            if (currentTrapIndex > 0) {
                currentTrapIndex--;
                updateLanguage(currentLanguage);
            }
        }
    });

    rightArrowButton.addEventListener('click', () => {
        if (!isCooldownActive) {
            if (currentTrapIndex < trapLevels.length - 1) {
                currentTrapIndex++;
                updateLanguage(currentLanguage);
            }
        }
    });

    updateLanguage(currentLanguage);
});