"use strict";

var DOC = document;

window.onunload = unloadLocalStorageArticles;

function onresizePagination() {
    NEWS_VIEW.createPagination(INDEX_THIS_PAGE);
    if (window.innerWidth > 500) {

        var pagesButton = DOC.getElementsByClassName("pagination-checked")[0],
            thisPageButton = DOC.getElementById("page" + INDEX_THIS_PAGE);

        pagesButton.className = "";
        pagesButton.disabled = "";
        thisPageButton.className = "pagination-checked";
        thisPageButton.disabled = "disabled";
    }

};
window.onresize = onresizePagination;

function clickForFullNews(event) {
    var flag;
    var newsContent = this.children[2],
        newsTitle = this.children[1];
    if ("news-full-text-visible" === newsContent.className) {
        newsContent.className = "news-full-text-unvisible";
        newsTitle.className = "news-summary";
    } else {
        newsContent.className = "news-full-text-visible";
        newsTitle.className = "news-summary-at-full";
    }

};

function clickRemoveNews() {
    if (confirm("Вы действительно хотите удалить эту новость?")) {
        var id = this.parentNode.id;
        if (!removeArticle("" + id)) {
            alert("Новость не удалось удалить");
        }
    }
};

function clickRedactNews() {
    var divMain = this.parentNode,
        tegArea = divMain.children[0],
        newsArea = divMain.children[3],
        header = newsArea.children[0],
        summary = newsArea.children[1],
        content = newsArea.children[2],
        saveButton = newsArea.children[3],
        canselButton = newsArea.children[4];

    header.contentEditable = true;
    summary.contentEditable = true;
    content.contentEditable = true;
    tegArea.contentEditable = true;

    if (tegArea.children.length) {
        var tegsString = "";
        for (var i = 0; i < tegArea.children.length; i++) {
            if (tegArea.children[i].innerHTML !== "")
                tegsString += tegArea.children[i].innerHTML + ",";
        }
        tegArea.innerHTML = tegsString;
        if ("news-full-text-unvisible" == content.className) {
            newsArea.dispatchEvent(new Event("click"));
        }

        header.style.backgroundColor = "#eef4f9";
        summary.style.backgroundColor = "#eef4f9";
        content.style.backgroundColor = "#eef4f9";
        tegArea.style.backgroundColor = "darkgrey";

        saveButton.className = "news-edit-button-visible";
        canselButton.className = "news-edit-button-visible";

        newsArea.appendChild(saveButton);
        newsArea.appendChild(canselButton);

        newsArea.onclick = "";
    }
};

function clickSaveRedactNews() {
    var newsArea = this.parentNode,
        id = newsArea.parentNode.id,
        header = newsArea.children[0],
        summary = newsArea.children[1],
        content = newsArea.children[2],
        saveButton = newsArea.children[3],
        canselButton = newsArea.children[4],
        divMain = newsArea.parentNode,
        tegArea = divMain.children[0],
        article;

    if (header.innerHTML && summary.innerHTML && content.innerHTML && tegArea.innerHTML &&
        header.innerHTML !== "Заголовок" && summary.innerHTML !== "краткое описание" && content.innerHTML !== "Полный текст новости") {

        var tegs = tegArea.innerHTML.split(","),
            errorTegFlag = false;
        if (tegs[tegs.length - 1] == "") {
            tegs.pop();
        }
        if (tegs.length > 5) {
            alert("Тегов должно быть не более 5(пяти)");
            errorTegFlag = true;
        } else {
            tegs.forEach(function (item) {
                if (item === "Теги" || item === "через" || item === "запятую" || item === "максимум" || item === "пять") {
                    errorTegFlag = true;
                }
            });
            if (!errorTegFlag) {
                article = new Article(id + "", header.innerHTML, summary.innerHTML, new Date, USER, content.innerHTML, tegs);
                tegArea.innerHTML = "<a/>" + tegs.join("</a>  <a/>");
                if (!editArticle(id, article)) {
                    NEWS_MODEL.addArticle(article);
                }

                newsArea.onclick = clickForFullNews;
                header.contentEditable = summary.contentEditable = content.contentEditable = tegArea.contentEditable = false;
                header.style.backgroundColor = summary.style.backgroundColor = content.style.backgroundColor = tegArea.style.backgroundColor = "";

                saveButton.className = "news-edit-button-unvisible";
                canselButton.className = "news-edit-button-unvisible";
            } else {
                alert("Введите теги");
            }
        }
    } else {
        alert("Не все поля заполнены.");
    }
};

