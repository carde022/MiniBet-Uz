const BASE_URL = "https://justa-recriminative-nonrequisitely.ngrok-free.dev"; // SHUNI HAR SAFAR TEKSHIR!

async function request(endpoint, method = "GET", body = null) {
    const options = {
        method,
        headers: { "Content-Type": "application/json" }
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(${BASE_URL}${endpoint}, options);
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Xatolik yuz berdi");
    return data;
}