"use strict";

const DOC = document;

function onresizePagination() {
    NEWS_VIEW.createPagination(INDEX_THIS_PAGE);
    if (window.innerWidth <= 500) return;

    const pagesButton = DOC.getElementsByClassName("pagination-checked")[0];
    const thisPageButton = DOC.getElementById("page" + INDEX_THIS_PAGE);

    pagesButton.className = "";
    pagesButton.disabled = "";
    thisPageButton.className = "pagination-checked";
    thisPageButton.disabled = "disabled";

}
window.onresize = onresizePagination;

function clickForFullNews() {
    const newsContent = this.querySelector('*[data-id="content"]');
    const newsSummary = this.querySelector('*[data-id="summary"]');

    if ("news-full-text-visible" === newsContent.className) {
        newsContent.className = "news-full-text-unvisible";
        newsSummary.className = "news-summary";
        return;
    }
    newsContent.className = "news-full-text-visible";
    newsSummary.className = "news-summary-at-full";

}

function actionRedactNews(self) {
    const divMain = self.parentNode;
    const newsArea = divMain.querySelector('*[data-id="newsArea"]');
    const title = newsArea.querySelector('*[data-id="title"]');
    const summary = newsArea.querySelector('*[data-id="summary"]');
    const content = newsArea.querySelector('*[data-id="content"]');
    const saveButton = newsArea.querySelector('*[data-id="saveButton"]');
    const canselButton = newsArea.querySelector('*[data-id="canselButton"]');
    const tegArea = divMain.querySelector('*[data-id="tegArea"]');
    const originalData = {
        id: newsArea.parentNode.id,
        title: title.innerHTML,
        summary: summary.innerHTML,
        content: content.innerHTML,
        teg: tegArea.innerHTML
    };
    ORIGINAL_DATA_EDITING_NEWS.push(originalData);
    title.contentEditable = true;
    summary.contentEditable = true;
    content.contentEditable = true;
    tegArea.contentEditable = true;

    if (!tegArea.children.length) return;

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

    title.style.backgroundColor = "#eef4f9";
    summary.style.backgroundColor = "#eef4f9";
    content.style.backgroundColor = "#eef4f9";
    tegArea.style.backgroundColor = "darkgrey";

    saveButton.className = "news-edit-button-visible";
    canselButton.className = "news-edit-button-visible";

    newsArea.onclick = "";

}

function actionRemoveNews(self) {
    if (confirm("Вы действительно хотите удалить эту новость?")) {
        const id = self.parentNode.id;
        deleteNewsFromServer(id);
        NEWS_VIEW.removeNews(id);
    }
}

function actionCanselRedactNews(self) {
    const newsArea = self.parentNode;
    const divMain = newsArea.parentNode;
    const id = divMain.id;
    const title = newsArea.querySelector('*[data-id="title"]');
    const summary = newsArea.querySelector('*[data-id="summary"]');
    const content = newsArea.querySelector('*[data-id="content"]');
    const saveButton = newsArea.querySelector('*[data-id="saveButton"]');
    const canselButton = newsArea.querySelector('*[data-id="canselButton"]');
    const tegArea = divMain.querySelector('*[data-id="tegArea"]');

    if (id === "temporary") {
        NEWS_VIEW.removeNews(id);
        const addNewsButton = DOC.getElementById("add-news-button");
        addNewsButton.onclick = clickAddNews;
        return;
    }
    let lastIndex;
    for (let i = 0; i < ORIGINAL_DATA_EDITING_NEWS.length; i++) {
        lastIndex = i;
        if (ORIGINAL_DATA_EDITING_NEWS[i].id === id) {
            break;
        }
    }
    title.innerHTML = ORIGINAL_DATA_EDITING_NEWS[lastIndex].title;
    summary.innerHTML = ORIGINAL_DATA_EDITING_NEWS[lastIndex].summary;
    content.innerHTML = ORIGINAL_DATA_EDITING_NEWS[lastIndex].content;
    tegArea.innerHTML = ORIGINAL_DATA_EDITING_NEWS[lastIndex].teg;
    ORIGINAL_DATA_EDITING_NEWS.splice(lastIndex, 1);

    newsArea.onclick = clickForFullNews;
    title.contentEditable = summary.contentEditable = false;
    content.contentEditable = tegArea.contentEditable = false;
    title.style.backgroundColor = summary.style.backgroundColor = "";
    content.style.backgroundColor = tegArea.style.backgroundColor = "";

    saveButton.className = "news-edit-button-unvisible";
    canselButton.className = "news-edit-button-unvisible";

}

