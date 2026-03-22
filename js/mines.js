let gameActive = false;
let currentMultiplier = 1.00;
const id = localStorage.getItem("my_tg_id");

// Sahifa yuklanganda bo'sh gridni chizish
function createGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('button');
        cell.className = 'cell';
        cell.onclick = () => openCell(i, cell);
        grid.appendChild(cell);
    }
}

// Birinchi marta yuklanganda ishga tushiramiz
createGrid();

async function startGame() {
    const betAmount = document.getElementById('bet').value;
    const minesCount = document.getElementById('mines-count').value;
    const status = document.getElementById('status');

    if (!id) { alert("ID topilmadi, qayta kiring!"); return; }

    try {
        status.innerText = "So'rov yuborilmoqda...";
        const res = await request("/api/game/mines/start", "POST", {
            tg_id: id,
            bet_amount: parseInt(betAmount),
            mines_count: parseInt(minesCount)
        });

        gameActive = true;
        currentMultiplier = 1.00;
        document.getElementById('multi').innerText = "1.00x";
        document.getElementById('start-btn').style.display = 'none';
        document.getElementById('cashout-btn').style.display = 'block';
        status.innerHTML = "<span style='color: #28a745;'>O'yin boshlandi! Olmoslarni toping.</span>";
        
        createGrid(); // Kataklarni yangilash
    } catch (e) {
        status.innerHTML = `<span style='color:red;'>Xato: ${e.message}</span>`;
    }
}

async function openCell(index, cellElement) {
    if (!gameActive || cellElement.classList.contains('open')) return;

    try {
        const res = await request("/api/game/mines/click", "POST", {
            tg_id: id,
            click_index: index
        });

        cellElement.classList.add('open');
        
        if (res.status === "win") {
            cellElement.innerHTML = "💎";
            cellElement.style.color = "#00d1b2";
            currentMultiplier = res.current_multiplier;
            document.getElementById('multi').innerText = currentMultiplier.toFixed(2) + "x";
        } else {
            gameActive = false;
            cellElement.innerHTML = "💣";
            cellElement.style.background = "red";
            document.getElementById('status').innerHTML = "<span style='color:red;'>BOMBA! Yutqazdingiz.</span>";
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    } catch (e) {
        document.getElementById('status').innerText = e.message;
    }
}

async function cashOut() {
    if (!gameActive) return;
    try {
        const res = await request("/api/game/mines/cashout", "POST", { tg_id: id });
        gameActive = false;
        document.getElementById('status').innerHTML = `<span style='color:#f1c40f;'>G'ALABA! +${res.win_amount} UZS</span>`;
        setTimeout(() => {
            location.href = 'main.html';
        }, 2000);
    } catch (e) {
        alert(e.message);
    }
}
