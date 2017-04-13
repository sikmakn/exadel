/**
 * Created by Никита on 10.04.2017.
 */

const articleService = (function () {
  // private first
  const articles = {
    id1: {
      id: 'id1',
      title: 'title1',
      summary: 'summary1',
      content: 'news 1',
      author: 'r',
      createdAt: new Date('2017-02-27T23:00:00'),
      tags: ['tag1', 'tag2'],
    },
    id2: {
      id: 'id2',
      title: 'title2',
      summary: 'summary2',
      content: 'news 2',
      author: 'sikmak',
      createdAt: new Date('2017-02-28T23:00:00'),
      tags: ['tag2'],
    },
  };

  const orderIndex = ['id1', 'id2'];

  const tagsIndex = {
    tag1: ['id1'],
    tag2: ['id1', 'id2'],
  };

  const authorsIndex = {
    r: ['id1'],
    sikmak: ['id2'],
  };

  let articleLength = orderIndex.length;

  function removeArticleId(id, articleIds) {
    const index = articleIds.indexOf(id);
    articleIds.splice(index, 1);
  }

  const feedAuthorActionHash = {
    [true](id, author) {
      let authorBucket = authorsIndex[author];
      if (!authorBucket) {
        authorsIndex[author] = [];
        authorBucket = authorsIndex[author];
      }
      authorBucket.push(id);
    },
    [false](id, author) {
      const authorBucket = authorsIndex[author];
      if (!authorBucket || !authorBucket.length) return;
      removeArticleId(id, authorBucket);
      if (!authorsIndex[author].length) delete authorsIndex[author];
    },
  };

  function feedAuthorsIndex(article, isAddMode) {
    const id = article.id;
    const author = article.author;
    if (!author) return;

    const actionFunction = feedAuthorActionHash[isAddMode];
    actionFunction(id, author);
  }

  function createTagBucket(tagKey) {
    let tagBucket = tagsIndex[tagKey];
    if (!tagBucket) {
      tagsIndex[tagKey] = [];
      tagBucket = tagsIndex[tagKey];
    }
    return tagBucket;
  }

  const feedActionHash = {
    [true](id, tags) {
      tags.map(tagKey => createTagBucket(tagKey)).forEach(tag => tag.push(id));
    },
    [false](id, tags) {
      tags.map(tagKey => tagsIndex[tagKey]).forEach((ids, index) => {
        removeArticleId(id, ids);
        if (!ids.length) delete tagsIndex[tags[index]];
      });
    },
  };

  function feedTagsIndex(article, isAddMode) {
    const id = article.id;
    const tags = article.tags;
    if (!tags || tags.length === 0) {
      return;
    }
    const actionFunction = feedActionHash[isAddMode];
    actionFunction(id, tags);
  }

  function createArticle(article) {
    const newArticle = article;
    const id = String(new Date().getTime());
    newArticle.id = id;
    orderIndex.push(id);
    articles[id] = article;
    feedTagsIndex(article, true);
    feedAuthorsIndex(article, true);
    return id;
  }

  function deleteArticle(id) {
    const article = articles[id];
    articles[id] = null;
    delete articles[id];

    feedTagsIndex(article, false);
    feedAuthorsIndex(article, false);
    removeArticleId(id, orderIndex);
  }

  function readArticle(id) {
    if (!id) {
      throw new Error('please provide id');
    }
    return articles[id];
  }

  function replaceDataOfArticle(newArticle) {
    const id = newArticle.id;
    if (newArticle.title) articles[id].title = newArticle.title;
    if (newArticle.summary) articles[id].summary = newArticle.summary;
    if (newArticle.content) articles[id].content = newArticle.content;
    if (newArticle.tags && newArticle.tags.length) {
      articles[id].tags = newArticle.tags;
    }
  }

  function updateArticle(article) {
    const id = article.id;
    const oldArticle = articles[id];
    if (article.tags && article.tags.length) {
      feedTagsIndex(oldArticle, false);
      feedTagsIndex(article, true);
    }
    replaceDataOfArticle(article);
  }

  function sameElements(arrFisrt, arrSecond) {
    const arrSame = arrFisrt.filter(elem => arrSecond.indexOf(elem) >= 0);
    return arrSame;
  }

  function filterByTags(tags) {
    let ids;
    if (!tags || !tags[0].length) return ids;
    const idsMatrix = tags.map(tag => tagsIndex[tag]);
    ids = idsMatrix[0];
    idsMatrix.forEach((idsTag) => {
      ids = sameElements(ids, idsTag);
    });
    return ids;
  }

  function filterByAuthor(author) {
    const ids = authorsIndex[author] || orderIndex;
    return ids;
  }

  function filterByTime(articleArr, dateBegin, dateEnd) {
    const startDate = dateBegin || 0;
    const finishDate = dateEnd || new Date();

    return articleArr.filter((article) => {
      const thisDate = article.createdAt;
      return thisDate >= startDate && thisDate <= finishDate;
    });
  }

  function findArticles(skip = 0, top = 9, filter = {}) {
    let ids = filterByTags(filter.tags) || orderIndex;
    if (filter.author) {
      const idsAuthor = filterByAuthor(filter.author);
      ids = sameElements(ids, idsAuthor);
    }
    let articlesArr = ids.map(id => articles[id]);
    articlesArr.sort((a, b) => b.createdAt - a.createdAt);
    articlesArr = filterByTime(articlesArr, filter.dateBegin, filter.dateEnd);
    articleLength = articlesArr.length;
    articlesArr = articlesArr.splice(skip, top);
    return articlesArr;
  }

  function findTags() {
    const ids = Object.keys(tagsIndex);
    return ids;
  }

  function findAuthors() {
    const ids = Object.keys(authorsIndex);
    return ids;
  }

  function findOrderIndex() {
    console.log(orderIndex);
    console.log(articles);
  }

  return {
    createArticle,
    readArticle,
    updateArticle,
    deleteArticle,

    findArticles,
    findTags,
    findOrderIndex,
    findAuthors,

    articleLength,
  };
}());

module.exports = articleService;