function clickCanselRedactNews() {
    var newsArea = this.parentNode,
        id = newsArea.parentNode.id,
        header = newsArea.children[0],
        summary = newsArea.children[1],
        content = newsArea.children[2],
        saveButton = newsArea.children[3],
        canselButton = newsArea.children[4],
        divMain = newsArea.parentNode,
        tegArea = divMain.children[0];

    if (!NEWS_MODEL.getArticle(id)) {
        NEWS_VIEW.removeNews(id);
    } else {
        var tegs = tegArea.innerHTML.split(",");
        tegArea.innerHTML = "<a/>" + tegs.join("</a>  <a/>");

        newsArea.onclick = clickForFullNews;
        header.contentEditable = summary.contentEditable = content.contentEditable = tegArea.contentEditable = false;
        header.style.backgroundColor = summary.style.backgroundColor = content.style.backgroundColor = tegArea.style.backgroundColor = "";

        saveButton.className = "news-edit-button-unvisible";
        canselButton.className = "news-edit-button-unvisible";
    }
};

function goInPage(event) {
    INDEX_THIS_PAGE = +this.id.split("e")[1];
    var id = this.id,
        parent = this.parentNode;

    //   event.preventDefault();
    NEWS_VIEW.removeAllNews();
    var articles = NEWS_MODEL.getArticles(INDEX_THIS_PAGE * 10 - 10, INDEX_THIS_PAGE * 10, FILTER_CONFIG)
    NEWS_VIEW.printNewsList(articles);

    if (window.innerWidth > 500) {
        if ((this.nextSibling && this.nextSibling.disabled) || (this.previousSibling && this.previousSibling.disabled)) {
            NEWS_VIEW.createPagination(INDEX_THIS_PAGE);
            var pagesButton = parent.childNodes;
            for (var i = 0; i < pagesButton.length; i++) {
                if (pagesButton[i].className == "pagination-checked") {
                    pagesButton[i].className = "";
                    pagesButton[i].disabled = "";
                }
                if (pagesButton[i].id == id) {
                    pagesButton[i].className = "pagination-checked";
                    pagesButton[i].disabled = "disabled";
                }
            }
        } else {
            var pagesButton = this.parentNode.childNodes;
            pagesButton.forEach(function (item) {
                item.className = "";
                item.disabled = "";
            });
            this.className = "pagination-checked";
            this.disabled = "disabled";
        }
    } else {
        NEWS_VIEW.createPagination(INDEX_THIS_PAGE);
    }
};

var filterButton = DOC.getElementById("filter-find-button");
filterButton.onclick = clickFilterButton;
function clickFilterButton() {
    var beginDateAdded = DOC.getElementById("begin-date-added-filter"),
        endDateAdded = DOC.getElementById("end-date-added-filter"),
        authorName = DOC.getElementById("author-name-filter"),
        tegsFilter = DOC.getElementById("tegs-filter"),
        beginDateAddedValue = beginDateAdded.value,
        endDateAddedValue = endDateAdded.value,
        authorNameValue = authorName.value,
        tegsFilterValue = tegsFilter.value,
        articles,
        dateBegin,
        dateEnd,
        rePrintFlag = true;

    if (beginDateAddedValue || authorNameValue || tegsFilterValue || endDateAddedValue) {
        if (beginDateAddedValue) {
            if (/\d\d\d\d\.\d\d\.\d\d/.test(beginDateAddedValue)) {
                dateBegin = new Date(beginDateAddedValue);
            } else {
                alert("Дата начала поиска введена неверно");
                rePrintFlag = false;
            }
        } else {
            dateEnd = 0;
        }
        if (endDateAddedValue) {
            if (/\d\d\d\d\.\d\d\.\d\d/.test(endDateAddedValue)) {
                dateEnd = new Date(endDateAddedValue);
            } else {
                alert("Дата конца поиска введена неверно");
                rePrintFlag = false;
            }
        } else {
            dateEnd = 0;
        }
        if (rePrintFlag) {
            var tegs = tegsFilterValue.split(",");
            FILTER_CONFIG = new FilterConfig(authorNameValue, dateBegin, dateEnd, tegs);

            articles = NEWS_MODEL.getArticles(0, 9, FILTER_CONFIG);
            if (articles.length) {
                NEWS_VIEW.removeAllNews();
                NEWS_VIEW.printNewsList(articles);
                NEWS_VIEW.createPagination();
            } else {
                alert("Новостей соответствуищих фильтрам не найдено.");
                FILTER_CONFIG = null;
            }
        }
        beginDateAdded.value = authorName.value = tegsFilter.value = endDateAdded.value = "";

    } else /*if (DOC.getElementsByClassName("one-news").length) */{
        NEWS_VIEW.removeAllNews();
        FILTER_CONFIG = null;
        printArticles();
    }
};

