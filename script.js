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
    let accuracy = '92';
    let activeStars = [];
    let cooldownEndTime = null;

    const translations = {
        ru: { status: 'VORTEX', flip: 'Получить Сигнал', countdown: 'Осталось:', wait: 'ЖДИТЕ...', accuracy: 'Точность Сигнала:', stars: 'ЗВЁЗД' },
        en: { status: '3 TRAPS', flip: 'Get Signal', countdown: 'Remaining:', wait: 'HACKING...', accuracy: 'Signal Accuracy:', stars: 'STARS' },
        hi: { status: 'VORTEX', flip: 'सिग्नल प्राप्त करें', countdown: 'सेकंड बचा:', wait: 'रुको...', accuracy: 'सटीकता:', stars: 'सितारे' },
        pt: { status: 'VORTEX', flip: 'Receber Sinal', countdown: 'Restante:', wait: 'AGUARDE...', accuracy: 'Precisão:', stars: 'ESTRELAS' },
        es: { status: 'VORTEX', flip: 'Recibir Señal', countdown: 'Restantes:', wait: 'ESPERE...', accuracy: 'Precisión:', stars: 'ESTRELLAS' },
        tr: { status: 'VORTEX', flip: 'Sinyal Al', countdown: 'Kaldı:', wait: 'BEKLEYIN...', accuracy: 'Doğruluk:', stars: 'YILDIZ' }
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
                statusElement.innerText = translation.status;
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

    // Функция для сброса звёзд с анимацией
    function resetStarsWithAnimation() {
        const fadeOutDuration = 500;
        const fadeInDuration = 500;

        // Анимация исчезновения звёзд
        activeStars.forEach(cell => {

            cell.classList.add('star-fade-out'); // Добавляем анимацию исчезновения

            // После завершения анимации исчезновения (500 мс)
            setTimeout(() => {
                cell.classList.remove('star');
                cell.classList.remove('star-fade-out');
                cell.classList.add('fade-in'); // Анимация появления ячейки

                // Сбрасываем анимационные классы после появления ячейки
                setTimeout(() => {
                    cell.classList.remove('fade-in', 'fade-out');
                }, fadeInDuration);

            }, fadeOutDuration);
        });
        activeStars = [];
    }

    // Анимация клеток
    function animateCell(cell, callback) {
        cell.classList.remove('fade-in', 'fade-out');
        cell.classList.add('fade-out'); // Анимация исчезновения

        // После исчезновения
        setTimeout(() => {
            cell.classList.remove('fade-out');
            callback();
            cell.classList.add('fade-in'); // Анимация появления
        }, 500);
    }

    // Появление новых клеток
    function revealCells() {
        const cellsToReveal = Math.floor(Math.random() * 3) + 5;
        const randomCells = cells.sort(() => 0.5 - Math.random()).slice(0, cellsToReveal);

        statusElement.innerText = `${cellsToReveal} ${translations[currentLanguage].stars}`;

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

    flipButton.addEventListener('click', () => {
        if (isCooldownActive) return;

        flipButton.disabled = true;
        isCooldownActive = true;
        statusElement.innerText = translations[currentLanguage].wait;

        // Сброс звёзд с анимацией
        resetStarsWithAnimation();

        setTimeout(() => {
            revealCells();
            accuracy = Math.floor(Math.random() * 21) + 80;
            accuracyElement.innerText = `${translations[currentLanguage].accuracy} ${accuracy}%`;
        }, 2000);
    });

    updateLanguage(currentLanguage);

});

document.getElementById('left-arrow').addEventListener('click', () => {
    // Действие при нажатии на левую стрелку
    console.log('Left arrow clicked');
});

document.getElementById('right-arrow').addEventListener('click', () => {
    // Действие при нажатии на правую стрелку
    console.log('Right arrow clicked');
});
