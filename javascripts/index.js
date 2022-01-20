'use_strict';

const codeMirrors = [];

document.addEventListener("DOMContentLoaded", () => {
  renderPortfolio();
  // renderArticles();

});

function renderPortfolio() {
  var myCodeMirror = CodeMirror(document.querySelector("#portfolio"), {
    value: "def sayHello\n  puts 'hello'\nend",
    mode:  "ruby",
    theme: "lucario",
  });

  setTimeout(() => {
    myCodeMirror.refresh();
  }, 0);

  s("a[href='#portfolio']").addEventListener("click", () => {
    setTimeout(() => {
      myCodeMirror.refresh();
    }, 0);
  });
}

function renderArticles() {
  articles.forEach((article, i) => {
    s("#writing").appendChild(
      el("div", {}, false,
        el("a", {
          class: "article_link",
          href: "#" + article.title,
          "data-article_id": i,
        }, article.title),
        el("article", { id: `a${i}`, loading: "lazy" }, false,
          ...article.content.map(createSegment)
        )
      )
    );
  });

  sA(".article_link").forEach(article_link => {
    article_link.textContent = "+ " + article_link.textContent;
    article_link.addEventListener("click", expandArticle, { once: true });
  });

  sA("textarea").forEach(textarea => {
    codeMirrors.push(
      CodeMirror.fromTextArea(textarea, {
        mode: "javascript", theme: "lucario"
      })
    );
  });
}

function createSegment(segmentData) {
  switch (segmentData.type) {
    case "h":
      return el("h4", {}, segmentData.text);
    case "p":
      return el("p", {}, segmentData.text);
    case "code":
      return el("textarea", {}, segmentData.text.trim());
  }
}

function expandArticle(event) {
  event.preventDefault();

  s("#a" + event.target.dataset.article_id).style.display = "block";
  event.target.addEventListener("click", collapseArticle, { once: true });
  event.target.textContent = event.target.textContent.replace(/\+ /, '- ');

  setTimeout(() => {
    codeMirrors.forEach(mirror => mirror.refresh());
  }, 0);
}

function collapseArticle(event) {
  event.preventDefault();

  s("#a" + event.target.dataset.article_id).style.display = "none";
  event.target.addEventListener("click", expandArticle, { once: true });
  event.target.textContent = event.target.textContent.replace(/\- /, '+ ');
}

function el(name, attrs={}, text=false, ...children) {
  const element = document.createElement(name);
  Object.keys(attrs).forEach(attr => element.setAttribute(attr, attrs[attr]));
  if (text) element.textContent = text;
  children.forEach(child => element.appendChild(child));
  return element
}

function s(selector) {
  return document.querySelector(selector);
}

function sA(selector) {
  return document.querySelectorAll(selector);
}
