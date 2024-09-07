document.addEventListener('DOMContentLoaded', () => {
    const statusElement = document.getElementById('status');
    const flipButton = document.getElementById('flip');
    const countdownElement = document.getElementById('countdown');
    const progressBarFill = document.querySelector('.progress-bar-fill');
    const gameField = document.getElementById('game-field');
    const languageIcon = document.getElementById('language-icon');
    const languageDropdown = document.getElementById('language-dropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    let currentLanguage = 'en';
    let isWaiting = false;
    let lastResult = '';
    let cooldownEndTime = 0;
    let isCooldownActive = false;

    const translations = {
        ru: {
            status: 'VORTEX',
            wait: 'ЖДИТЕ...',
            countdown: 'Осталось:'
        },
        en: {
            status: 'VORTEX',
            wait: 'WAIT...',
            countdown: 'Remaining:'
        },
        hi: {
            status: 'VORTEX',
            wait: 'रुको...',
            countdown: 'सेकंड बचा:'
        },
        pt: {
            status: 'VORTEX',
            wait: 'AGUARDE...',
            countdown: 'Restante:'
        },
        es: {
            status: 'VORTEX',
            wait: 'ESPERE...',
            countdown: 'Restantes:'
        },
        tr: {
            status: 'VORTEX',
            wait: 'BEKLEYIN...',
            countdown: 'Kaldı:'
        }
    };

    // Создание поля 5x5
    const cells = [];
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell', i % 2 === 0 ? 'cell-even' : 'cell-odd');
        cells.push(cell);
        gameField.appendChild(cell);
    }

    function updateLanguage(lang) {
        const translation = translations[lang];
        statusElement.innerText = lastResult ? translation[statusElement] : translation.status;
        countdownElement.innerText = `${translation.countdown} 0s`;
    }

    function startCountdown(seconds) {
        countdownElement.innerText = `${translations[currentLanguage].countdown} ${seconds}s`;
        const interval = setInterval(() => {
            seconds--;
            countdownElement.innerText = `${translations[currentLanguage].countdown} ${seconds}s`;
            if (seconds === 0) clearInterval(interval);
        }, 1000);
    }

    function revealCells() {
        const cellsToReveal = Math.floor(Math.random() * 3) + 5; // От 5 до 7 ячеек
        const randomCells = cells.sort(() => 0.5 - Math.random()).slice(0, cellsToReveal);

        randomCells.forEach(cell => {
            cell.classList.add('star');
            setTimeout(() => {
                cell.classList.remove('star');
            }, 1000);
        });
    }

    function startProgressBar() {
        progressBarFill.style.width = '100%';
        setTimeout(() => {
            progressBarFill.style.width = '0%';
        }, 100);
    }

    function resetProgressBar() {
        progressBarFill.style.width = '100%';
    }

    function startCooldown(seconds) {
        flipButton.disabled = true;
        isCooldownActive = true;
        startProgressBar();
        startCountdown(seconds);

        const interval = setInterval(() => {
            seconds--;
            countdownElement.innerText = `${translations[currentLanguage].countdown} ${seconds}s`;
            if (seconds <= 0) {
                clearInterval(interval);
                flipButton.disabled = false;
                isCooldownActive = false;
                resetProgressBar();
            }
        }, 1000);
    }

    flipButton.addEventListener('click', () => {
        if (isWaiting || isCooldownActive) return;

        isWaiting = true;
        statusElement.innerText = translations[currentLanguage].wait;
        flipButton.disabled = true;

        setTimeout(() => {
            revealCells();
            statusElement.innerText = 'VORTEX';
            isWaiting = false;
            startCooldown(9);
        }, 1500);
    });

    // Переключение языков
    languageIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        if (languageDropdown.style.display === 'none' || languageDropdown.style.display === '') {
            languageDropdown.style.display = 'grid';
        } else {
            languageDropdown.style.display = 'none';
        }
    });

    languageOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            const selectedLang = option.dataset.lang;
            currentLanguage = selectedLang;
            languageIcon.src = option.src;
            updateLanguage(selectedLang);
            languageDropdown.style.display = 'none';
        });
    });
});