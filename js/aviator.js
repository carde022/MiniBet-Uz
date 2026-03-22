let isFlying = false;
let currentMult = 1.00;
let flyInterval;
const id = localStorage.getItem("my_tg_id");

const plane = document.getElementById('plane');
const multiplierDisplay = document.getElementById('multiplier');
const status = document.getElementById('status');
const betBtn = document.getElementById('bet-btn');
const cashoutBtn = document.getElementById('cashout-btn');

async function startCrash() {
    const betAmount = document.getElementById('bet').value;
    
    if (betAmount < 1000) {
        alert("Minimal stavka 1000 UZS!");
        return;
    }

    try {
        // Backendga so'rov (Hozircha vizual boshlaymiz)
        isFlying = true;
        currentMult = 1.00;
        
        betBtn.style.display = 'none';
        cashoutBtn.style.display = 'block';
        status.innerText = "Parvoz boshlandi...";
        status.style.color = "white";

        // Samolyot animatsiyasi va koeffitsiyent o'sishi
        flyInterval = setInterval(() => {
            currentMult += 0.01; // Har 100ms da 0.01 ga o'sadi
            multiplierDisplay.innerText = currentMult.toFixed(2) + "x";
            
            // Samolyotni tepaga va o'ngga surish
            let x = (currentMult - 1) * 50; 
            let y = (currentMult - 1) * 30;
            plane.style.transform = `translate(${x}px, -${y}px)`;

            // Tasodifiy "Crash" (Portlash) - keyinchalik buni Backend aytadi
            if (Math.random() < 0.005 && currentMult > 1.20) {
                crash();
            }
        }, 100);

    } catch (e) {
        alert("Xato: " + e.message);
    }
}

function crash() {
    clearInterval(flyInterval);
    isFlying = false;
    
    multiplierDisplay.style.color = "red";
    status.innerText = "SAMOLYOT UCHIB KETDI! (CRASH)";
    status.style.color = "red";
    plane.style.color = "black"; // Rangi o'chadi

    setTimeout(() => {
        location.reload(); // 3 sekunddan keyin o'yinni yangilash
    }, 3000);
}

async function cashoutCrash() {
    if (!isFlying) return;

    clearInterval(flyInterval);
    isFlying = false;

    const winAmount = Math.floor(document.getElementById('bet').value * currentMult);
    
    status.innerHTML = `<span style="color:#28a745;">G'ALABA! +${winAmount.toLocaleString()} UZS</span>`;
    multiplierDisplay.style.color = "#28a745";
    
    cashoutBtn.style.display = 'none';
    
    setTimeout(() => {
        location.href = 'main.html';
    }, 3000);
}
