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
      const authorBucket = db.authorsIndex.findOne({ author }); // authorsIndex[author];
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
    const newArticle = toDiskdb(article);
    const id = newArticle._id;
    newArticle.id = id;
    orderIndex.push(id);
    db.orderIndex.save(id);
    articlesLength += 1;
    feedTagsIndex(newArticle, true);
    feedAuthorsIndex(newArticle, true);
    return id;
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
    const article = db.articles.findOne({ _id: id });
    db.articles.remove({ _id: id });
    article.id = article._id;
    feedTagsIndex(article, false);
    feedAuthorsIndex(article, false);
    removeFromOrderIndex(id);
  }

  function readArticle(id) {
    if (!id) {
      throw new Error('please provide id');
    }
    return db.articles.findOne({ _id: id });
  }

  function replaceDataOfArticle(newArticle) {
    const id = newArticle.id;
    const query = { _id: id };
    const dataToBeUpdate = {};
    if (newArticle.title) dataToBeUpdate.title = newArticle.title;
    if (newArticle.summary) dataToBeUpdate.summary = newArticle.summary;
    if (newArticle.content) dataToBeUpdate.content = newArticle.content;
    if (newArticle.tags && newArticle.tags.length) {
      dataToBeUpdate.tags = newArticle.tags;
    }
    db.articles.update(query, dataToBeUpdate);
  }

  function updateArticle(article) {
    const id = article.id;
    const oldArticle = db.articles.findOne({ _id: id }); // articles[id];
    if (article.tags && article.tags.length) {
      feedTagsIndex(oldArticle, false);
      feedTagsIndex(article, true);
    }
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
    let ids = filterByTags(filter.tags) || orderIndex;
    if (filter.author) {
      const idsAuthor = filterByAuthor(filter.author);
      ids = sameElements(ids, idsAuthor);
    }
    let articlesArr = transformIdsToArticles(ids);
    articlesArr.sort((a, b) => b.createdAt - a.createdAt);
    articlesArr = filterByTime(articlesArr, filter.dateBegin, filter.dateEnd);
    articlesLength = articlesArr.length;
    articlesArr = articlesArr.splice(skip, top);
    return articlesArr;
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