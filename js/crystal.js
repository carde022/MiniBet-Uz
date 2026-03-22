const id = localStorage.getItem("my_tg_id");
const board = document.getElementById('crystal-board');
const gems = ['💎', '💍', '🔮', '🧿', '🍀', '💰'];

// Dastlabki bo'sh maydon
function initBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const div = document.createElement('div');
        div.className = 'gem';
        div.innerText = gems[Math.floor(Math.random() * gems.length)];
        board.appendChild(div);
    }
}
initBoard();

async function startCrystal() {
    const betAmount = document.getElementById('bet').value;
    const status = document.getElementById('status');
    const btn = document.getElementById('spin-btn');

    if (betAmount < 1000) {
        status.innerText = "Minimal stavka 1000 UZS!";
        return;
    }

    btn.disabled = true;
    status.innerText = "Aylanyapti...";

    try {
        // Backendga so'rov (Hali backendda bu endpoint bo'lmasa, error beradi)
        // Hozircha vizual effekt qilamiz:
        let shuffleCount = 0;
        let shuffle = setInterval(() => {
            initBoard();
            shuffleCount++;
            if (shuffleCount > 10) {
                clearInterval(shuffle);
                finishGame(betAmount);
            }
        }, 100);

    } catch (e) {
        status.innerText = "Xato: " + e.message;
        btn.disabled = false;
    }
}

function finishGame(bet) {
    const status = document.getElementById('status');
    const btn = document.getElementById('spin-btn');
    
    // Tasodifiy yutuq simulyatsiyasi (Keyinchalik buni Backend hal qiladi)
    const win = Math.random() > 0.7; 
    if (win) {
        const winAmount = bet * 2;
        status.innerHTML = `<span style="color:#28a745;">YUTDINGIZ! +${winAmount} UZS</span>`;
    } else {
        status.innerHTML = `<span style="color:#e74c3c;">YUTQAZDINGIZ!</span>`;
    }
    btn.disabled = false;
}
