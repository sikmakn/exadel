const DOC = document;

function onresizePagination() {
  NEWS_VIEW.createPagination(INDEX_THIS_PAGE);
  if (window.innerWidth <= 500) return;

  const pagesButton = DOC.getElementsByClassName('pagination-checked')[0];
  const thisPageButton = DOC.getElementById(`page${INDEX_THIS_PAGE}`);

  pagesButton.className = '';
  pagesButton.disabled = '';
  thisPageButton.className = 'pagination-checked';
  thisPageButton.disabled = 'disabled';
}
window.onresize = onresizePagination;

function clickForFullNews() {
  const newsContent = this.querySelector('*[data-id="content"]');
  const newsSummary = this.querySelector('*[data-id="summary"]');

  if (newsContent.className === 'news-full-text-visible') {
    newsContent.className = 'news-full-text-unvisible';
    newsSummary.className = 'news-summary';
    return;
  }
  newsContent.className = 'news-full-text-visible';
  newsSummary.className = 'news-summary-at-full';
}

function actionRedactNews(self) {
  const divMain = self.parentNode;
  const newsArea = divMain.querySelector('*[data-id="newsArea"]');
  const title = newsArea.querySelector('*[data-id="title"]');
  const summary = newsArea.querySelector('*[data-id="summary"]');
  const content = newsArea.querySelector('*[data-id="content"]');
  const saveButton = newsArea.querySelector('*[data-id="saveButton"]');
  const canselButton = newsArea.querySelector('*[data-id="canselButton"]');
  const tagArea = divMain.querySelector('*[data-id="tagArea"]');
  const originalData = {
    id: newsArea.parentNode.id,
    title: title.innerHTML,
    summary: summary.innerHTML,
    content: content.innerHTML,
    tags: tagArea.innerHTML,
  };
  ORIGINAL_DATA_EDITING_NEWS.push(originalData);
  title.contentEditable = true;
  summary.contentEditable = true;
  content.contentEditable = true;
  tagArea.contentEditable = true;

  if (!tagArea.children.length) return;

  let tagsString = '';
  for (let i = 0; i < tagArea.children.length; i += 1) {
    if (tagArea.children[i].innerHTML) {
      tagsString += `${tagArea.children[i].innerHTML},`;
    }
  }
  tagArea.innerHTML = tagsString;
  if (content.className === 'news-full-text-unvisible') {
    newsArea.dispatchEvent(new Event('click'));
  }

  title.style.backgroundColor = '#eef4f9';
  summary.style.backgroundColor = '#eef4f9';
  content.style.backgroundColor = '#eef4f9';
  tagArea.style.backgroundColor = 'darkgrey';

  saveButton.className = 'news-edit-button-visible';
  canselButton.className = 'news-edit-button-visible';

  newsArea.onclick = '';
}

