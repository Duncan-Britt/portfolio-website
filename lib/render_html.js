const fs = require('fs');
const marked = require('marked');

const articles = [];
const portfolioArticles = [];
let count;
fs.readdir("../articles", (err, filenames) => {
  if (err) return console.log(err);

  count = filenames.length;
  filenames.forEach(filename => {
    fs.readFile('../articles/' + filename, 'utf8', articleFileHandler);
  })
});

function articleFileHandler(err, text) {
  if (err) return console.log(err);

  const dateStr = text.match(/\d{2}\/\d{2}\/\d{4}/)[0];
  text = text.replace(/\d{2}\/\d{2}\/\d{4}/, '').trim();

  const html = marked.parse(text);
  articles.push({dateStr, html});
  count -= 1;
  if (count === 0) {
    fs.writeFile("../public/javascripts/articles.js",
      formatArticles(articles),
      err => { if (err) return console.log(err); }
    );

    fs.readdir("../portfolio_writeups", (err, filenames) => {
      if (err) return console.log(err);

      count = filenames.length;
      filenames.forEach(filename => {
        fs.readFile('../portfolio_writeups/' + filename, 'utf8', portfolioFileHandler);
      })
    });
  }
}

function portfolioFileHandler(err, text) {
  if (err) return console.log(err);

  const dateStr = text.match(/\d{2}\/\d{2}\/\d{4}/)[0];
  text = text.replace(/\d{2}\/\d{2}\/\d{4}/, '').trim();

  const html = marked.parse(text);
  portfolioArticles.push({dateStr, html});
  count -= 1;
  if (count === 0) {
    fs.writeFile("../public/javascripts/portfolioArticles.js",
      formatPortfolioArticles(portfolioArticles),
      err => { if (err) return console.log(err); }
    );
  }
}

function formatArticles(articles) {
  return "const articles = " + JSON.stringify(articles);
}

function formatPortfolioArticles(articles) {
  return "const portfolioArticles = " + JSON.stringify(articles);
}