var addNewsButton = DOC.getElementById("add-news-button");
addNewsButton.onclick = function () {
    var date = new Date();
    var newId = date.getTime();
    NEWS_VIEW.addOneNews(new Article(newId + "", "Заголовок", "краткое описание", new Date(), USER,
        "Полный текст новости", ["Теги", "через", "запятую", "максимум", "5"]));
    var news = DOC.getElementById(newId + "");
    news.children[1].dispatchEvent(new Event("click"));
};

var logOffButton = DOC.getElementById("log-off-button");
logOffButton.onclick = function () {
    USER = null;
    unLogInUser();
    NEWS_VIEW.removeAllNews();
    printArticles();
};

var logInButton = DOC.getElementById("log-in-button");
logInButton.onclick = function () {
    NEWS_VIEW.removeAllNews();
    var filterButton = DOC.getElementById("filter-find-button"),
        pagination = DOC.getElementById("pagination");
    pagination.innerHTML = "";
    filterButton.onclick = "";
    window.onresize = "";

    var logInArea = DOC.createElement("div"),
        title = DOC.createElement("h3"),
        pLogin = DOC.createElement("p"),
        nameTextarea = DOC.createElement("textarea"),
        pPassword = DOC.createElement("p"),
        passwordTextarea = DOC.createElement("textarea"),
        inputLoginButton = DOC.createElement("button");

    logInArea.id = "log-in-area";
    title.innerHTML = "Введите логин и пароль, если вы не зарегестрированы, то это произойдет автоматически.";
    pLogin.innerHTML = "Логин:";
    pPassword.innerHTML = "Пароль";
    nameTextarea.id = "input-login";
    passwordTextarea.id = "input-password";
    nameTextarea.onkeydown = loginTextareaKeyDown;
    passwordTextarea.onkeydown = loginTextareaKeyDown;
    inputLoginButton.id = "input-login-button";
    inputLoginButton.innerHTML = "Войти/Сохранить";
    inputLoginButton.onclick = clickInputLoginButton;

    logInArea.appendChild(title);
    logInArea.appendChild(pLogin);
    logInArea.appendChild(nameTextarea);
    logInArea.appendChild(pPassword);
    logInArea.appendChild(passwordTextarea);
    logInArea.appendChild(inputLoginButton);

    var main = DOC.getElementsByTagName("main")[0];
    main.appendChild(logInArea);

    this.id = "log-in-button";
};

function loginTextareaKeyDown(event) {
    if (event.keyCode == 13) {
        return false;
    }
    return true;
}

function clickInputLoginButton() {
    var logInArea = this.parentNode,
        nameTextarea = logInArea.children[2],
        passwordTextarea = logInArea.children[4],
        name = nameTextarea.value,
        password = passwordTextarea.value,
        filterButton = DOC.getElementById("filter-find-button");


    if (name && password) {
        for (var i = 0; i < USERS.length; i++) {
            if (USERS[i].getLogin() === name) {
                break;
            }
        }

        if (i < USERS.length) {
            if (USERS[i].getPassword() === password) {
                USER = name;
                logInArea.remove();
                unLogInUser();
                printArticles();
                window.onresize = onresizePagination;
                filterButton.onclick =clickFilterButton;
            } else {
                alert("Неверный пароль");
            }
        } else {
            USERS.push(new userInformation(name, password));
            USER = name;
            alert("Пользователь успешно зарегистрирован");
            logInArea.remove();
            unLogInUser();
            printArticles();
            logOffButton.id = "log-off-button";
            window.onresize = onresizePagination;
            filterButton.onclick =clickFilterButton;
        }
    } else {
        alert("Введите имя и логин");
    }
}