function actionSaveRedactNews(self) {
    const newsArea = self.parentNode;
    const id = newsArea.parentNode.id;
    const divMain = newsArea.parentNode;
    const title = newsArea.querySelector('*[data-id="title"]');
    const summary = newsArea.querySelector('*[data-id="summary"]');
    const content = newsArea.querySelector('*[data-id="content"]');
    const saveButton = newsArea.querySelector('*[data-id="saveButton"]');
    const canselButton = newsArea.querySelector('*[data-id="canselButton"]');
    const tegArea = divMain.querySelector('*[data-id="tegArea"]');
    let article;
    if (title.innerHTML && summary.innerHTML && content.innerHTML && tegArea.innerHTML &&
        title.innerHTML !== "Заголовок" && summary.innerHTML !== "краткое описание" &&
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
                if (item === "Теги" || item === "через" || item === "запятую" ||
                    item === "максимум" || item === "пять") {
                    errorTegFlag = true;
                }
            });
            if (!errorTegFlag) {
                article = {
                    id: id,
                    title: title.innerHTML,
                    summary: summary.innerHTML,
                    createdAt: new Date(),
                    author: USER,
                    content: content.innerHTML,
                    teg: tegs
                };
                tegArea.innerHTML = "<a/>" + tegs.join("</a>  <a/>");
                if (id === "temporary") {
                    addNewsOnServer(article);
                } else {
                    editNewsOnServer(article);
                    NEWS_VIEW.editNews(id, article);
                }

                newsArea.onclick = clickForFullNews;
                title.contentEditable = summary.contentEditable = false;
                content.contentEditable = tegArea.contentEditable = false;
                title.style.backgroundColor = summary.style.backgroundColor = "";
                content.style.backgroundColor = tegArea.style.backgroundColor = "";

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

function goInPage() {
    INDEX_THIS_PAGE = Number(this.id.split("e")[1]);

    printFilterArticles(INDEX_THIS_PAGE * 10 - 10, INDEX_THIS_PAGE * 10);

    if (window.innerWidth <= 500) {
        printPagination(INDEX_THIS_PAGE);
        return;
    }
    if ((this.nextSibling && this.nextSibling.disabled) ||
        (this.previousSibling && this.previousSibling.disabled)) {
        printPagination(INDEX_THIS_PAGE);
        return;
    }
    const pagesButton = this.parentNode.childNodes;
    pagesButton.forEach(function (item) {
        item.className = "";
        item.disabled = "";
    });
    this.className = "pagination-checked";
    this.disabled = "disabled";

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
            FILTER_CONFIG = {
                author: authorNameValue,
                dateBegin: dateBegin,
                dateEnd: dateEnd,
                teg: tegs
            };
            printFilterArticles();
        }
        beginDateAdded.value = authorName.value = tegsFilter.value = endDateAdded.value = "";

    } else {
        NEWS_VIEW.removeAllNews();
        FILTER_CONFIG = null;
        printArticles();
    }
}

const addNewsButton = DOC.getElementById("add-news-button");
addNewsButton.onclick = clickAddNews;
function clickAddNews() {
    const newId = "temporary";
    NEWS_VIEW.addOneNews({
        _id: newId,
        title: "Заголовок",
        summary: "краткое описание",
        createdAt: new Date(),
        author: USER,
        content: "Полный текст новости",
        teg: ["Теги", "через", "запятую", "максимум", "5"]
    });
    this.onclick = "";
    const news = DOC.getElementById(newId);
    news.querySelector('*[data-id="editButton"]')
        .dispatchEvent(new Event("click", {bubbles: true}));

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
    title.innerHTML = "Введите логин и пароль, если вы не зарегестрированы," +
        " то это произойдет автоматически.";
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
    const nameTextarea = DOC.getElementById("input-login");
    const passwordTextarea = DOC.getElementById("input-password");
    const name = nameTextarea.value;
    const password = passwordTextarea.value;

    if (name && password) {
        loginServer(name, password);
        return;
    }
    alert("Введите имя и логин");
}