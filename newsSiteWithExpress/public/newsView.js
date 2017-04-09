"use strict";

/*VIEW */

const TIME_OPTIONS = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric'
};

function unLogInUser() {
    const login = DOC.getElementById('login');
    let addNewsButton;
    let logOffButton;
    let logInButton;
    if (!USER) {
        addNewsButton = DOC.getElementById("add-news-button");
        logOffButton = DOC.getElementById("log-off-button");
        logInButton = DOC.getElementById('log-in-button');
        addNewsButton.id = 'add-news-button-log-off';
        logOffButton.id = "log-off-button-log-off";
        logInButton.id = 'log-in-button-log-off';
        login.innerHTML = "войдите";
    } else {
        login.innerHTML = USER;
        addNewsButton = DOC.getElementById("add-news-button-log-off");
        logOffButton = DOC.getElementById("log-off-button-log-off");
        logInButton = DOC.getElementById("log-in-button-log-off");
        addNewsButton.id = "add-news-button";
        logOffButton.id = "log-off-button";
        if (logInButton) {
            logInButton.id = "log-in-button";
        }
    }
}

function NewsView() {

    this.printNewsList = function (articles) {
        const main = DOC.getElementsByTagName("main")[0];
        articles.forEach(function (article) {
            const divMain = oneNews(article);
            main.appendChild(divMain);
        });
    };

    this.createPagination = function (id, articleLength = ARTICLE_AMOUNT) {
        const pagination = DOC.getElementById("pagination");
        const pageCount = Math.ceil(articleLength / 10);
        let pageId;
        let pageIndex;
        let index;

        if (id === undefined || typeof id === 'string' || id instanceof Object) {
            id = 0;
        }
        pagination.innerHTML = "";

        if (window.innerWidth > 500) {
            const offsetWidth = pagination.offsetWidth - 2;
            const lengthButton = 50;
            const possibleCountIndexes = Math.floor(offsetWidth / lengthButton);

            pageId = "page" + 1;
            pageIndex = DOC.createElement("button");
            pageIndex.href = "javascript:void(0)";
            pageIndex.id = pageId;
            pageIndex.onclick = goInPage;
            pageIndex.innerHTML = 1;
            if (id === 1 || id === 0) {
                pageIndex.className = "pagination-checked";
                pageIndex.disabled = "disabled";
            }
            pagination.appendChild(pageIndex);

            if (id < Math.ceil(possibleCountIndexes / 2)) {

                let limit = possibleCountIndexes - 1;
                if (pageCount === possibleCountIndexes) {
                    limit = possibleCountIndexes;
                } else if (pageCount === 1) {
                    limit += 2;
                }

                for (let i = 2; i <= pageCount && i < limit; i++) {
                    pageId = "page" + i;
                    pageIndex = DOC.createElement("button");
                    pageIndex.href = "javascript:void(0)";
                    pageIndex.id = pageId;
                    pageIndex.onclick = goInPage;
                    pageIndex.innerHTML = i;
                    if (id === i) {
                        pageIndex.className = "pagination-checked";
                        pageIndex.disabled = "disabled";
                    }
                    pagination.appendChild(pageIndex);
                    index = i;
                }

            } else {

                if (id - Math.ceil(possibleCountIndexes / 2) > 0) {
                    pageIndex = DOC.createElement("button");
                    pageIndex.href = "javascript:void(0)";
                    pageIndex.disabled = "disabled";
                    pageIndex.innerHTML = "...";
                    pagination.appendChild(pageIndex);
                }

                let start = id - Math.ceil(possibleCountIndexes / 2) + 2;
                let limit = Math.ceil(possibleCountIndexes / 2) + id - 2;

                if (id >= pageCount - possibleCountIndexes / 2) {
                    start = pageCount - possibleCountIndexes + 3;
                    limit = pageCount + 1;
                }

                for (let i = start; i <= pageCount && i < limit; i++) {
                    pageId = "page" + i;
                    pageIndex = DOC.createElement("button");
                    pageIndex.href = "javascript:void(0)";
                    pageIndex.id = pageId;
                    pageIndex.onclick = goInPage;
                    pageIndex.innerHTML = i;
                    if (id === i) {
                        pageIndex.className = "pagination-checked";
                        pageIndex.disabled = "disabled";
                    }
                    pagination.appendChild(pageIndex);
                    index = i;
                }
            }

            if (index < pageCount) {
                if (pageCount !== possibleCountIndexes && id !== pageCount) {
                    pageIndex = DOC.createElement("button");
                    pageIndex.href = "javascript:void(0)";
                    pageIndex.disabled = "disabled";
                    pageIndex.innerHTML = "...";
                    pagination.appendChild(pageIndex);
                }
                pageId = "page" + pageCount;
                pageIndex = DOC.createElement("button");
                pageIndex.href = "javascript:void(0)";
                pageIndex.id = pageId;
                if (id === pageCount) {
                    pageIndex.className = "pagination-checked";
                    pageIndex.disabled = "disabled";
                }
                pageIndex.onclick = goInPage;
                pageIndex.innerHTML = pageCount;
                pagination.appendChild(pageIndex);
            }
        } else {
            if (id === 0) {
                id++;
            }
            if (id !== 1) {
                pageId = "page" + (id - 1);
                pageIndex = DOC.createElement("button");
                pageIndex.href = "javascript:void(0)";
                pageIndex.id = pageId;
                pageIndex.onclick = goInPage;
                pageIndex.innerHTML = "<-";
                pagination.appendChild(pageIndex);
            } else {
                pageIndex = DOC.createElement("button");
                pageIndex.href = "javascript:void(0)";
                pageIndex.disabled = "disabled";
                pageIndex.innerHTML = "...";
                pagination.appendChild(pageIndex);
            }

            if (id !== pageCount) {
                pageId = "page" + (id + 1);
                pageIndex = DOC.createElement("button");
                pageIndex.href = "javascript:void(0)";
                pageIndex.id = pageId;
                pageIndex.onclick = goInPage;
                pageIndex.innerHTML = "->";
                pagination.appendChild(pageIndex);
            } else {
                pageIndex = DOC.createElement("button");
                pageIndex.href = "javascript:void(0)";
                pageIndex.disabled = "disabled";
                pageIndex.innerHTML = "...";
                pagination.appendChild(pageIndex);
            }
        }
    };

    this.addOneNews = function (article) {
        const main = DOC.getElementsByTagName('main')[0];
        const divMain = oneNews(article);
        const firstDivInMain = main.children[1];
        main.insertBefore(divMain, firstDivInMain);
    };

    this.removeNews = function (id) {
        const news = DOC.getElementById(id);
        news.parentNode.removeChild(news);
    };

    this.removeAllNews = function () {
        const allNews = DOC.getElementsByClassName("one-news");
        for (let i = allNews.length - 1; i >= 0; i--) {
            allNews[i].parentNode.removeChild(allNews[i]);
        }
    };

    this.editNews = function (id, article) {
        const news = DOC.getElementById(id);
        const newsArea = news.children[3];
        const title = newsArea.children[0];
        const summary = newsArea.children[1];
        const content = newsArea.children[2];
        title.innerHTML = article.title;
        summary.innerHTML = article.summary;
        content.innerHTML = article.content;
    };

    this.editTegsNews = function (id, tegs) {
        const divTegs = DOC.getElementById("teg-" + id);
        divTegs.innerHTML = "<a href='error.html'/> " + tegs.join("</a>  <a href='error.html'/> ");
    };

    function oneNews(article) {
        const divMain = DOC.createElement("div");
        const divTegs = DOC.createElement("div");
        const buttonRedact = DOC.createElement("button");
        const buttonDelete = DOC.createElement("button");
        const newsArea = DOC.createElement("a");
        const divAuthor = DOC.createElement('div');
        const divDate = DOC.createElement('div');
        const saveButton = DOC.createElement("button");
        const canselButton = DOC.createElement("button");

        divMain.id = article._id;
        divMain.className = "one-news";

        divTegs.id = "teg-" + article._id;
        divTegs.innerHTML = "<a/>" + article.teg.join("</a>  <a/>");
        if (USER) {
            divTegs.className = "teg-area";
            buttonRedact.className = "edit-news-button";
            buttonDelete.className = "delete-news-button";
        } else {
            divTegs.className = "teg-area-log-off";
            buttonRedact.className = "edit-news-button-log-off";
            buttonDelete.className = "delete-news-button-log-off";
        }

        buttonRedact.onclick = clickRedactNews;
        buttonDelete.onclick = clickRemoveNews;

        newsArea.className = "news-area";
        newsArea.onclick = clickForFullNews;
        newsArea.innerHTML = "<h1 class ='news-header'>" + article.title + "</h1>" +
            "<p class='news-summary'>" + article.summary + "</p>" + "<p class='news-full-text-unvisible'>" + article.content + "</p> ";

        saveButton.innerHTML = "Сохранить";
        saveButton.onclick = clickSaveRedactNews;
        saveButton.className = "news-edit-button-unvisible";
        newsArea.appendChild(saveButton);

        canselButton.innerHTML = "Отмена";
        canselButton.onclick = clickCanselRedactNews;
        canselButton.className = "news-edit-button-unvisible";
        newsArea.appendChild(canselButton);

        divAuthor.className = 'news-author';
        divAuthor.innerHTML = article.author;

        divDate.className = 'news-date';
        divDate.innerHTML = article.createdAt.toLocaleString('ru', TIME_OPTIONS);

        divMain.appendChild(divTegs);
        divMain.appendChild(buttonRedact);
        divMain.appendChild(buttonDelete);
        divMain.appendChild(newsArea);
        divMain.appendChild(divAuthor);
        divMain.appendChild(divDate);
        return divMain;
    }

}

