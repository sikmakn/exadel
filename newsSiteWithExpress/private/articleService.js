/**
 * Created by Никита on 10.04.2017.
 */
const DiskDB = require('diskdb');

const articleService = (function () {
  const db = DiskDB.connect(`${__dirname}/db`, [
    'articles',
    'orderIndex',
    'tagsIndex',
    'authorsIndex',
  ]);

  // private first
  const orderIndex = db.orderIndex.find();

  let articlesLength = orderIndex.length;

  function removeArticleId(id, articleIds, itemArr) {
    const index = articleIds.ids.indexOf(id);
    articleIds.ids.splice(index, 1);
    db[itemArr].update({ _id: articleIds.id }, { ids: articleIds.ids });
  }

  function firstInSecond(item, itemArr, key) {
    return db[itemArr].findOne({ [key]: item });
  }

  const feedAuthorActionHash = {
    [true](id, author) {
      let authorBucket = firstInSecond(author, 'authorsIndex', 'author');
      if (authorBucket) {
        authorBucket.ids.push(id);
        db.authorsIndex.update(
          { _id: authorBucket._id },
          { ids: authorBucket.ids });
        return;
      }
      authorBucket = {
        author,
        ids: [],
      };
      authorBucket.ids.push(id);
      authorBucket = db.authorsIndex.save(authorBucket);
    },
    [false](id, author) {
      const authorBucket = db.authorsIndex.findOne({ author });
      if (!authorBucket || !authorBucket.ids.length) return;
      authorBucket.id = authorBucket._id;
      removeArticleId(id, authorBucket, 'authorsIndex');
      if (!authorBucket.ids.length) db.authorsIndex.remove({ author });
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
    let tagBucket = firstInSecond(tagKey, 'tagsIndex', 'tagKey');
    if (tagBucket) return tagBucket;
    tagBucket = {
      tagKey,
      ids: [],
    };
    return db.tagsIndex.save(tagBucket);
  }

  const feedActionHash = {
    [true](id, tags) {
      tags.map(tagKey => createTagBucket(tagKey)).forEach((tag) => {
        tag.ids.push(id);
        db.tagsIndex.update({ _id: tag._id }, { ids: tag.ids });
      });
    },
    [false](id, tags) {
      tags
        .map(tagKey => db.tagsIndex.findOne({ tagKey }))
        .forEach((tagBucket) => {
          tagBucket.id = tagBucket._id;
          removeArticleId(id, tagBucket, 'tagsIndex');
          if (!tagBucket.ids.length) {
            db.tagsIndex.remove({ _id: tagBucket._id }, false);
          }
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

  function toDiskdb(obj) {
    const article = {
      title: obj.title,
      summary: obj.summary,
      createdAt: obj.createdAt,
      author: obj.author,
      content: obj.content,
      tags: obj.tags,
    };
    return db.articles.save(article);
  }

  function createArticle(article) {
    const promise = new Promise((resolve, reject) => {
      const newArticle = toDiskdb(article);
      if (newArticle) {
        const id = newArticle._id;
        newArticle.id = id;
        resolve(newArticle);
      }
      reject(new Error('diskdb can`t make article'));
    });

    promise.then((resolve) => {
      orderIndex.push(resolve.id);
      db.orderIndex.save(resolve.id);
      articlesLength += 1;
    });
    promise.then((resolve) => {
      feedTagsIndex(resolve, true);
    });
    promise.then((resolve) => {
      feedAuthorsIndex(resolve, true);
    });
    promise.catch((err) => {
      console.log(err);
      throw new Error(err);
    });
    return promise.then(newArticle => newArticle.id);
  }

  function removeFromOrderIndex(id) {
    const index = orderIndex.indexOf(id);
    orderIndex.splice(index, 1);
    db.orderIndex.remove();
    db.connect(`${__dirname}/db`, ['orderIndex']);
    db.orderIndex.save(orderIndex);
    articlesLength -= 1;
  }

  function deleteArticle(id) {
    const promise = new Promise((resolve, reject) => {
      const article = db.articles.findOne({ _id: id });
      article.id = article._id;
      if (article) resolve(article);
      reject(new Error('diskdb can`t find news, maybe news does not exist '));
    });
    promise.then(() => {
      db.articles.remove({ _id: id });
    });
    promise.then((resolve) => {
      feedTagsIndex(resolve, false);
    });
    promise.then((resolve) => {
      feedAuthorsIndex(resolve, false);
    });
    promise.then(() => {
      removeFromOrderIndex(id);
    });
    promise.catch((err) => {
      console.log(err);
      throw new Error(err);
    });
  }

  function readArticle(id) {
    if (!id) {
      throw new Error('please provide id');
    }
    return db.articles.findOne({ _id: id });
  }

  function replaceDataOfArticle(newArticle) {
    const promise = new Promise((resolve) => {
      const dataToBeUpdate = {};
      if (newArticle.title) dataToBeUpdate.title = newArticle.title;
      if (newArticle.summary) dataToBeUpdate.summary = newArticle.summary;
      if (newArticle.content) dataToBeUpdate.content = newArticle.content;
      if (newArticle.tags && newArticle.tags.length) {
        dataToBeUpdate.tags = newArticle.tags;
      }
      resolve(dataToBeUpdate);
    });
    promise.then((resolve) => {
      const id = newArticle.id;
      const query = { _id: id };
      db.articles.update(query, resolve);
    });
  }

  function updateArticle(article) {
    const promise = new Promise((resolve, reject) => {
      const id = article.id;
      const oldArticle = db.articles.findOne({ _id: id });
      if (oldArticle) resolve(oldArticle);
      reject(new Error('diskdb can`t find article'));
    });
    promise.then((resolve) => {
      if (article.tags && article.tags.length) {
        feedTagsIndex(resolve, false);
        feedTagsIndex(article, true);
      }
    });
    promise.catch((err) => {
      console.log(err);
      throw new Error(err);
    });
    replaceDataOfArticle(article);
  }

  function sameElements(arrFisrt, arrSecond) {
    if (arrFisrt === arrSecond) return arrFisrt;
    const arrSame = arrFisrt.filter(elem => arrSecond.indexOf(elem) >= 0);
    return arrSame;
  }

  function filterByTags(tags) {
    let ids;
    if (!tags || !tags[0].length) return ids;

    const idsMatrix = tags.map((tag) => {
      const tagBucket = db.tagsIndex.findOne({ tagKey: tag });
      if (tagBucket) return tagBucket.ids;
      return [];
    });
    ids = idsMatrix[0];
    idsMatrix.forEach((idsTag) => {
      ids = sameElements(ids, idsTag);
    });
    return ids;
  }

  function filterByAuthor(author) {
    const ids = db.authorsIndex.findOne({ author }).ids || orderIndex;
    return ids;
  }

  function filterByTime(articleArr, dateBegin, dateEnd) {
    if (!dateEnd && dateBegin !== 0 && !dateBegin) return articleArr;

    const startDate = dateBegin || 0;
    const finishDate = dateEnd || new Date();
    return articleArr.filter((article) => {
      const thisDate = article.createdAt;
      return thisDate >= startDate && thisDate <= finishDate;
    });
  }

  function transformIdsToArticles(ids) {
    return ids.map((id) => {
      const article = db.articles.findOne({ _id: id });
      article.id = article._id;
      article.createdAt = new Date(article.createdAt);
      return article;
    });
  }

  function findArticles(skip = 0, top = 10, filter = {}) {
    const promise = new Promise((resolve) => {
      const ids = filterByTags(filter.tags) || orderIndex;
      resolve(ids);
    })
      .then((ids) => {
        if (filter.author) {
          const idsAuthor = filterByAuthor(filter.author);
          ids = sameElements(ids, idsAuthor);
        }
        return ids;
      })
      .then(ids => transformIdsToArticles(ids))
      .then((articlesArr) => {
        articlesArr.sort((a, b) => b.createdAt - a.createdAt);
        articlesArr = filterByTime(
          articlesArr,
          filter.dateBegin,
          filter.dateEnd);
        articlesLength = articlesArr.length;
        articlesArr = articlesArr.splice(skip, top);
        return articlesArr;
      });

    return promise;
  }

  function findArticlesLength() {
    return articlesLength;
  }

  return {
    createArticle,
    readArticle,
    updateArticle,
    deleteArticle,

    findArticles,
    findArticlesLength,
  };
}());

module.exports = articleService;
