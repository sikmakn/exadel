function printArticles() {
  const xhrFirstArticles = new XMLHttpRequest();

  function handler() {
    const articlesJSON = xhrFirstArticles.responseText;
    const firstArticles = JSON.parse(articlesJSON, (key, value) => {
      if (key === 'createdAt') return new Date(value);
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
  const xhrArticlesLength = new XMLHttpRequest();

  function handler() {
    const articlesLength = Number(xhrArticlesLength.responseText);
    xhrArticlesLength.removeEventListener('load', handler);
    ARTICLE_AMOUNT = articlesLength;
    NEWS_VIEW.createPagination(thisIndex, articlesLength);
  }

  xhrArticlesLength.addEventListener('load', handler);
  xhrArticlesLength.open('GET', '/articlesLength', true);
  xhrArticlesLength.send();
}

function printFilterArticles(skip = 0, top = 10) {
  const xhrArticles = new XMLHttpRequest();

  function handler() {
    const articlesJSON = xhrArticles.responseText;

    const articles = JSON.parse(articlesJSON, (key, value) => {
      if (key === 'createdAt') return new Date(value);
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
      alert('Новостей соответствуищих фильтрам не найдено.');
      FILTER_CONFIG = {};
    }
  }

  xhrArticles.addEventListener('load', handler);
  FILTER_CONFIG.skip = skip;
  FILTER_CONFIG.top = top;
  const jsonFILTER = JSON.stringify(FILTER_CONFIG);
  xhrArticles.open('POST', '/postNewsFilter', true);
  xhrArticles.setRequestHeader('content-type', 'application/json');
  xhrArticles.send(jsonFILTER);
}

function addNewsOnServer(article) {
  const xhrAddArticle = new XMLHttpRequest();
  const newArticle = JSON.stringify(article);

  function handler() {
    const id = xhrAddArticle.responseText;
    const news = DOC.getElementById('temporary');
    news.id = id;
    const addButton = DOC.getElementById('add-news-button');
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
    tags: article.tags,
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
  xhrDeleteArticle.open('DELETE', `/deleteNews?id=${id}`, true);
  xhrDeleteArticle.send();
}

function loginServer(name, password) {
  const xhrLogin = new XMLHttpRequest();

  function handler() {
    const logInArea = DOC.getElementById('log-in-area');
    const filterButton = DOC.getElementById('filter-find-button');
    const logOffButton = DOC.getElementById('log-off-button-log-off');
    const answer = xhrLogin.responseText;

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
    xhrLogin.removeEventListener('load', handler);
  }

  xhrLogin.addEventListener('load', handler);
  xhrLogin.open('GET', `/login?name=${name}&password=${password}`, true);
  xhrLogin.send();
}
