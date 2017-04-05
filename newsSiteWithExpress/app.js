var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var articleModel = require('./private/articleModel.js'),
    newsModel = new articleModel.newsModel();

var dataWorker = require('./private/dataBasesWork.js');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/firstNews', function (req, res) {
    res.json(newsModel.getArticles());

});

app.get('/articleLength', function (req, res) {
    res.end("" + newsModel.articleLength);
});

app.get('/getNewsFilter', function (req, res) {
    if (req.query.filter === "true") {
        var dateBegin = 0
            , dateEnd = 0;

        if (req.query.dateBegin != "0") {
            dateBegin = new Date(req.query.dateBegin);
        }
        if (req.query.dateEnd != "0") {
            dateEnd = new Date(req.query.dateEnd);
        }
        var filter = new articleModel.filter(req.query.author, dateBegin,
            dateEnd, req.query.teg.split(','));
        res.json(newsModel.getArticles(+req.query.skip, +req.query.top, filter));
    } else {
        res.json(newsModel.getArticles(+req.query.skip, +req.query.top));
    }
});

app.delete('/deleteNews', function (req, res) {
    newsModel.removeArticle(req.query.id);
    res.end();
});

app.post('/addNews', function (req, res) {
    var article = new articleModel.Article.fromObjToArticle(req.body);
    /*req.body.id, req.body.title, req.body.summary, new Date(req.body.createdAt),
        req.body.author, req.body.content, req.body.teg);*/
    var id = newsModel.addArticle(article);
    res.end(id);
});

app.patch('/editNews', function (req, res) {
    var article = new articleModel.Article(req.body.id, req.body.title, req.body.summary, new Date(),
        "author", req.body.content, ['teg']);
    newsModel.editArticle(req.body.id, article);
    newsModel.replaceAllTegs(req.body.id, req.body.teg);
    res.end();
});

app.get('/login', function (req, res) {
    res.end(dataWorker.findUserOrRegister(req.query.name, req.query.password));
});

app.listen(3000);
