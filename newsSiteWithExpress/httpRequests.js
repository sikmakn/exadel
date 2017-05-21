const ArticleService = require('./private/articleService.js');
const usersDB = require('./private/passportWork/usersDB').usersDB;

module.exports = (app, passport) => {
  app.get('/firstNews', (req, res) => {
    ArticleService.findArticles()
      .then(function (articlesArr) {
        res.json(articlesArr);
      })
      .catch(err => res.end(err));
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
    articles.then(articlesArr => res.json(articlesArr));
  });

  app.delete('/deleteNews', (req, res) => {
    ArticleService.deleteArticle(req.query.id);
    res.end();
  });

  app.post('/addNews', (req, res) => {
    req.body.createdAt = new Date(req.body.createdAt);
    if (!req.session.user) {
      res.status(500).json(new Error('You not login'));
    } else {
      req.body.author = usersDB.findOne({ _id: req.session.user }).login;
      ArticleService.createArticle(req.body)
        .then(id => res.end(id))
        .catch(err => res.status(500).json(err));
    }
  });

  app.patch('/editNews', (req, res) => {
    ArticleService.updateArticle(req.body);
    res.end();
  });

  app.post('/login', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
      if (err) return res.end(err);
      return res.end(info);
    })(req, res, next);
  });

  app.get('/logout', (req, res) => {
    delete req.session.user;
    res.redirect('/');
  });
};
