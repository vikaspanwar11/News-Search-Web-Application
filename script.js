const apiKey = '4b17b2b6c99c476dab53b52e2515eb52';

const blogContainer = document.getElementById('blog-container');
const searchField = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

async function fetchNews(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error("Error fetching news", error);
        return [];
    }
}

async function fetchRandomNews() {
    const apiUrl = `https://newsapi.org/v2/everything?q=us&pageSize=10&apiKey=${apiKey}`;
    return await fetchNews(apiUrl);
}

async function fetchNewsQuery(query) {
    const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=10&apiKey=${apiKey}`;
    return await fetchNews(apiUrl);
}

function displayBlogs(articles) {
    blogContainer.innerHTML = "";
    if (articles.length === 0) {
        blogContainer.innerHTML = "<p>No articles found.</p>";
        return;
    }
    articles.forEach((article) => {
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");

        const img = document.createElement("img");
        img.src = article.urlToImage || 'default.jpg'; // Fallback image
        img.alt = article.title;

        const title = document.createElement("h2");
        const truncatedTitle = article.title.length > 30 ? article.title.slice(0, 30) + "...." : article.title;
        title.textContent = truncatedTitle;

        const description = document.createElement("p");
        const truncatedDesc = article.description.length > 120 ? article.description.slice(0, 120) + "...." : article.description;
        description.textContent = truncatedDesc;

        blogCard.appendChild(img);
        blogCard.appendChild(title);
        blogCard.addEventListener('click', () => {
            window.open(article.url, "_blank");
        });
        blogCard.appendChild(description);

        blogContainer.appendChild(blogCard);
    });
}

searchButton.addEventListener('click', async () => {
    const query = searchField.value.trim();
    if (query !== "") {
        try {
            const articles = await fetchNewsQuery(query);
            displayBlogs(articles);
        } catch (error) {
            console.error("Error fetching news by query", error);
            blogContainer.innerHTML = "<p>Error fetching news. Please try again later.</p>";
        }
    }
});

(async () => {
    try {
        const articles = await fetchRandomNews();
        displayBlogs(articles);
    } catch (error) {
        console.error("Error fetching random news", error);
        blogContainer.innerHTML = "<p>Error fetching news. Please try again later.</p>";
    }
})();
