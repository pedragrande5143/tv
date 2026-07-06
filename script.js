/**
 * GERENCIAMENTO DO RELÓGIO, DATA E SAUDAÇÃO
 */
document.addEventListener("DOMContentLoaded", function () {
    initClock();
    // Executa imediatamente as atualizações de API controladas pelos outros scripts
    if (typeof initWeather === "function") initWeather();
    if (typeof initNews === "function") initNews();
});

function initClock() {
    updateClockAndGreeting();
    // Atualiza estritamente a cada 1 segundo para precisão do relógio da TV
    setInterval(updateClockAndGreeting, 1000);
}

function updateClockAndGreeting() {
    const now = new Date();
    
    // 1. Relógio no Formato 24h sem segundos
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById("clock").textContent = hours + ":" + minutes;

    // 2. Data Elegante Automação (Ex: SEGUNDA • 06 JUL 2026)
    const daysOfWeek = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];
    const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    
    const dayName = daysOfWeek[now.getDay()];
    const dayOfMonth = String(now.getDate()).padStart(2, '0');
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();

    document.getElementById("date").textContent = dayName + " • " + dayOfMonth + " " + monthName + " " + year;

    // 3. Saudação Dinâmica por Horário
    const currentHour = now.getHours();
    let greetingText = "BOA NOITE";

    if (currentHour >= 6 && currentHour < 12) {
        greetingText = "BOM DIA";
    } else if (currentHour >= 12 && currentHour < 18) {
        greetingText = "BOA TARDE";
    }

    document.getElementById("greeting").textContent = greetingText;
}