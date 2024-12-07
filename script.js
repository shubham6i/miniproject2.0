document.addEventListener("DOMContentLoaded", () => {
const feedContainer = document.getElementById("feed");
const rssFeeds = [
{
title: "Times of India",
url: "https://api.rss2json.com/v1/api.json?rss_url=https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
},
{
title: "New York Times",
url: "https://api.rss2json.com/v1/api.json?rss_url=https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
},
{
title: "OpenAI Blog",
url: "https://api.rss2json.com/v1/api.json?rss_url=https://jamesg.blog/openai.xml",
},
{
title: "NASA",
url: "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.nasa.gov%2Ffeed&api_key=zusmoarth13ajuvoa8iybztecocfwxxaxvuhc7dw",
},
{
title: "Tom's Hardware",
url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.tomshardware.com/rss.xml",
},
{
title: "WIRED",
url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.wired.com/feed/category/science/latest/rss",
},
{
title: "9to5Mac",
url: "https://api.rss2json.com/v1/api.json?rss_url=https://9to5mac.com/feed",
},
{
title: "The Verge(American Technology News and Media )",
url: "https://api.rss2json.com/v1/api.json?rss_url=http://www.theverge.com/rss/index.xml",
},
{
title: "Apple Newsroom",
url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.apple.com/newsroom/rss-feed.rss",
},
{
title: "Apple Developer News and Updates",
url: "https://api.rss2json.com/v1/api.json?rss_url=https://developer.apple.com/news/rss/news.rss",
},
{
title: "Formula 1",
url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.formula1.com/en/latest/all.xml",
},
{
title: "AI and Machine Learning",
url: " https://api.rss2json.com/v1/api.json?rss_url=https://venturebeat.com/feed/",
}
];
const synth = window.speechSynthesis;

function readArticle(content) {
const utterance = new SpeechSynthesisUtterance(content);
synth.speak(utterance);
}

rssFeeds.forEach((feed) => {
fetch(feed.url)
.then((response) => response.json())
.then((data) => {
const items = data.items;
const feedSection = document.createElement("section");
feedSection.classList.add("feed-section");
feedSection.setAttribute("aria-labelledby", `${feed.title}-title`);

const feedTitle = document.createElement("h2");
feedTitle.textContent = feed.title;
feedTitle.classList.add("feed-title");
feedTitle.setAttribute("id", `${feed.title}-title`);

feedSection.appendChild(feedTitle);

items.forEach((item) => {
const article = document.createElement("article");
article.classList.add("article");
article.setAttribute("role", "article");

const titleLink = document.createElement("a");
titleLink.href = item.link;
titleLink.target = "_blank";
titleLink.textContent = item.title;
titleLink.setAttribute("aria-label", `Read full article: ${item.title}`);

const descPara = document.createElement("p");
descPara.innerHTML = item.description.replace(/<a[^>]*>|<\/a>/g, "");

const readButton = document.createElement("button");
readButton.textContent = "🔊 Read Aloud";
readButton.addEventListener("click", () => readArticle(descPara.textContent));

const translateButton = document.createElement("button");
translateButton.textContent = "🌍 Translate";
translateButton.addEventListener("click", () => {
const lang = prompt("Enter language code (e.g., 'es' for Spanish):");
if (lang) {
fetch(
`https://api.mymemory.translated.net/get?q=${encodeURIComponent(
descPara.textContent
)}&langpair=en|${lang}`
)
.then((res) => res.json())
.then((data) => {
descPara.textContent = data.responseData.translatedText;
})
.catch((err) => alert("Translation failed!"));
}
});

const contentContainer = document.createElement("div");
contentContainer.classList.add("content-container");
contentContainer.appendChild(titleLink);
contentContainer.appendChild(descPara);
contentContainer.appendChild(readButton);
contentContainer.appendChild(translateButton);

article.appendChild(contentContainer);
feedSection.appendChild(article);
});

feedContainer.appendChild(feedSection);
})
.catch((error) => {
console.error(`${feed.title} RSS feed fetch error:`, error);
});
});

// Feedback button event
const feedbackButton = document.getElementById("feedback-button");
feedbackButton.addEventListener("click", () => {
const subject = encodeURIComponent("Feedback");
const body = encodeURIComponent("Enter your Feedback message.");
window.location.href = `mailto:mehmetkahyakas5@gmail.com?subject=${subject}&body=${body}`;
});
// Voice commands
if (annyang) {
const commands = {
"read article *number": (number) => {
const article = document.querySelectorAll(".article")[number - 1];
if (article) {
const text = article.querySelector("p").innerText;
readArticle(text);
} else {
alert("Article not found!");
}
},
"search *query": (query) => {
const articles = document.querySelectorAll(".article");
articles.forEach((article) => {
const title = article.querySelector("a").innerText.toLowerCase();
if (!title.includes(query.toLowerCase())) {
article.style.display = "none";
} else {
article.style.display = "block";
}
});
},
};

annyang.addCommands(commands);
annyang.start();
}

// Search functionality
const searchBar = document.createElement("input");
searchBar.type = "text";
searchBar.placeholder = "Search articles...";
searchBar.addEventListener("input", (e) => {
const query = e.target.value.toLowerCase();
const articles = document.querySelectorAll(".article");
articles.forEach((article) => {
const title = article.querySelector("a").innerText.toLowerCase();
if (!title.includes(query)) {
article.style.display = "none";
} else {
article.style.display = "block";
}
});
});
document.body.insertBefore(searchBar, feedContainer);
});
