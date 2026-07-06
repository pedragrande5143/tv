/**
 * INTEGRAÇÃO COM OPEN-METEO API & CACHE LOCAL RESILIENTE
 */
const WEATHER_CACHE_KEY = "pedra_grande_weather_cache";
// Coordenadas aproximadas do Itaim Bibi, São Paulo
const LATITUDE = "-23.5833";
const LONGITUDE = "-46.6833";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast?latitude=" + LATITUDE + "&longitude=" + LONGITUDE + "&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FSao_Paulo";

function initWeather() {
    fetchWeatherData();
    // Atualiza o clima rigorosamente a cada 15 minutos (15 * 60 * 1000)
    setInterval(fetchWeatherData, 900000);
}

function fetchWeatherData() {
    fetch(WEATHER_API_URL)
        .then(function (response) {
            if (!response.ok) throw new Error("Erro na requisição do clima");
            return response.json();
        })
        .then(function (data) {
            // Se obteve sucesso, salva no localStorage como mecanismo de resiliência
            localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(data));
            renderWeather(data);
        })
        .catch(function (error) {
            console.warn("Falha ao obter clima online. Utilizando cache estruturado:", error);
            const cachedData = localStorage.getItem(WEATHER_CACHE_KEY);
            if (cachedData) {
                renderWeather(JSON.parse(cachedData));
            }
        });
}

function renderWeather(data) {
    if (!data || !data.current_weather || !data.daily) return;

    // 1. Clima Atual
    const currentTemp = Math.round(data.current_weather.temperature);
    const weatherCode = data.current_weather.weathercode;
    const symbol = getWeatherSymbol(weatherCode);
    
    document.getElementById("current-weather").textContent = symbol + " " + currentTemp + "°C";

    // 2. Previsão de 3 Dias (Hoje, Amanhã, Depois de amanhã)
    const forecastElement = document.getElementById("forecast");
    forecastElement.innerHTML = ""; // Limpa estrutura anterior

    const daysLabel = ["Hoje", "Amanhã", "Dep. Am."];
    
    // Tratamento para extrair os dias da semana abreviados caso prefira dinâmica futura
    // No entanto, fixar "Hoje", "Amanhã" respeita com exatidão o briefing minimalista.
    for (let i = 0; i < 3; i++) {
        const maxTemp = Math.round(data.daily.temperature_2m_max[i]);
        const minTemp = Math.round(data.daily.temperature_2m_min[i]);
        
        // Identificação do dia da semana dinâmico para o 3º dia (Ex: Ter, Qua, Qui)
        let dayTitle = daysLabel[i];
        if (i === 2) {
            const dateStr = data.daily.time[i]; // Formato YYYY-MM-DD da API
            const dateObj = new Date(dateStr + "T00:00:00");
            const weekdaysShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
            dayTitle = weekdaysShort[dateObj.getDay()];
        }

        const dayHtml = 
            '<div class="forecast-day">' +
                '<div class="day-name">' + dayTitle + '</div>' +
                '<div class="day-temps">' + maxTemp + '° ' + minTemp + '°</div>' +
            '</div>';
        
        forecastElement.innerHTML += dayHtml;
    }
}

// Mapeamento simplificado de WMO Weather Codes para Símbolos de Texto Leves (Compatível com TVs)
function getWeatherSymbol(code) {
    if (code === 0) return "☀"; // Céu limpo
    if (code >= 1 && code <= 3) return "🌤"; // Parcialmente nublado
    if (code >= 45 && code <= 48) return "🌫"; // Nevoeiro
    if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) return "🌧"; // Chuva
    if (code >= 71 && code <= 77) return "❄"; // Neve
    if (code >= 95) return "⛈"; // Tempestade
    return "☁"; // Nublado padrão
}