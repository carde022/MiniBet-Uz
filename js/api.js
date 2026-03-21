const NGROK_URL = "https://justa-recriminative-nonrequisitely.ngrok-free.dev";

// Backend bilan gaplashadigan asosiy funksiya
async function request(endpoint, method = "GET", params = {}) {
    const url = new URL(`${NGROK_URL}${endpoint}`);
    
    // Parametrlarni URLga biriktirish (Backend shuni kutyapti)
    Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
            url.searchParams.append(key, params[key]);
        }
    });

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Accept": "application/json",
                "ngrok-skip-browser-warning": "true"
            }
        });

        const data = await response.json();

        if (!response.ok) {
            // [object Object] chiqmasligi uchun xatoni matnga aylantiramiz
            let errorMsg = "Xatolik yuz berdi";
            if (Array.isArray(data.detail)) {
                errorMsg = data.detail.map(err => `${err.loc[1]}: ${err.msg}`).join("\n");
            } else if (typeof data.detail === "string") {
                errorMsg = data.detail;
            }
            throw new Error(errorMsg);
        }

        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}
