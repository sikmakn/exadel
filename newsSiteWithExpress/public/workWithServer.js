"use strict";

function printArticles() {
    var xhrFirstArticles = new XMLHttpRequest();
    var firstArticles;

    function handler() {
        var articlesJSON = xhrFirstArticles.responseText;
        firstArticles = JSON.parse(articlesJSON, function (key, value) {
            if (key === "createdAt") {
                return new Date(value);
            }
            return value;
        });
        xhrFirstArticles.removeEventListener('load', handler);
        NEWS_VIEW.printNewsList(firstArticles);
        printPagination();
    }

    xhrFirstArticles.addEventListener('load', handler);
    xhrFirstArticles.open('GET', '/firstNews', true);
    xhrFirstArticles.send();
}

function printPagination(thisIndex) {
    var index = thisIndex || 0;
    var xhrArticleLength = new XMLHttpRequest();
    var articleLength;

    function handler() {
        articleLength = xhrArticleLength.responseText;
        articleLength = +articleLength;
        xhrArticleLength.removeEventListener('load', handler);
        ARTICLE_AMOUNT = articleLength;
        NEWS_VIEW.createPagination(index, articleLength);
    }

    xhrArticleLength.addEventListener('load', handler);
    xhrArticleLength.open('GET', '/articleLength', true);
    xhrArticleLength.send();
}

function printFilterArticles(skip, top) {
    var skip = skip || 0;
    var top = top || 9;
    var xhrArticles = new XMLHttpRequest();
    var articles;

    function handler() {
        var articlesJSON = xhrArticles.responseText;
        articles = JSON.parse(articlesJSON, function (key, value) {
            if (key === "createdAt") {
                return new Date(value);
            }
            return value;
        });
        xhrArticles.removeEventListener('load', handler);
        if (articles.length) {
            NEWS_VIEW.removeAllNews();
            NEWS_VIEW.printNewsList(articles);
            if (skip === 0) {
                printPagination();
            }
        } else {
            alert("Новостей соответствуищих фильтрам не найдено.");
            FILTER_CONFIG = null;
        }
    }

    xhrArticles.addEventListener('load', handler);
    if (FILTER_CONFIG) {
        xhrArticles.open('GET', '/getNewsFilter?skip=' + skip + '&top=' + top + '&filter=true' +
            '&author=' + FILTER_CONFIG.author + '&dateBegin=' + FILTER_CONFIG.dateBegin +
            '&dateEnd=' + FILTER_CONFIG.dateEnd + '&teg=' + FILTER_CONFIG.teg.join(','), true);
    } else {
        xhrArticles.open('GET', '/getNewsFilter?skip=' + skip + '&top=' + top + '&filter=false', true);
    }
    xhrArticles.send();
}

function addNewsOnServer(article) {
    var xhrAddArticle = new XMLHttpRequest();
    var newArticle = JSON.stringify(article);
    var id;

    function handler() {
        id = xhrAddArticle.responseText;
        var news = DOC.getElementById("temporary");
        news.id = id;
        var addButton = DOC.getElementById("add-news-button");
        addButton.onclick = clickAddNews;
        xhrAddArticle.removeEventListener('load', handler);
    }

    xhrAddArticle.addEventListener('load', handler);
    xhrAddArticle.open('POST', '/addNews', true);
    xhrAddArticle.setRequestHeader('content-type', 'application/json');
    xhrAddArticle.send(newArticle);
}

function editNewsOnServer(article) {
    var editNews = {
        id: article.id,
        title: article.title,
        summary: article.summary,
        content: article.content,
        teg: article.teg
    };

    editNews = JSON.stringify(editNews);
    var xhrEditArticle = new XMLHttpRequest();

    function handler() {
        xhrEditArticle.removeEventListener('load', handler);
    }

    xhrEditArticle.addEventListener('load', handler);
    xhrEditArticle.open('PATCH', '/editNews', true);
    xhrEditArticle.setRequestHeader('content-type', 'application/json');
    xhrEditArticle.send(editNews);
}

function deleteNewsFromServer(id) {
    var xhrDeleteArticle = new XMLHttpRequest();

    function handler() {
        xhrDeleteArticle.removeEventListener('load', handler);
    }

    xhrDeleteArticle.addEventListener('load', handler);
    xhrDeleteArticle.open('DELETE', '/deleteNews?id=' + id, true);
    xhrDeleteArticle.send();
}

function loginServer(name, password) {
    var xhrLogin = new XMLHttpRequest();

    function handler() {
        var logInArea = DOC.getElementById("log-in-area");
        var filterButton = DOC.getElementById("filter-find-button");
        var logOffButton = DOC.getElementById("log-off-button-log-off");
        var answer = xhrLogin.responseText;

        if (answer === 'successfully_registered') {
            USER = name;
            alert("Пользователь успешно зарегистрирован");
            logInArea.remove();
            unLogInUser();
            printArticles();
            logOffButton.id = "log-off-button";
            window.onresize = onresizePagination;
            filterButton.onclick = clickFilterButton;
        } else if (answer === 'successfully_login') {
            USER = name;
            logInArea.remove();
            unLogInUser();
            printArticles();

            window.onresize = onresizePagination;
            filterButton.onclick = clickFilterButton;
        } else {
            alert("Неверный пароль");
        }
        xhrLogin.removeEventListener('load', handler);
    }

    xhrLogin.addEventListener('load', handler);
    xhrLogin.open('GET', '/login?name=' + name + '&password=' + password, true);
    xhrLogin.send();
}