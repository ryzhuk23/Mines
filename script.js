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
    let isCooldownActive = false;
    let accuracy = '+86';
    let activeStars = [];

    const translations = {
        ru: { status: 'VORTEX', flip: 'Получить Сигнал', countdown: 'Осталось:', wait: 'ЖДИТЕ...', accuracy: 'Точность Сигнала:' },
        en: { status: 'VORTEX', flip: 'Get Signal', countdown: 'Remaining:', wait: 'WAIT...', accuracy: 'Signal Accuracy:' },
        hi: { status: 'VORTEX', flip: 'सिग्नल प्राप्त करें', countdown: 'सेकंड बचा:', wait: 'रुको...', accuracy: 'सटीकता:' },
        pt: { status: 'VORTEX', flip: 'Receber Sinal', countdown: 'Restante:', wait: 'AGUARDE...', accuracy: 'Precisão:' },
        es: { status: 'VORTEX', flip: 'Recibir Señal', countdown: 'Restantes:', wait: 'ESPERE...', accuracy: 'Precisión:' },
        tr: { status: 'VORTEX', flip: 'Sinyal Al', countdown: 'Kaldı:', wait: 'BEKLEYIN...', accuracy: 'Doğruluk:' }
    };

    function updateLanguage(lang) {
        const translation = translations[lang];
        statusElement.innerText = translation.status;
        flipButton.innerText = translation.flip;
        countdownElement.innerText = `${translation.countdown} 0s`;
        accuracyElement.innerText = `${translation.accuracy}${accuracy}%`;
    }

    function toggleDropdown() {
        if (languageDropdown.classList.contains('show')) {
            languageDropdown.classList.remove('show');
            languageDropdown.style.display = 'none';
        } else {
            languageDropdown.classList.add('show');
            languageDropdown.style.display = 'grid';
        }
    }

    languageIcon.addEventListener('click', (event) => {
        event.stopPropagation();  // Предотвращаем всплытие события
        toggleDropdown();
    });

    document.addEventListener('click', (event) => {
        if (!languageDropdown.contains(event.target) && event.target !== languageIcon) {
            languageDropdown.classList.remove('show');
            languageDropdown.style.display = 'none';
        }
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

    const cells = [];
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell', i % 2 === 0 ? 'cell-even' : 'cell-odd');
        cells.push(cell);
        gameField.appendChild(cell);
    }

    function startCountdown(seconds) {
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
                progressBar.style.width = '100%';
            }
        }, 1000);
    }

    function resetStars() {
        activeStars.forEach(cell => {
            cell.classList.remove('star');
        });
        activeStars = [];
    }

    function revealCells() {
        const cellsToReveal = Math.floor(Math.random() * 3) + 5;
        const randomCells = cells.sort(() => 0.5 - Math.random()).slice(0, cellsToReveal);

        let revealDelay = 0;

        randomCells.forEach((cell) => {
            setTimeout(() => {
                cell.classList.add('star');
                activeStars.push(cell);
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

        setTimeout(() => {
            resetStars();
            statusElement.innerText = translations[currentLanguage].status;
            revealCells();
        }, 1500);
    });

    updateLanguage(currentLanguage);
});