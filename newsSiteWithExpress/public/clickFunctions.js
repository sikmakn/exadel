"use strict";

var DOC = document;

//window.onunload = unloadLocalStorageArticles;

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

}
window.onresize = onresizePagination;

function clickForFullNews() {

    var newsContent = this.children[2],
        newsTitle = this.children[1];
    if ("news-full-text-visible" === newsContent.className) {
        newsContent.className = "news-full-text-unvisible";
        newsTitle.className = "news-summary";
    } else {
        newsContent.className = "news-full-text-visible";
        newsTitle.className = "news-summary-at-full";
    }

}

function clickRemoveNews() {
    if (confirm("Вы действительно хотите удалить эту новость?")) {
        var id = this.parentNode.id;
        /* if (!removeArticle("" + id)) {
         alert("Новость не удалось удалить");
         }*/
        deleteNewsFromServer(id);
        NEWS_VIEW.removeNews(id);
    }
}

function clickRedactNews() {
    var divMain = this.parentNode,
        tegArea = divMain.children[0],
        newsArea = divMain.children[3],
        header = newsArea.children[0],
        summary = newsArea.children[1],
        content = newsArea.children[2],
        saveButton = newsArea.children[3],
        canselButton = newsArea.children[4];
    var originalData = {
        id: newsArea.parentNode.id, title: header.innerHTML, summary: summary.innerHTML,
        content: content.innerHTML, teg: tegArea.innerHTML
    };
    ORIGINAL_DATA_EDITING_NEWS.push(originalData);
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
        if ("news-full-text-unvisible" === content.className) {
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
}

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
        if (tegs[tegs.length - 1] === "") {
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
                article = {
                    id: id, title: header.innerHTML, summary: summary.innerHTML,
                    createdAt: new Date(), author: USER, content: content.innerHTML, teg: tegs
                };
                tegArea.innerHTML = "<a/>" + tegs.join("</a>  <a/>");
                if (id === "temporary") {
                    addNewsOnServer(article);
                } else {
                    editNewsOnServer(article);
                    NEWS_VIEW.editNews(id, article);
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
}

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

    if (id === "temporary") {
        NEWS_VIEW.removeNews(id);
        var addNewsButton = DOC.getElementById("add-news-button");
        addNewsButton.onclick = clickAddNews;
    } else {

        /* var tegs = tegArea.innerHTML.split(",");
         tegArea.innerHTML = "<a/>" + tegs.join("</a>  <a/>");*/
        for (var i = 0; i < ORIGINAL_DATA_EDITING_NEWS.length; i++) {
            if (ORIGINAL_DATA_EDITING_NEWS[i].id === id) {
                break;
            }
        }
        header.innerHTML = ORIGINAL_DATA_EDITING_NEWS[i].title;
        summary.innerHTML = ORIGINAL_DATA_EDITING_NEWS[i].summary;
        content.innerHTML = ORIGINAL_DATA_EDITING_NEWS[i].content;
        tegArea.innerHTML = ORIGINAL_DATA_EDITING_NEWS[i].teg;
        ORIGINAL_DATA_EDITING_NEWS.splice(i, 1);

        newsArea.onclick = clickForFullNews;
        header.contentEditable = summary.contentEditable = content.contentEditable = tegArea.contentEditable = false;
        header.style.backgroundColor = summary.style.backgroundColor = content.style.backgroundColor = tegArea.style.backgroundColor = "";

        saveButton.className = "news-edit-button-unvisible";
        canselButton.className = "news-edit-button-unvisible";
    }
}

function goInPage() {
    INDEX_THIS_PAGE = +this.id.split("e")[1];

    printFilterArticles(INDEX_THIS_PAGE * 10 - 10, INDEX_THIS_PAGE * 10);

    if (window.innerWidth > 500) {
        if ((this.nextSibling && this.nextSibling.disabled) || (this.previousSibling && this.previousSibling.disabled)) {
            printPagination(INDEX_THIS_PAGE);
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
        printPagination(INDEX_THIS_PAGE);
    }
}

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
        dateBegin,
        dateEnd,
        rePrintFlag = true;

    if (beginDateAddedValue || authorNameValue || tegsFilterValue || endDateAddedValue) {
        if (beginDateAddedValue) {
            if (/\d\d\d\d\.\d\d\.\d\d/.test(beginDateAddedValue)) {
                dateBegin = beginDateAddedValue;
            } else {
                alert("Дата начала поиска введена неверно");
                rePrintFlag = false;
            }
        } else {
            dateBegin = 0;
        }
        if (endDateAddedValue) {
            if (/\d\d\d\d\.\d\d\.\d\d/.test(endDateAddedValue)) {
                dateEnd = endDateAddedValue;
            } else {
                alert("Дата конца поиска введена неверно");
                rePrintFlag = false;
            }
        } else {
            dateEnd = 0;
        }
        if (rePrintFlag) {
            var tegs = tegsFilterValue.split(",");
            FILTER_CONFIG = {author: authorNameValue, dateBegin: dateBegin, dateEnd: dateEnd, teg: tegs};
            //new FilterConfig(authorNameValue, dateBegin, dateEnd, tegs);
            printFilterArticles();
        }
        beginDateAdded.value = authorName.value = tegsFilter.value = endDateAdded.value = "";

    } else /*if (DOC.getElementsByClassName("one-news").length) */{
        NEWS_VIEW.removeAllNews();
        FILTER_CONFIG = null;
        printArticles();
    }
}

var addNewsButton = DOC.getElementById("add-news-button");
addNewsButton.onclick = clickAddNews;
function clickAddNews() {
    //var date = new Date();
    var newId = "temporary";//date.getTime();
    NEWS_VIEW.addOneNews({
        _id: newId, title: "Заголовок", summary: "краткое описание", createdAt: new Date(), author: USER,
        content: "Полный текст новости", teg: ["Теги", "через", "запятую", "максимум", "5"]
    });
    this.onclick = "";
    var news = DOC.getElementById(newId);
    news.children[1].dispatchEvent(new Event("click"));

}

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
    return event.keyCode !== 13;
}

function clickInputLoginButton() {
    var logInArea = this.parentNode,
        nameTextarea = logInArea.children[2],
        passwordTextarea = logInArea.children[4],
        name = nameTextarea.value,
        password = passwordTextarea.value;

    if (name && password) {
        loginServer(name, password);
    } else {
        alert("Введите имя и логин");
    }
}