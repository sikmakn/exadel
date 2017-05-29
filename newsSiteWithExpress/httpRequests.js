const ArticleService = require('./private/articleService.js');
const MongoClient = require('mongodb').MongoClient;

module.exports = (app, passport) => {
  app.get('/firstNews', (req, res) => {
    ArticleService.findArticles()
      .then((articlesArr) => {
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
      return;
    }
    MongoClient.connect('mongodb://localhost/myStore')
    .then((db) => {
      const usersCollection = db.collection('users');
      usersCollection
        .find({ username: req.session.user })
        .nextObject((err, user) => {
          if (err) res.status(500).json(err);
          req.body.author = user.username;
          ArticleService.createArticle(req.body)
            .then((id) => {
              res.json(id);
            })
            .catch(error => res.status(500).json(error));
        });
    }).catch((err) => {
      res.status(500).json(err);
    });
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
