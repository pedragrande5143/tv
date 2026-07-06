/**
 * GERENCIAMENTO DO RELÓGIO, DATA E SAUDAÇÃO
 */
document.addEventListener("DOMContentLoaded", function () {
    initClock();
    if (typeof initWeather === "function") initWeather();
});

function initClock() {
    updateClockAndGreeting();
    setInterval(updateClockAndGreeting, 1000);
}

function updateClockAndGreeting() {
    const now = new Date();
    
    // 1. Relógio no Formato 24h
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById("clock").textContent = hours + ":" + minutes;

    // 2. Data Elegante
    const daysOfWeek = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];
    const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    
    const dayName = daysOfWeek[now.getDay()];
    const dayOfMonth = String(now.getDate()).padStart(2, '0');
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();

    document.getElementById("date").textContent = dayName + " • " + dayOfMonth + " " + monthName + " " + year;

    // 3. Saudação Dinâmica
    const currentHour = now.getHours();
    let greetingText = "BOA NOITE";

    if (currentHour >= 6 && currentHour < 12) {
        greetingText = "BOM DIA";
    } else if (currentHour >= 12 && currentHour < 18) {
        greetingText = "BOA TARDE";
    }

    document.getElementById("greeting").textContent = greetingText;
}