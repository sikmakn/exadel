const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const ArticleService = require('./private/articleService.js');

const dataWorker = require('./private/dataBasesWork.js');

app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/firstNews', (req, res) => {
  res.json(ArticleService.findArticles());
});

app.get('/articlesLength', (req, res) => {
  res.end(String(ArticleService.findArticlesLength()));
});

app.post('/postNewsFilter', (req, res) => {
  if (req.body.dateBegin) req.body.dateBegin = new Date(req.body.dateBegin);
  if (req.body.dateEnd) req.body.dateEnd = new Date(req.body.dateEnd);
  const articles = ArticleService.findArticles(
    req.body.skip,
    req.body.top,
    req.body);
  res.json(articles);
});

app.delete('/deleteNews', (req, res) => {
  ArticleService.deleteArticle(req.query.id);
  res.end();
});

app.post('/addNews', (req, res) => {
  req.body.createdAt = new Date(req.body.createdAt);
  const id = ArticleService.createArticle(req.body);
  res.end(id);
});

app.patch('/editNews', (req, res) => {
  ArticleService.updateArticle(req.body);
  res.end();
});

app.get('/login', (req, res) => {
  res.end(dataWorker.findUserOrRegister(req.query.name, req.query.password));
});

app.listen(3000);
