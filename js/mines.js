const my_tg_id = "7425396576"; 
let isGameActive = false;
let currentMultiplier = 1.0;
let openedDiamonds = 0;
let currentBet = 0;

async function init() {
    document.getElementById('display-id').innerText = my_tg_id;
    updateUIBalance();
    renderGrid();
}

async function updateUIBalance() {
    try {
        const data = await request(`/api/user/me/${my_tg_id}`);
        document.getElementById('display-balance').innerText = `💰 ${data.balance.toLocaleString()} UZS`;
    } catch (e) { console.error("Balans xatosi"); }
}

function renderGrid() {
    const grid = document.getElementById('mines-grid');
    grid.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('button');
        cell.className = 'cell';
        cell.onclick = () => handleCellClick(i, cell);
        grid.appendChild(cell);
    }
}

async function startGame() {
    currentBet = parseFloat(document.getElementById('bet-amount').value);
    const count = parseInt(document.getElementById('mines-count').value);
    const msg = document.getElementById('status-msg');

    try {
        await request("/api/games/mines/play", "POST", {
            tg_id: my_tg_id,
            bet: currentBet,
            mines_count: count
        });

        isGameActive = true;
        openedDiamonds = 0;
        currentMultiplier = 1.0;
        
        renderGrid();
        updateUIBalance();
        updateMultiplierUI();
        
        msg.innerText = "🎮 O'yin boshlandi!";
        msg.style.color = "#28a745";
        document.getElementById('start-btn').disabled = true;
        document.getElementById('cashout-btn').style.display = 'none';

    } catch (err) {
        msg.innerText = "❌ " + err.message;
        msg.style.color = "#e74c3c";
    }
}

function updateMultiplierUI() {
    document.getElementById('current-multi').innerText = currentMultiplier.toFixed(2) + "x";
    if (openedDiamonds > 0) {
        const potentialWin = (currentBet * currentMultiplier).toFixed(0);
        document.getElementById('cashout-btn').style.display = 'block';
        document.getElementById('cashout-btn').innerText = `PULNI YECHIB OLISH (${potentialWin} UZS)`;
    }
}

function handleCellClick(index, cell) {
    if (!isGameActive || cell.classList.contains('open')) return;

    const minesCount = parseInt(document.getElementById('mines-count').value);
    // Ehtimollik asosida tasodifiy natija (Haqiqiysi Backendda bo'lishi kerak)
    const isMine = Math.random() < (minesCount / (25 - openedDiamonds));

    cell.classList.add('open');

    if (isMine) {
        cell.innerText = "💣";
        cell.classList.add('mine');
        isGameActive = false;
        document.getElementById('status-msg').innerText = "💥 BOOM! Yutqazdingiz.";
        document.getElementById('status-msg').style.color = "#e74c3c";
        document.getElementById('start-btn').disabled = false;
        document.getElementById('cashout-btn').style.display = 'none';
    } else {
        cell.innerText = "💎";
        cell.classList.add('diamond');
        openedDiamonds++;
        
        // Matematik formula: Har bir olmos yutuqni oshiradi
        // Formula: (Jami kataklar - topilganlar) / (Jami - topilganlar - bombalar)
        let nextStepProb = (25 - (openedDiamonds - 1) - minesCount) / (25 - (openedDiamonds - 1));
        currentMultiplier = currentMultiplier * (1 / nextStepProb) * 0.98; // 0.98 - Kazino komissiyasi
        
        updateMultiplierUI();
        document.getElementById('status-msg').innerText = "💎 Zo'r! Davom eting.";
    }
}

async function claimWin() {
    if (!isGameActive || openedDiamonds === 0) return;

    const winAmount = Math.floor(currentBet * currentMultiplier);
    
    try {
        // Yutuqni balansga qo'shish
        await request("/api/user/add_balance", "POST", {
            tg_id: my_tg_id,
            amount: winAmount
        });

        alert(`💰 Tabriklaymiz! ${winAmount.toLocaleString()} UZS yutib oldingiz!`);
        isGameActive = false;
        document.getElementById('start-btn').disabled = false;
        document.getElementById('cashout-btn').style.display = 'none';
        updateUIBalance();
    } catch (e) {
        alert("Xatolik: " + e.message);
    }
}

init();
