'use_strict';

const codeMirrors = [];

document.addEventListener("DOMContentLoaded", () => {
  renderPortfolio();
  renderArticles();
});

function renderArticles() {
  articles.sort((a, b) => new Date(a.dateStr) > new Date(b.dateStr) ? -1 : 0);

  s("#writing").insertAdjacentHTML("beforeend",
    articles.map(article => article.html).join("")
  );

  sA(".article_link").forEach(article_link => {
    article_link.textContent = "+ " + article_link.textContent;
    article_link.addEventListener("click", expandArticle, { once: true });
  });

  sA("#writing article textarea").forEach(textarea => {
    codeMirrors.push(
      CodeMirror.fromTextArea(textarea, {
        mode: "javascript", theme: "lucario", tabSize: 2, viewportMargin: Infinity,
      })
    );
  });
}

function renderPortfolio() {
  portfolioArticles.sort((a, b) => new Date(a.dateStr) > new Date(b.dateStr) ? -1 : 0);

  s("#portfolio").insertAdjacentHTML("beforeend",
    portfolioArticles.map(article => article.html).join("")
  );

  sA(".portfolio_link").forEach(article_link => {
    article_link.textContent = "+ " + article_link.textContent;
    article_link.addEventListener("click", expandArticle, { once: true });
  });

  sA("#portfolio article textarea").forEach(textarea => {
    const lang = textarea.dataset.lang;
    codeMirrors.push(
      CodeMirror.fromTextArea(textarea, {
        mode: lang, theme: "lucario", tabSize: 2, viewportMargin: Infinity,
      })
    );
  });

  sA("#portfolio .CodeMirror").forEach(codemirror => {
    // codemirror.classList.add('limit');
  });
}

function expandArticle(event) {
  event.preventDefault();

  s(event.target.href.match(/\#\w+$/)[0]).style.display = "block";
  event.target.addEventListener("click", collapseArticle, { once: true });
  event.target.textContent = event.target.textContent.replace(/\+ /, '- ');

  setTimeout(() => {
    codeMirrors.forEach(mirror => mirror.refresh());
  }, 0);
}

function collapseArticle(event) {
  event.preventDefault();

  s(event.target.href.match(/\#\w+$/)[0]).style.display = "none";
  event.target.addEventListener("click", expandArticle, { once: true });
  event.target.textContent = event.target.textContent.replace(/\- /, '+ ');
}

// function el(name, attrs={}, text=false, ...children) {
//   const element = document.createElement(name);
//   Object.keys(attrs).forEach(attr => element.setAttribute(attr, attrs[attr]));
//   if (text) element.textContent = text;
//   children.forEach(child => element.appendChild(child));
//   return element
// }

function s(selector) {
  return document.querySelector(selector);
}

function sA(selector) {
  return document.querySelectorAll(selector);
}
