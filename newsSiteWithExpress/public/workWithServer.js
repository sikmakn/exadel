function xhrOnLoad(xhr, resolve, reject) {
  xhr.onload = () => {
    if (xhr.status === 200) {
      resolve(xhr.response);
    } else {
      reject(Error(`printArticles error. Error code:${xhr.statusText}`));
    }
  };
  xhr.onerror = () => {
    reject(Error('There was a network error.'));
  };
}

function printArticles() {
  const printArticlesPromise = new Promise((resolve, reject) => {
    const xhrFirstArticles = new XMLHttpRequest();
    xhrFirstArticles.open('GET', '/firstNews', true);
    xhrOnLoad(xhrFirstArticles, resolve, reject);
    xhrFirstArticles.send();
  });

  printArticlesPromise
    .then((response) => {
      const firstArticles = JSON.parse(response, (key, value) => {
        if (key === 'createdAt') return new Date(value);
        return value;
      });
      return firstArticles;
    }).then((firstArticles) => {
      firstArticles = firstArticles.map((article) => {
        article.id = article._id;
        return article;
      });
      return firstArticles;
    }).then((firstArticles) => {
      NEWS_VIEW.printNewsList(firstArticles);
      printPagination();
    })
    .catch(err => console.log(err));
}

function printPagination(thisIndex = 0) {
  const printArticlesPromise = new Promise((resolve, reject) => {
    const xhrArticlesLength = new XMLHttpRequest();
    xhrArticlesLength.open('GET', '/articlesLength', true);
    xhrOnLoad(xhrArticlesLength, resolve, reject);
    xhrArticlesLength.send();
  });

  printArticlesPromise
    .then((responce) => {
      const articlesLength = Number(responce);
      ARTICLE_AMOUNT = articlesLength;
      NEWS_VIEW.createPagination(thisIndex, articlesLength);
    })
    .catch(err => console.log(err));
}

function printFilterArticles(skip = 0, top = 10) {
  const printFilterArticlesPromise = new Promise((resolve, reject) => {
    const xhrArticles = new XMLHttpRequest();
    xhrArticles.open('POST', '/postNewsFilter', true);
    xhrArticles.setRequestHeader('content-type', 'application/json');
    xhrOnLoad(xhrArticles, resolve, reject);
    FILTER_CONFIG.skip = skip;
    FILTER_CONFIG.top = top;
    const jsonFILTER = JSON.stringify(FILTER_CONFIG);
    xhrArticles.send(jsonFILTER);
  });

  printFilterArticlesPromise
    .then((response) => {
      const articles = JSON.parse(response, (key, value) => {
        if (key === 'createdAt') return new Date(value);
        return value;
      });
      if (articles.length) {
        NEWS_VIEW.removeAllNews();
        NEWS_VIEW.printNewsList(articles);
        if (!skip) {
          printPagination();
        }
      } else {
        alert('Новостей соответствуищих фильтрам не найдено.');
        FILTER_CONFIG = {};
      }
    })
    .catch(err => console.log(err));
}

function addNewsOnServer(article) {
  const newArticle = JSON.stringify(article);

  const addNewsOnServerPromise = new Promise((resolve, reject) => {
    const xhrAddArticle = new XMLHttpRequest();
    xhrAddArticle.open('POST', '/addNews', true);
    xhrAddArticle.setRequestHeader('content-type', 'application/json');
    xhrOnLoad(xhrAddArticle, resolve, reject);
    xhrAddArticle.send(newArticle);
  });

  addNewsOnServerPromise
    .then((response) => {
      const id = JSON.parse(response);
      const news = DOC.getElementById('temporary');
      news.id = id;
      const addButton = DOC.getElementById('add-news-button');
      addButton.onclick = clickAddNews;
    })
    .catch(err => console.log(err));
}

function editNewsOnServer(article) {
  const editNews = {
    id: article.id,
    title: article.title,
    summary: article.summary,
    content: article.content,
    tags: article.tags,
  };
  const editNewsJSON = JSON.stringify(editNews);

  const printArticlesPromise = new Promise((resolve, reject) => {
    const xhrEditArticle = new XMLHttpRequest();
    xhrEditArticle.open('PATCH', '/editNews', true);
    xhrEditArticle.setRequestHeader('content-type', 'application/json');
    xhrOnLoad(xhrEditArticle, resolve, reject);
    xhrEditArticle.send(editNewsJSON);
  });

  printArticlesPromise.catch(err => console.log(err));
}

function deleteNewsFromServer(id) {
  const deleteNewsFromServerPromise = new Promise((resolve, reject) => {
    const xhrDeleteArticle = new XMLHttpRequest();
    xhrDeleteArticle.open('DELETE', `/deleteNews?id=${id}`, true);
    xhrOnLoad(xhrDeleteArticle, resolve, reject);
    xhrDeleteArticle.send();
  });
  deleteNewsFromServerPromise.catch(err => console.log(err));
}

function logOutServer() {
  const deleteNewsFromServerPromise = new Promise((resolve, reject) => {
    const xhrLogOut = new XMLHttpRequest();
    xhrLogOut.open('GET', '/logout', true);
    xhrOnLoad(xhrLogOut, resolve, reject);
    xhrLogOut.send();
  });
  deleteNewsFromServerPromise.catch(err => console.log(err));
}

function loginServer(username, password) {
  const loginServerPromise = new Promise((resolve, reject) => {
    const xhrLogin = new XMLHttpRequest();
    xhrLogin.open('POST', '/login', true);
    xhrLogin.setRequestHeader('content-type', 'application/json');
    xhrOnLoad(xhrLogin, resolve, reject);
    const jsonUser = JSON.stringify({
      username,
      password,
    });
    xhrLogin.send(jsonUser);
  });

  loginServerPromise
    .then((response) => {
      const logInArea = DOC.getElementById('log-in-area');
      const filterButton = DOC.getElementById('filter-find-button');
      const logOffButton = DOC.getElementById('log-off-button-log-off');
      const answer = response;

      if (answer === 'successfully_registered') {
        USER = username;
        alert('Пользователь успешно зарегистрирован');
        logInArea.remove();
        unLogInUser();
        printArticles();
        logOffButton.id = 'log-off-button';
        window.onresize = onresizePagination;
        filterButton.onclick = clickFilterButton;
      } else if (answer === 'successfully_login') {
        USER = username;
        logInArea.remove();
        unLogInUser();
        printArticles();
        window.onresize = onresizePagination;
        filterButton.onclick = clickFilterButton;
      } else {
        alert('Неверный пароль');
      }
    })
    .catch(err => console.log(err));
}
