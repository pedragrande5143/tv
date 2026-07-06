/**
 * AGREGADOR DE NOTÍCIAS VIA PROXY COMPATÍVEL & FALLBACK ESTRUTURADO
 */
const NEWS_CACHE_KEY = "pedra_grande_news_cache";
// Utiliza o proxy universal AllOrigins para contornar problemas de CORS direto em JavaScript Client-Side
const G1_RSS_URL = "https://g1.globo.com/dinamico/rss2.mds";
const PROXY_API_URL = "https://api.allorigins.win/get?url=" + encodeURIComponent(G1_RSS_URL);

// Mensagens Institucionais de Fallback estipuladas
const FALLBACK_NEWS = [
    "Bem-vindo ao Edifício Pedra Grande.",
    "Em caso de dúvidas, procure a portaria.",
    "Visitantes devem se identificar na recepção."
];

function initNews() {
    fetchNewsData();
    // Atualiza o feed de notícias a cada 15 minutos
    setInterval(fetchNewsData, 900000);
}

function fetchNewsData() {
    fetch(PROXY_API_URL)
        .then(function (response) {
            if (!response.ok) throw new Error("Erro de comunicação com o proxy");
            return response.json();
        })
        .then(function (data) {
            if (!data || !data.contents) throw new Error("Conteúdo XML vazio");
            
            // Tratamento do XML retornado dentro da string do Proxy
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, "text/xml");
            const items = xmlDoc.getElementsByTagName("item");
            
            let headlines = [];
            // Filtra as 10 principais manchetes atuais do G1
            const count = Math.min(items.length, 10);
            
            for (let i = 0; i < count; i++) {
                const titleNode = items[i].getElementsByTagName("title")[0];
                if (titleNode) {
                    headlines.push(titleNode.textContent.trim());
                }
            }
            
            if (headlines.length === 0) throw new Error("Nenhuma manchete parseada");
            
            localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(headlines));
            renderTicker(headlines);
        })
        .catch(function (error) {
            console.warn("Falha no feed de notícias online. Ativando contingência:", error);
            const cachedNews = localStorage.getItem(NEWS_CACHE_KEY);
            if (cachedNews) {
                renderTicker(JSON.parse(cachedNews));
            } else {
                renderTicker(FALLBACK_NEWS);
            }
        });
}

function renderTicker(newsArray) {
    const tickerContent = document.getElementById("ticker-content");
    if (!tickerContent) return;

    // Concatena as manchetes utilizando o separador corporativo estipulado " • "
    const joinedText = newsArray.join(" &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; ");
    
    // Duplicamos o conteúdo do texto para garantir fluidez contínua sem quebras bruscas na tela da TV
    tickerContent.innerHTML = joinedText + " &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; " + joinedText;
    
    // Ajuste dinâmico de velocidade baseado no tamanho das strings para evitar scroll rápido demais
    const duration = Math.max(30, Math.round(tickerContent.textContent.length * 0.12));
    tickerContent.style.animationDuration = duration + "s";
}