/* VIEW */

const TIME_OPTIONS = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  timezone: 'UTC',
  hour: 'numeric',
  minute: 'numeric',
};

function unLogInUser() {
  const login = DOC.getElementById('login');
  let addNewsButton;
  let logOffButton;
  let logInButton;
  if (!USER) {
    addNewsButton = DOC.getElementById('add-news-button');
    logOffButton = DOC.getElementById('log-off-button');
    logInButton = DOC.getElementById('log-in-button');
    addNewsButton.id = 'add-news-button-log-off';
    logOffButton.id = 'log-off-button-log-off';
    logInButton.id = 'log-in-button-log-off';
    login.innerHTML = 'войдите';
  } else {
    login.innerHTML = USER;
    addNewsButton = DOC.getElementById('add-news-button-log-off');
    logOffButton = DOC.getElementById('log-off-button-log-off');
    logInButton = DOC.getElementById('log-in-button-log-off');
    addNewsButton.id = 'add-news-button';
    logOffButton.id = 'log-off-button';
    if (logInButton) {
      logInButton.id = 'log-in-button';
    }
  }
}

function NewsView() {
  function oneNews(article) {
    const divMain = DOC.createElement('div');
    const divTags = DOC.createElement('div');
    const buttonRedact = DOC.createElement('button');
    const buttonDelete = DOC.createElement('button');
    const newsArea = DOC.createElement('div');
    const divAuthor = DOC.createElement('div');
    const divDate = DOC.createElement('div');
    const saveButton = DOC.createElement('button');
    const canselButton = DOC.createElement('button');

    divMain.id = article.id;
    divMain.className = 'one-news';

    divTags.id = `tag-${article.id}`;
    divTags.setAttribute('data-id', 'tagArea');
    divTags.innerHTML = `<a/>${article.tags.join('</a>  <a/>')}`;
    if (USER) {
      divTags.className = 'tag-area';
      buttonRedact.className = 'edit-news-button';
      buttonDelete.className = 'delete-news-button';
    } else {
      divTags.className = 'tag-area-log-off';
      buttonRedact.className = 'edit-news-button-log-off';
      buttonDelete.className = 'delete-news-button-log-off';
    }

    buttonRedact.setAttribute('data-action', 'editNews');
    buttonDelete.setAttribute('data-action', 'removeNews');
    buttonRedact.setAttribute('data-id', 'editButton');
    buttonDelete.setAttribute('data-id', 'removeButton');

    newsArea.className = 'news-area';
    newsArea.onclick = clickForFullNews;
    newsArea.setAttribute('data-id', 'newsArea');
    newsArea.innerHTML = `<h1 class='news-header' data-id='title'>${article.title}</h1>` +
      `<p class='news-summary' data-id='summary'>${article.summary}</p>` +
      `<p class='news-full-text-unvisible' data-id='content'>${article.content}</p> `;

    saveButton.innerHTML = 'Сохранить';
    saveButton.setAttribute('data-action', 'saveRedact');
    saveButton.setAttribute('data-id', 'saveButton');
    saveButton.className = 'news-edit-button-unvisible';
    newsArea.appendChild(saveButton);

    canselButton.innerHTML = 'Отмена';
    canselButton.setAttribute('data-action', 'canselRedact');
    canselButton.setAttribute('data-id', 'canselButton');
    canselButton.className = 'news-edit-button-unvisible';
    newsArea.appendChild(canselButton);

    divAuthor.className = 'news-author';
    divAuthor.innerHTML = article.author;

    divDate.className = 'news-date';
    divDate.innerHTML = article.createdAt.toLocaleString('ru', TIME_OPTIONS);

    divMain.appendChild(divTags);
    divMain.appendChild(buttonRedact);
    divMain.appendChild(buttonDelete);
    divMain.appendChild(newsArea);
    divMain.appendChild(divAuthor);
    divMain.appendChild(divDate);
    return divMain;
  }

  this.printNewsList = function (articles) {
    const allNewsArea = DOC.getElementById('allNewsArea');

    articles.forEach((article) => {
      const divMain = oneNews(article);
      allNewsArea.appendChild(divMain);
    });

    allNewsArea.onclick = (event) => {
      const actionKey = event.target.getAttribute('data-action');
      const action = actions[actionKey];
      if (action) {
        action(event);
      }
    };
  };

  this.createPagination = function (id = 0, articleLength = ARTICLE_AMOUNT) {
    const pagination = DOC.getElementById('pagination');
    const pageCount = Math.ceil(articleLength / 10);
    let pageId;
    let pageIndex;
    let index;

    if (typeof id === 'string' || id instanceof Object) {
      id = 0;
    }
    pagination.innerHTML = '';

    if (window.innerWidth > 500) {
      const offsetWidth = pagination.offsetWidth - 2;
      const lengthButton = 50;
      const possibleCountIndexes = Math.floor(offsetWidth / lengthButton);

      pageId = `page${1}`;
      pageIndex = DOC.createElement('button');
      pageIndex.id = pageId;
      pageIndex.onclick = goInPage;
      pageIndex.innerHTML = 1;
      if (id === 1 || id === 0) {
        pageIndex.className = 'pagination-checked';
        pageIndex.disabled = 'disabled';
      }
      pagination.appendChild(pageIndex);

      if (id < Math.ceil(possibleCountIndexes / 2)) {
        let limit = possibleCountIndexes - 1;
        if (pageCount === possibleCountIndexes) {
          limit = possibleCountIndexes;
        } else if (pageCount === 1) {
          limit += 2;
        }

        for (let i = 2; i <= pageCount && i < limit; i += 1) {
          pageId = `page${i}`;
          pageIndex = DOC.createElement('button');
          pageIndex.id = pageId;
          pageIndex.onclick = goInPage;
          pageIndex.innerHTML = i;
          if (id === i) {
            pageIndex.className = 'pagination-checked';
            pageIndex.disabled = 'disabled';
          }
          pagination.appendChild(pageIndex);
          index = i;
        }
      } else {
        if (id - Math.ceil(possibleCountIndexes / 2) > 0) {
          pageIndex = DOC.createElement('button');
          pageIndex.disabled = 'disabled';
          pageIndex.innerHTML = '...';
          pagination.appendChild(pageIndex);
        }

        let start = id - Math.ceil(possibleCountIndexes / 2) + 2;
        let limit = Math.ceil(possibleCountIndexes / 2) + id - 2;

        if (id >= pageCount - possibleCountIndexes / 2) {
          start = pageCount - possibleCountIndexes + 3;
          limit = pageCount + 1;
        }

        for (let i = start; i <= pageCount && i < limit; i += 1) {
          pageId = `page${i}`;
          pageIndex = DOC.createElement('button');
          pageIndex.id = pageId;
          pageIndex.onclick = goInPage;
          pageIndex.innerHTML = i;
          if (id === i) {
            pageIndex.className = 'pagination-checked';
            pageIndex.disabled = 'disabled';
          }
          pagination.appendChild(pageIndex);
          index = i;
        }
      }

      if (index < pageCount) {
        if (pageCount !== possibleCountIndexes && id !== pageCount) {
          pageIndex = DOC.createElement('button');
          pageIndex.disabled = 'disabled';
          pageIndex.innerHTML = '...';
          pagination.appendChild(pageIndex);
        }
        pageId = `page${pageCount}`;
        pageIndex = DOC.createElement('button');
        pageIndex.id = pageId;
        if (id === pageCount) {
          pageIndex.className = 'pagination-checked';
          pageIndex.disabled = 'disabled';
        }
        pageIndex.onclick = goInPage;
        pageIndex.innerHTML = pageCount;
        pagination.appendChild(pageIndex);
      }
    } else {
      if (id === 0) {
        id += 1;
      }
      if (id !== 1) {
        pageId = `page${id - 1}`;
        pageIndex = DOC.createElement('button');
        pageIndex.id = pageId;
        pageIndex.onclick = goInPage;
        pageIndex.innerHTML = '<-';
        pagination.appendChild(pageIndex);
      } else {
        pageIndex = DOC.createElement('button');
        pageIndex.disabled = 'disabled';
        pageIndex.innerHTML = '...';
        pagination.appendChild(pageIndex);
      }

      if (id !== pageCount) {
        pageId = `page${id + 1}`;
        pageIndex = DOC.createElement('button');
        pageIndex.id = pageId;
        pageIndex.onclick = goInPage;
        pageIndex.innerHTML = '->';
        pagination.appendChild(pageIndex);
      } else {
        pageIndex = DOC.createElement('button');
        pageIndex.disabled = 'disabled';
        pageIndex.innerHTML = '...';
        pagination.appendChild(pageIndex);
      }
    }
  };

  this.addOneNews = function (article) {
    const allNewsArea = DOC.getElementById('allNewsArea');
    const divMain = oneNews(article);
    const firstDivInMain = allNewsArea.children[0];
    allNewsArea.insertBefore(divMain, firstDivInMain);
  };

  this.removeNews = function (id) {
    const news = DOC.getElementById(id);
    news.parentNode.removeChild(news);
  };

  this.removeAllNews = function () {
    const allNews = DOC.getElementsByClassName('one-news');
    for (let i = allNews.length - 1; i >= 0; i -= 1) {
      allNews[i].parentNode.removeChild(allNews[i]);
    }
  };

  this.editNews = function (id, article) {
    const news = DOC.getElementById(id);
    const title = news.querySelector('*[data-id="title"]');
    const summary = news.querySelector('*[data-id="summary"]');
    const content = news.querySelector('*[data-id="content"]');

    title.innerHTML = article.title;
    summary.innerHTML = article.summary;
    content.innerHTML = article.content;
  };

  this.editTagsNews = function (id, tags) {
    const divTags = DOC.getElementById(`tag-${id}`);
    divTags.innerHTML = `<a href='error.html'/> ${tags.join("</a>  <a href='error.html'/> ")}`;
  };

  const actions = {
    editNews(event) {
      const redactButton = event.target;
      actionRedactNews(redactButton);
    },
    removeNews(event) {
      const removeButton = event.target;
      actionRemoveNews(removeButton);
    },
    canselRedact(event) {
      const canselButton = event.target;
      actionCanselRedactNews(canselButton);
    },
    saveRedact(event) {
      const saveButton = event.target;
      actionSaveRedactNews(saveButton);
    },
  };
}