function actionRemoveNews(self) {
  if (confirm('Вы действительно хотите удалить эту новость?')) {
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
  const tagArea = divMain.querySelector('*[data-id="tagArea"]');

  if (id === 'temporary') {
    NEWS_VIEW.removeNews(id);
    const addNewsButton = DOC.getElementById('add-news-button');
    addNewsButton.onclick = clickAddNews;
    return;
  }
  let lastIndex;
  for (let i = 0; i < ORIGINAL_DATA_EDITING_NEWS.length; i += 1) {
    lastIndex = i;
    if (ORIGINAL_DATA_EDITING_NEWS[i].id === id) {
      break;
    }
  }
  title.innerHTML = ORIGINAL_DATA_EDITING_NEWS[lastIndex].title;
  summary.innerHTML = ORIGINAL_DATA_EDITING_NEWS[lastIndex].summary;
  content.innerHTML = ORIGINAL_DATA_EDITING_NEWS[lastIndex].content;
  tagArea.innerHTML = ORIGINAL_DATA_EDITING_NEWS[lastIndex].tags;
  ORIGINAL_DATA_EDITING_NEWS.splice(lastIndex, 1);

  newsArea.onclick = clickForFullNews;
  summary.contentEditable = false;
  title.contentEditable = false;
  content.contentEditable = false;
  tagArea.contentEditable = false;
  title.style.backgroundColor = '';
  summary.style.backgroundColor = '';
  content.style.backgroundColor = '';
  tagArea.style.backgroundColor = '';

  saveButton.className = 'news-edit-button-unvisible';
  canselButton.className = 'news-edit-button-unvisible';
}

function actionSaveRedactNews(self) {
  const newsArea = self.parentNode;
  const divMain = newsArea.parentNode;
  const id = divMain.id;
  const title = newsArea.querySelector('*[data-id="title"]');
  const summary = newsArea.querySelector('*[data-id="summary"]');
  const content = newsArea.querySelector('*[data-id="content"]');
  const saveButton = newsArea.querySelector('*[data-id="saveButton"]');
  const canselButton = newsArea.querySelector('*[data-id="canselButton"]');
  const tagArea = divMain.querySelector('*[data-id="tagArea"]');
  let article;
  if (
    title.innerHTML &&
    summary.innerHTML &&
    content.innerHTML &&
    tagArea.innerHTML &&
    title.innerHTML !== 'Заголовок' &&
    summary.innerHTML !== 'краткое описание' &&
    content.innerHTML !== 'Полный текст новости'
  ) {
    const tags = tagArea.innerHTML.split(',');
    let errortagFlag = false;
    if (!tags[tags.length - 1]) {
      tags.pop();
    }
    if (tags.length > 5) {
      alert('Тегов должно быть не более 5(пяти)');
      errortagFlag = true;
    } else {
      tags.forEach((item) => {
        if (
          item === 'Теги' ||
          item === 'через' ||
          item === 'запятую' ||
          item === 'максимум' ||
          item === 'пять'
        ) {
          errortagFlag = true;
        }
      });
      if (!errortagFlag) {
        article = {
          id,
          title: title.innerHTML,
          summary: summary.innerHTML,
          createdAt: new Date(),
          author: USER,
          content: content.innerHTML,
          tags,
        };
        tagArea.innerHTML = `<a/>${tags.join('</a>  <a/>')}`;
        if (id === 'temporary') {
          addNewsOnServer(article);
        } else {
          editNewsOnServer(article);
          NEWS_VIEW.editNews(id, article);
        }

        newsArea.onclick = clickForFullNews;
        summary.contentEditable = false;
        title.contentEditable = false;
        content.contentEditable = false;
        tagArea.contentEditable = false;
        title.style.backgroundColor = '';
        summary.style.backgroundColor = '';
        content.style.backgroundColor = '';
        tagArea.style.backgroundColor = '';

        saveButton.className = 'news-edit-button-unvisible';
        canselButton.className = 'news-edit-button-unvisible';
      } else {
        alert('Введите теги');
      }
    }
  } else {
    alert('Не все поля заполнены.');
  }
}

function goInPage() {
  INDEX_THIS_PAGE = Number(this.id.split('e')[1]);
  const lastNewsOnPage = INDEX_THIS_PAGE * 10;
  printFilterArticles(lastNewsOnPage - 10, lastNewsOnPage);

  if (window.innerWidth <= 500) {
    printPagination(INDEX_THIS_PAGE);
    return;
  }
  if (
    (this.nextSibling && this.nextSibling.disabled) ||
    (this.previousSibling && this.previousSibling.disabled)
  ) {
    printPagination(INDEX_THIS_PAGE);
    return;
  }
  const pagesButton = this.parentNode.childNodes;
  pagesButton.forEach((item) => {
    item.className = '';
    item.disabled = '';
  });
  this.className = 'pagination-checked';
  this.disabled = 'disabled';
}

const filterButton = DOC.getElementById('filter-find-button');
filterButton.onclick = clickFilterButton;
function clickFilterButton() {
  const beginDateAdded = DOC.getElementById('begin-date-added-filter');
  const endDateAdded = DOC.getElementById('end-date-added-filter');
  const authorName = DOC.getElementById('author-name-filter');
  const tagsFilter = DOC.getElementById('tags-filter');
  const beginDateAddedValue = beginDateAdded.value;
  const endDateAddedValue = endDateAdded.value;
  const authorNameValue = authorName.value;
  const tagsFilterValue = tagsFilter.value;
  let dateBegin;
  let dateEnd;
  let rePrintFlag = true;

  if (
    beginDateAddedValue ||
    authorNameValue ||
    tagsFilterValue ||
    endDateAddedValue
  ) {
    if (beginDateAddedValue) {
      if (/\d\d\d\d\.\d\d\.\d\d/.test(beginDateAddedValue)) {
        dateBegin = beginDateAddedValue;
      } else {
        alert('Дата начала поиска введена неверно');
        rePrintFlag = false;
      }
    }

    if (endDateAddedValue) {
      if (/\d\d\d\d\.\d\d\.\d\d/.test(endDateAddedValue)) {
        dateEnd = endDateAddedValue;
      } else {
        alert('Дата конца поиска введена неверно');
        rePrintFlag = false;
      }
    }

    if (rePrintFlag) {
      const tags = tagsFilterValue.split(',');
      FILTER_CONFIG = {
        author: authorNameValue,
        dateBegin,
        dateEnd,
        tags,
      };
      printFilterArticles();
    }
    endDateAdded.value = '';
    tagsFilter.value = '';
    authorName.value = '';
    beginDateAdded.value = '';
  } else {
    NEWS_VIEW.removeAllNews();
    FILTER_CONFIG = {};
    printArticles();
  }
}

const addNewsButton = DOC.getElementById('add-news-button');
addNewsButton.onclick = clickAddNews;
function clickAddNews() {
  const newId = 'temporary';
  NEWS_VIEW.addOneNews({
    id: newId,
    title: 'Заголовок',
    summary: 'краткое описание',
    createdAt: new Date(),
    author: USER,
    content: 'Полный текст новости',
    tags: ['Теги', 'через', 'запятую', 'максимум', '5'],
  });
  this.onclick = '';
  const news = DOC.getElementById(newId);
  news
    .querySelector('*[data-id="editButton"]')
    .dispatchEvent(new Event('click', { bubbles: true }));
}

const logOutButton = DOC.getElementById('log-off-button');
logOutButton.onclick = () => {
  logOutServer();
  USER = null;
  unLogInUser();
  NEWS_VIEW.removeAllNews();
  printArticles();
};

function loginTextareaKeyDown(event) {
  return event.keyCode !== 13;
}

function clickInputLoginButton() {
  const nameTextarea = DOC.getElementById('input-login');
  const passwordTextarea = DOC.getElementById('input-password');
  const name = nameTextarea.value;
  const password = passwordTextarea.value;

  if (name && password) {
    loginServer(name, password);
    return;
  }
  alert('Введите имя и логин');
}

const logInButton = DOC.getElementById('log-in-button');
logInButton.onclick = () => {
  NEWS_VIEW.removeAllNews();
  const filterFindButton = DOC.getElementById('filter-find-button');
  const pagination = DOC.getElementById('pagination');
  pagination.innerHTML = '';
  filterFindButton.onclick = '';
  window.onresize = '';

  const logInArea = DOC.createElement('div');
  const title = DOC.createElement('h3');
  const pLogin = DOC.createElement('p');
  const nameTextarea = DOC.createElement('textarea');
  const pPassword = DOC.createElement('p');
  const passwordTextarea = DOC.createElement('textarea');
  const inputLoginButton = DOC.createElement('button');

  logInArea.id = 'log-in-area';
  title.innerHTML = 'Введите логин и пароль, если вы не зарегестрированы,' +
    ' то это произойдет автоматически.';
  pLogin.innerHTML = 'Логин:';
  pPassword.innerHTML = 'Пароль';
  nameTextarea.id = 'input-login';
  passwordTextarea.id = 'input-password';
  nameTextarea.onkeydown = loginTextareaKeyDown;
  passwordTextarea.onkeydown = loginTextareaKeyDown;
  inputLoginButton.id = 'input-login-button';
  inputLoginButton.innerHTML = 'Войти/Сохранить';
  inputLoginButton.onclick = clickInputLoginButton;

  logInArea.appendChild(title);
  logInArea.appendChild(pLogin);
  logInArea.appendChild(nameTextarea);
  logInArea.appendChild(pPassword);
  logInArea.appendChild(passwordTextarea);
  logInArea.appendChild(inputLoginButton);

  const main = DOC.getElementsByTagName('main')[0];
  main.appendChild(logInArea);

  this.id = 'log-in-button';
};
