"use strict";

const DOC = document;

//window.onunload = unloadLocalStorageArticles;

function onresizePagination() {
    NEWS_VIEW.createPagination(INDEX_THIS_PAGE);
    if (window.innerWidth > 500) {
        const pagesButton = DOC.getElementsByClassName("pagination-checked")[0];
        const thisPageButton = DOC.getElementById("page" + INDEX_THIS_PAGE);

        pagesButton.className = "";
        pagesButton.disabled = "";
        thisPageButton.className = "pagination-checked";
        thisPageButton.disabled = "disabled";
    }
}
window.onresize = onresizePagination;

function clickForFullNews() {
    const newsContent = this.children[2];
    const newsTitle = this.children[1];
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
        const id = this.parentNode.id;
        /* if (!removeArticle("" + id)) {
         alert("Новость не удалось удалить");
         }*/
        deleteNewsFromServer(id);
        NEWS_VIEW.removeNews(id);
    }
}

function clickRedactNews() {
    const divMain = this.parentNode;
    const tegArea = divMain.children[0];
    const newsArea = divMain.children[3];
    const header = newsArea.children[0];
    const summary = newsArea.children[1];
    const content = newsArea.children[2];
    const saveButton = newsArea.children[3];
    const canselButton = newsArea.children[4];
    const originalData = {
        id: newsArea.parentNode.id, title: header.innerHTML, summary: summary.innerHTML,
        content: content.innerHTML, teg: tegArea.innerHTML
    };
    ORIGINAL_DATA_EDITING_NEWS.push(originalData);
    header.contentEditable = true;
    summary.contentEditable = true;
    content.contentEditable = true;
    tegArea.contentEditable = true;

    if (tegArea.children.length) {
        let tegsString = "";
        for (let i = 0; i < tegArea.children.length; i++) {
            if (tegArea.children[i].innerHTML) {
                tegsString += tegArea.children[i].innerHTML + ",";
            }
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
    const newsArea = this.parentNode;
    const id = newsArea.parentNode.id;
    const header = newsArea.children[0];
    const summary = newsArea.children[1];
    const content = newsArea.children[2];
    const saveButton = newsArea.children[3];
    const canselButton = newsArea.children[4];
    const divMain = newsArea.parentNode;
    const tegArea = divMain.children[0];
    let article;
    if (header.innerHTML && summary.innerHTML && content.innerHTML && tegArea.innerHTML &&
        header.innerHTML !== "Заголовок" && summary.innerHTML !== "краткое описание" &&
        content.innerHTML !== "Полный текст новости") {

        const tegs = tegArea.innerHTML.split(",");
        let errorTegFlag = false;
        if (!tegs[tegs.length - 1]) {
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
    const newsArea = this.parentNode;
    const id = newsArea.parentNode.id;
    const header = newsArea.children[0];
    const summary = newsArea.children[1];
    const content = newsArea.children[2];
    const saveButton = newsArea.children[3];
    const canselButton = newsArea.children[4];
    const divMain = newsArea.parentNode;
    const tegArea = divMain.children[0];

    if (id === "temporary") {
        NEWS_VIEW.removeNews(id);
        const addNewsButton = DOC.getElementById("add-news-button");
        addNewsButton.onclick = clickAddNews;
    } else {

        /* var tegs = tegArea.innerHTML.split(",");
         tegArea.innerHTML = "<a/>" + tegs.join("</a>  <a/>");*/
        let lastIndex;
        for (let i = 0; i < ORIGINAL_DATA_EDITING_NEWS.length; i++) {
            lastIndex = i;
            if (ORIGINAL_DATA_EDITING_NEWS[i].id === id) {
                break;
            }
        }
        header.innerHTML = ORIGINAL_DATA_EDITING_NEWS[lastIndex].title;
        summary.innerHTML = ORIGINAL_DATA_EDITING_NEWS[lastIndex].summary;
        content.innerHTML = ORIGINAL_DATA_EDITING_NEWS[lastIndex].content;
        tegArea.innerHTML = ORIGINAL_DATA_EDITING_NEWS[lastIndex].teg;
        ORIGINAL_DATA_EDITING_NEWS.splice(lastIndex, 1);

        newsArea.onclick = clickForFullNews;
        header.contentEditable = summary.contentEditable = content.contentEditable = tegArea.contentEditable = false;
        header.style.backgroundColor = summary.style.backgroundColor = content.style.backgroundColor = tegArea.style.backgroundColor = "";

        saveButton.className = "news-edit-button-unvisible";
        canselButton.className = "news-edit-button-unvisible";
    }
}

function goInPage() {
    INDEX_THIS_PAGE = Number(this.id.split("e")[1]);

    printFilterArticles(INDEX_THIS_PAGE * 10 - 10, INDEX_THIS_PAGE * 10);

    if (window.innerWidth > 500) {
        if ((this.nextSibling && this.nextSibling.disabled) || (this.previousSibling && this.previousSibling.disabled)) {
            printPagination(INDEX_THIS_PAGE);
        } else {
            const pagesButton = this.parentNode.childNodes;
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

const filterButton = DOC.getElementById("filter-find-button");
filterButton.onclick = clickFilterButton;
function clickFilterButton() {
    const beginDateAdded = DOC.getElementById("begin-date-added-filter");
    const endDateAdded = DOC.getElementById("end-date-added-filter");
    const authorName = DOC.getElementById("author-name-filter");
    const tegsFilter = DOC.getElementById("tegs-filter");
    const beginDateAddedValue = beginDateAdded.value;
    const endDateAddedValue = endDateAdded.value;
    const authorNameValue = authorName.value;
    const tegsFilterValue = tegsFilter.value;
    let dateBegin;
    let dateEnd;
    let rePrintFlag = true;

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
            const tegs = tegsFilterValue.split(",");
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

const addNewsButton = DOC.getElementById("add-news-button");
addNewsButton.onclick = clickAddNews;
function clickAddNews() {
    //var date = new Date();
    const newId = "temporary";//date.getTime();
    NEWS_VIEW.addOneNews({
        _id: newId, title: "Заголовок", summary: "краткое описание", createdAt: new Date(), author: USER,
        content: "Полный текст новости", teg: ["Теги", "через", "запятую", "максимум", "5"]
    });
    this.onclick = "";
    const news = DOC.getElementById(newId);
    news.children[1].dispatchEvent(new Event("click"));

}

const logOffButton = DOC.getElementById("log-off-button");
logOffButton.onclick = function () {
    USER = null;
    unLogInUser();
    NEWS_VIEW.removeAllNews();
    printArticles();

};

const logInButton = DOC.getElementById("log-in-button");
logInButton.onclick = function () {
    NEWS_VIEW.removeAllNews();
    const filterButton = DOC.getElementById("filter-find-button");
    const pagination = DOC.getElementById("pagination");
    pagination.innerHTML = "";
    filterButton.onclick = "";
    window.onresize = "";

    const logInArea = DOC.createElement("div");
    const title = DOC.createElement("h3");
    const pLogin = DOC.createElement("p");
    const nameTextarea = DOC.createElement("textarea");
    const pPassword = DOC.createElement("p");
    const passwordTextarea = DOC.createElement("textarea");
    const inputLoginButton = DOC.createElement("button");

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

    const main = DOC.getElementsByTagName("main")[0];
    main.appendChild(logInArea);

    this.id = "log-in-button";
};

function loginTextareaKeyDown(event) {
    return event.keyCode !== 13;
}

function clickInputLoginButton() {
    const logInArea = this.parentNode;
    const nameTextarea = logInArea.children[2];
    const passwordTextarea = logInArea.children[4];
    const name = nameTextarea.value;
    const password = passwordTextarea.value;

    if (name && password) {
        loginServer(name, password);
    } else {
        alert("Введите имя и логин");
    }
}