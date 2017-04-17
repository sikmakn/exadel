function printArticles() {
  const printArticlesPromise = new Promise((resolve, reject) => {
    const xhrFirstArticles = new XMLHttpRequest();
    xhrFirstArticles.open('GET', '/firstNews', true);
    xhrFirstArticles.onload = () => {
      if (xhrFirstArticles.status === 200) {
        resolve(xhrFirstArticles.response);
      } else {
        reject(
          Error(`printArticles error. Error code:${xhrFirstArticles.statusText}`));
      }
    };
    xhrFirstArticles.onerror = () => { reject(Error('There was a network error.')); };
    xhrFirstArticles.send();
  });

  printArticlesPromise.then((response) => {
    const firstArticles = JSON.parse(response, (key, value) => {
      if (key === 'createdAt') return new Date(value);
      return value;
    });
    NEWS_VIEW.printNewsList(firstArticles);
    printPagination();
  }).catch(err => console.log(err));
}

function printPagination(thisIndex = 0) {
  const printArticlesPromise = new Promise((resolve, reject) => {
    const xhrArticlesLength = new XMLHttpRequest();
    xhrArticlesLength.open('GET', '/articlesLength', true);
    xhrArticlesLength.onload = () => {
      if (xhrArticlesLength.status === 200) {
        resolve(xhrArticlesLength.response);
      } else {
        reject(Error(`printPagination error. Error code:${xhrArticlesLength.statusText}`));
      }
    };

    xhrArticlesLength.onerror = () => {
      reject(Error('There was a network error.'));
    };
    xhrArticlesLength.send();
  });

  printArticlesPromise.then((responce) => {
    const articlesLength = Number(responce);
    ARTICLE_AMOUNT = articlesLength;
    NEWS_VIEW.createPagination(thisIndex, articlesLength);
  }).catch(err => console.log(err));
}

function printFilterArticles(skip = 0, top = 10) {
  const printFilterArticlesPromise = new Promise((resolve, reject) => {
    const xhrArticles = new XMLHttpRequest();
    xhrArticles.open('POST', '/postNewsFilter', true);
    xhrArticles.setRequestHeader('content-type', 'application/json');
    xhrArticles.onload = () => {
      if (xhrArticles.status === 200) {
        resolve(xhrArticles.response);
      } else {
        reject(
          Error(`printFilterArticles error. Error code:${xhrArticles.statusText}`));
      }
    };
    xhrArticles.onerror = () => {
      reject(Error('There was a network error.'));
    };
    FILTER_CONFIG.skip = skip;
    FILTER_CONFIG.top = top;
    const jsonFILTER = JSON.stringify(FILTER_CONFIG);
    xhrArticles.send(jsonFILTER);
  });

  printFilterArticlesPromise.then((response) => {
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
  }).catch(err => console.log(err));
}

function addNewsOnServer(article) {
  const newArticle = JSON.stringify(article);

  const addNewsOnServerPromise = new Promise((resolve, reject) => {
    const xhrAddArticle = new XMLHttpRequest();
    xhrAddArticle.open('POST', '/addNews', true);
    xhrAddArticle.setRequestHeader('content-type', 'application/json');
    xhrAddArticle.onload = () => {
      if (xhrAddArticle.status === 200) {
        resolve(xhrAddArticle.response);
      } else {
        reject(
          Error(`printArticles error. Error code:${xhrAddArticle.statusText}`));
      }
    };
    xhrAddArticle.onerror = () => {
      reject(Error('There was a network error.'));
    };
    xhrAddArticle.send(newArticle);
  });

  addNewsOnServerPromise.then((response) => {
    const id = response;
    const news = DOC.getElementById('temporary');
    news.id = id;
    const addButton = DOC.getElementById('add-news-button');
    addButton.onclick = clickAddNews;
  }).catch(err => console.log(err));
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

    xhrEditArticle.onload = () => {
      if (xhrEditArticle.status === 200) {
        resolve(xhrEditArticle.response);
      } else {
        reject(Error(`printArticles error. Error code:${xhrEditArticle.statusText}`));
      }
    };
    xhrEditArticle.onerror = () => {
      reject(Error('There was a network error.'));
    };
    xhrEditArticle.send(editNewsJSON);
  });

  printArticlesPromise.catch(err => console.log(err));
}

function deleteNewsFromServer(id) {
  const deleteNewsFromServerPromise = new Promise((resolve, reject) => {
    const xhrDeleteArticle = new XMLHttpRequest();
    xhrDeleteArticle.open('DELETE', `/deleteNews?id=${id}`, true);
    xhrDeleteArticle.onload = () => {
      if (xhrDeleteArticle.status === 200) {
        resolve(xhrDeleteArticle.response);
      } else {
        reject(
          Error(`printArticles error. Error code:${xhrDeleteArticle.statusText}`));
      }
    };
    xhrDeleteArticle.onerror = () => {
      reject(Error('There was a network error.'));
    };
    xhrDeleteArticle.send();
  });
  deleteNewsFromServerPromise.catch(err => console.log(err));
}

function loginServer(name, password) {
  const loginServerPromise = new Promise((resolve, reject) => {
    const xhrLogin = new XMLHttpRequest();
    xhrLogin.open('GET', `/login?name=${name}&password=${password}`, true);
    xhrLogin.onload = () => {
      if (xhrLogin.status === 200) {
        resolve(xhrLogin.response);
      } else {
        reject(Error(`loginServer error. Error code:${xhrLogin.statusText}`));
      }
    };
    xhrLogin.onerror = () => {
      reject(Error('There was a network error.'));
    };
    xhrLogin.send();
  });

  loginServerPromise.then((response) => {
    const logInArea = DOC.getElementById('log-in-area');
    const filterButton = DOC.getElementById('filter-find-button');
    const logOffButton = DOC.getElementById('log-off-button-log-off');
    const answer = response;

    if (answer === 'successfully_registered') {
      USER = name;
      alert('Пользователь успешно зарегистрирован');
      logInArea.remove();
      unLogInUser();
      printArticles();
      logOffButton.id = 'log-off-button';
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
      alert('Неверный пароль');
    }
  }).catch(err => console.log(err));
}
