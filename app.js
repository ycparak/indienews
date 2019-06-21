const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector');

const DEFAULT_SOURCE = 'hacker-news';
const API_KEY = 'cf06a129b8574842b2daf9089458e3f2'


window.addEventListener('load', async e => {
  updateNews();
  await updateSources();
  sourceSelector.value = DEFAULT_SOURCE;

  sourceSelector.addEventListener('change', e => {
    updateNews(e.target.value);
  });

  if ('serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.register('sw.js');
    } catch (error) {
      console.error(`SW registration failed`);
    }
  }
});

async function updateNews(source = DEFAULT_SOURCE) {
  const res = await fetch(`https://newsapi.org/v1/articles?source=${source}&apiKey=${API_KEY}`);
  const json = await res.json();

  main.innerHTML = json.articles.map(createArticle).join('\n');
}

async function updateSources() {
  const res = await fetch('https://newsapi.org/v1/sources?apiKey=${API_KEY}');
  const json = await res.json();

  sourceSelector.innerHTML = json.sources.map(src => `
    <option value="${src.id}">${src.name}</option>
  `)
}

function createArticle(article) {
  if (article.urlToImage) return `
    <div class="article">
      <a href="${article.url}" target="_blank">
        <h2>${article.title}</h2>
        <img src="${article.urlToImage}" />
        <p>${article.description}</p>
      </a>
    </div>
  `
  else return `
    <div class="article">
        <a href="${article.url}" target="_blank">
          <h2>${article.title}</h2>
          <p>${article.description}</p>
        </a>
      </div>
    `
}