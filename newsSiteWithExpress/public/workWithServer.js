"use strict";

function printArticles() {
    const xhrFirstArticles = new XMLHttpRequest();

    function handler() {
        const articlesJSON = xhrFirstArticles.responseText;
        const firstArticles = JSON.parse(articlesJSON, (key, value) => {
            if (key === "createdAt") return new Date(value);
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

function printPagination(thisIndex = 0) {
    const xhrArticleLength = new XMLHttpRequest();
    //let articleLength;

    function handler() {
        const articleLength = Number(xhrArticleLength.responseText);
        xhrArticleLength.removeEventListener('load', handler);
        ARTICLE_AMOUNT = articleLength;
        NEWS_VIEW.createPagination(thisIndex, articleLength);
    }

    xhrArticleLength.addEventListener('load', handler);
    xhrArticleLength.open('GET', '/articleLength', true);
    xhrArticleLength.send();
}

function printFilterArticles(skip = 0, top = 9) {
    const xhrArticles = new XMLHttpRequest();
    // let articles;

    function handler() {
        const articlesJSON = xhrArticles.responseText;

        const articles = JSON.parse(articlesJSON, (key, value) => {
            if (key === "createdAt") return new Date(value);
            return value;
        });
        xhrArticles.removeEventListener('load', handler);
        if (articles.length) {
            NEWS_VIEW.removeAllNews();
            NEWS_VIEW.printNewsList(articles);
            if (!skip) {
                printPagination();
            }
        } else {
            alert("Новостей соответствуищих фильтрам не найдено.");
            FILTER_CONFIG = null;
        }
    }

    xhrArticles.addEventListener('load', handler);
    if (FILTER_CONFIG) {
        xhrArticles.open(
            'GET',
            '/getNewsFilter?skip=' + skip +
            '&top=' + top +
            '&filter=true' +
            '&author=' + FILTER_CONFIG.author +
            '&dateBegin=' + FILTER_CONFIG.dateBegin +
            '&dateEnd=' + FILTER_CONFIG.dateEnd +
            '&teg=' + FILTER_CONFIG.teg.join(','),
            true
        );
    } else {
        xhrArticles.open(
            'GET',
            '/getNewsFilter?skip=' + skip +
            '&top=' + top +
            '&filter=false',
            true);
    }
    xhrArticles.send();
}

function addNewsOnServer(article) {
    const xhrAddArticle = new XMLHttpRequest();
    const newArticle = JSON.stringify(article);

    function handler() {
        const id = xhrAddArticle.responseText;
        const news = DOC.getElementById("temporary");
        news.id = id;
        const addButton = DOC.getElementById("add-news-button");
        addButton.onclick = clickAddNews;
        xhrAddArticle.removeEventListener('load', handler);
    }

    xhrAddArticle.addEventListener('load', handler);
    xhrAddArticle.open('POST', '/addNews', true);
    xhrAddArticle.setRequestHeader('content-type', 'application/json');
    xhrAddArticle.send(newArticle);
}

function editNewsOnServer(article) {
    const editNews = {
        id: article.id,
        title: article.title,
        summary: article.summary,
        content: article.content,
        teg: article.teg
    };

    const editNewsJSON = JSON.stringify(editNews);
    const xhrEditArticle = new XMLHttpRequest();

    function handler() {
        xhrEditArticle.removeEventListener('load', handler);
    }

    xhrEditArticle.addEventListener('load', handler);
    xhrEditArticle.open('PATCH', '/editNews', true);
    xhrEditArticle.setRequestHeader('content-type', 'application/json');
    xhrEditArticle.send(editNewsJSON);
}

function deleteNewsFromServer(id) {
    const xhrDeleteArticle = new XMLHttpRequest();

    function handler() {
        xhrDeleteArticle.removeEventListener('load', handler);
    }

    xhrDeleteArticle.addEventListener('load', handler);
    xhrDeleteArticle.open('DELETE', '/deleteNews?id=' + id, true);
    xhrDeleteArticle.send();
}

function loginServer(name, password) {
    const xhrLogin = new XMLHttpRequest();

    function handler() {
        const logInArea = DOC.getElementById("log-in-area");
        const filterButton = DOC.getElementById("filter-find-button");
        const logOffButton = DOC.getElementById("log-off-button-log-off");
        const answer = xhrLogin.responseText;

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