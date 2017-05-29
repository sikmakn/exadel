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

  const ArticleCollection = require('./createDB.js').ArticleCollection;
  const AuthorsIndexCollection = require('./createDB.js')
    .AuthorsIndexCollection;
  const TagsIndexCollection = require('./createDB.js').TagsIndexCollection;
  const MongoClient = require('mongodb').MongoClient;

  // private first
  let orderIndex;// = db.orderIndex.find();

  let articlesLength;// = orderIndex.length;

  MongoClient.connect('mongodb://localhost/myStore')
  .then((db) => {
    const usersCollection = db.collection('orderIndex');
    usersCollection.find().nextObject((err, ordInd) => {
      if (err) throw new Error(err);
      if (ordInd) {
        orderIndex = ordInd.order;
        articlesLength = orderIndex.length;
      } else {
        orderIndex = [];
        articlesLength = 0;
      }
      db.close();
    });
  })
  .catch((err) => {
    console.log(err);
    throw new Error(err);
  });
  /*function removeArticleId(id, articleIds, itemArr) {
    id._id = id.toString();
    let index;
    articleIds.ids.forEach((elem, i) => {
      if (elem === id._id) index = i;
    });
    articleIds.ids.splice(index, 1);
    db[itemArr].update({ _id: articleIds.id }, { ids: articleIds.ids });
  }*/

  function isAuthorBucket(authorBucket, id) {
    authorBucket.ids.push(id);
    AuthorsIndexCollection.update(
      { _id: authorBucket._id },
      { ids: authorBucket.ids }
    )
      .then((n) => {
        console.log(n);
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  const feedAuthorActionHash = {
    [true](id, author) {
      AuthorsIndexCollection.findByAuthor(author).then((authorBucket) => {
        authorBucket = authorBucket[0];
        if (authorBucket) {
          isAuthorBucket(authorBucket, id);
          return;
        }
        id._id = id.toString();
        authorBucket = new AuthorsIndexCollection({
          author,
          ids: [id],
        });
        authorBucket.save().then((n) => {
          console.log(n);
        });
      });
    },
    [false](id, author) {
      // const authorBucket = db.authorsIndex.findOne({ author });
      AuthorsIndexCollection.findByAuthor(author)
        .then((authorBucket) => {
          authorBucket = authorBucket[0]._doc;
          if (!(!authorBucket || !authorBucket.ids.length)) {
            // removeArticleId(id, authorBucket, 'authorsIndex');
            let index;
            authorBucket.ids.forEach((elem, i) => {
              if (elem.toString() === id.toString()) index = i;
            });
            //const index = authorBucket.ids.indexOf(id);
            authorBucket.ids.splice(index, 1);
            if (authorBucket.ids.length) {
              AuthorsIndexCollection.update(
                { _id: authorBucket._id },
                { ids: authorBucket.ids }
              ).then((n) => {
                console.log(n);
              });
            } else {
              AuthorsIndexCollection.findByAuthor(author)
                .remove()
                .then((n) => {
                  console.log(n);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }
          // if (!authorBucket.ids.length) db.authorsIndex.remove({ author });
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
  };

  function feedAuthorsIndex(article, isAddMode) {
    const id = article.id;
    const author = article.author;
    if (!author) return;

    const actionFunction = feedAuthorActionHash[isAddMode];
    actionFunction(id, author);
  }

  /* function createTagBucket(tagKey) {
    let tagBucket = db.tagsIndex.findOne({ tagKey });
    if (tagBucket) return tagBucket;
    tagBucket = {
      tagKey,
      ids: [],
    };
    return db.tagsIndex.save(tagBucket);
  }*/
  function updateTagBucket(tagBucket, id) {
    tagBucket = tagBucket._doc;
    const doubling = tagBucket.ids.some((idEl) => { 
      return idEl.toString() === id;
    });
    if (doubling) {
      return;
    }
    tagBucket.ids.push(id);
    TagsIndexCollection.update(
      { _id: tagBucket._id },
      { ids: tagBucket.ids }
    )
      .then((n) => {
        console.log(n);
      })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
  }

  const feedActionHash = {
    [true](id, tags) {
      /* tags.map(tagKey => createTagBucket(tagKey)).forEach((tag) => {
        tag.ids.push(id);
        db.tagsIndex.update({ _id: tag._id }, { ids: tag.ids });
      });*/
      TagsIndexCollection.findByTagKey({
        tagKey: { $in: tags },
      })
        .then((tagBuckets) => { 
          tags.forEach((tagKey) => {
            let tagBucket = tagBuckets.filter((tagBuck) => {
              return tagBuck._doc.tagKey === tagKey;
            });
            tagBucket = tagBucket[0];
            if (!tagBucket) {
              tagBucket = new TagsIndexCollection({
                tagKey,
                ids: [],
              });
              tagBucket.save()
                  .then((savedBuck) => {
                    console.log(savedBuck);
                  }).catch((err) => {
                    throw new Error(err);
                  });
            }
            updateTagBucket(tagBucket, id);
          });
        })
        .catch((err) => {
          console.log(err);
          throw new Error(err);
        });
    },
    [false](id, tags) {
      /* tags
        .map(tagKey => db.tagsIndex.findOne({ tagKey }))
        .forEach((tagBucket) => {
          tagBucket.id = tagBucket._id;
          removeArticleId(id, tagBucket, 'tagsIndex');
          if (!tagBucket.ids.length) {
            db.tagsIndex.remove({ _id: tagBucket._id }, false);
          }
        });*/
      TagsIndexCollection.findByTagKey({
        tagKey: { $in: tags },
      }).then((tagBuckets) => {
        tagBuckets.forEach((tagBucket) => {
          tagBucket = tagBucket._doc;
          tagBucket.id = tagBucket._id;
          id._id = id.toString();
          let index;
          tagBucket.ids.forEach((elem, i) => {
            if (elem.toString() === id._id) index = i;
          });
          tagBucket.ids.splice(index, 1);

          if (tagBucket.ids.length) {
            TagsIndexCollection.update(
              { _id: tagBucket.id },
              { ids: tagBucket.ids }
            )
            .then((n) => {
              console.log(n);
            })
            .catch((err) => {
              console.log(err);
              throw new Error(err);
            });
          } else {
            TagsIndexCollection.findByTagKey({ tagKey: tagBucket.tagKey }).remove()
            .then((n) => {
              console.log(n);
            });
          }
        });
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

  /* function toDiskdb(obj) {

     const article = {
      title: obj.title,
      summary: obj.summary,
      createdAt: obj.createdAt,
      author: obj.author,
      content: obj.content,
      tags: obj.tags
    };
    return db.articles.save(article);
}*/

  function createArticle(article) {
    const articleForColl = new ArticleCollection({
      title: article.title,
      summary: article.summary,
      createdAt: article.createdAt,
      author: article.author,
      content: article.content,
      tags: article.tags,
    });
    const promise = articleForColl
      .save()
      .then((newArticle) => {
        newArticle = newArticle._doc;
        const id = newArticle._id;
        newArticle.id = id;
        return newArticle;
      })
      .catch((err) => {
        throw new Error(err);
      });
    /* const newArticle = toDiskdb(article);
      if (newArticle) {
        const id = newArticle._id;
        newArticle.id = id;
        resolve(newArticle);
      }
      reject(new Error('diskdb can`t make article'));*/
    promise.then((resolve) => {
      orderIndex.push(resolve.id);
      //db.orderIndex.save(resolve.id);
       MongoClient.connect('mongodb://localhost/myStore')
       .then((db) => {
         const orderCollection = db.collection('orderIndex');
         if (articlesLength) {
           orderCollection.update({}, { order: orderIndex })
           .then((n) => {
             console.log(n);
           });
         } else {
           orderCollection.insertOne({ order: orderIndex });
         }
         articlesLength += 1;
         db.close();
       })
        .catch((err) => {
          console.log(err);
          throw new Error(err);
        });
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
    let index = -1;
    orderIndex.forEach((elem, i) => {
      if (elem.toString === id.toString) index = i;
    });
    orderIndex.splice(index, 1);
    /*db.orderIndex.remove();
    db.connect(`${__dirname}/db`, ['orderIndex']);
    db.orderIndex.save(orderIndex);*/
    MongoClient.connect('mongodb://localhost/myStore')
       .then((db) => {
         const orderCollection = db.collection('orderIndex');
         orderCollection.update({}, { order: orderIndex })
           .then((n) => {
             console.log(n);
           });
         db.close();
       })
        .catch((err) => {
          console.log(err);
          throw new Error(err);
        });

    articlesLength -= 1;
  }

  function deleteArticle(id) {
    const promise = ArticleCollection.findById(id).then((articles) => {
      ArticleCollection.findById(id)
        .remove()
        .then((n) => {
          console.log(n);
        })
        .catch((err) => {
          console.log(err);
        });
      const article = articles[0]._doc;
      article.id = article._id;
      if (article) return article;
      throw new Error('diskdb can`t find news, maybe news does not exist ');
    });
    /* const article = db.articles.findOne({ _id: id });
      article.id = article._id;
      if (article) resolve(article);
      reject(new Error("diskdb can`t find news, maybe news does not exist "));*/
    /* promise.then(() => {
      db.articles.remove({ _id: id });
    });*/
    promise.then((resolve) => {
      feedTagsIndex(resolve, false);
    });
    promise.then((resolve) => {
      feedAuthorsIndex(resolve, false);
    });
    promise.then((resolve) => {
      removeFromOrderIndex(resolve._id);
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
    // return db.articles.findOne({ _id: id });
    return ArticleCollection.findById(id).exec();
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
      // db.articles.update(query, resolve);
      ArticleCollection.update(query, resolve)
        .then((n) => {
          console.log(n);
        })
        .catch((err) => {
          console.log(err);
          throw new Error(err);
        });
    });
  }

  function updateArticle(article) {
    const promise = new Promise((resolve, reject) => {
      /* const id = article.id;
      const oldArticle = db.articles.findOne({ _id: id });
      if (oldArticle) resolve(oldArticle);
      reject(new Error('diskdb can`t find article'));*/

      ArticleCollection.findById(article.id)
        .then((oldArticle) => {
          if (oldArticle) resolve(oldArticle);
          reject(new Error('diskdb can`t find article'));
        })
        .catch((err) => {
          reject(new Error('diskdb can`t find article'));
        });
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
    if (!tags || !tags[0].length) { 
      return new Promise((resolve) => {
        resolve(orderIndex);
      });
    }

    /*const idsMatrix = tags.map((tag) => {
      const tagBucket = db.tagsIndex.findOne({ tagKey: tag });
      if (tagBucket) return tagBucket.ids;
      return [];
    });
    ids = idsMatrix[0];
    idsMatrix.forEach((idsTag) => {
      ids = sameElements(ids, idsTag);
    });
    return ids;*/

    return TagsIndexCollection.findByTagKey({ tagKey: { $in: tags } })
    .then((tagBuckets) => {
      const idsMatrix = tagBuckets.map((tagBucket) => {
        if (tagBucket) return tagBucket.ids;
        return [];
      });
      ids = idsMatrix[0];
      idsMatrix.forEach((idsTag) => {
        ids = sameElements(ids, idsTag);
      });
      return ids;
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err);
    });
  }

  /* function filterByAuthor(author) {
    const ids = db.authorsIndex.findOne({ author }).ids || orderIndex;
    return ids;
  }*/

  function filterByTime(articleArr, dateBegin, dateEnd) {
    if (!dateEnd && dateBegin !== 0 && !dateBegin) return articleArr;

    const startDate = dateBegin || 0;
    const finishDate = dateEnd || new Date();
    return articleArr.filter((article) => {
      const thisDate = article.createdAt;
      return thisDate >= startDate && thisDate <= finishDate;
    });
  }

  /* function transformIdsToArticles(ids) {
     return ids.map((id) => {
      const article = db.articles.findOne({ _id: id });
      article.id = article._id;
      article.createdAt = new Date(article.createdAt);
      return article;
    });
  }*/
  function outputArticles(resolve, ids, filter, skip, top) {
    ids.then((idsArr) => {
      ArticleCollection.find({
        _id: { $in: idsArr },
      }).then((articlesArr) => {
        articlesArr.sort((a, b) => b.createdAt - a.createdAt);
        articlesArr = filterByTime(articlesArr, filter.dateBegin, filter.dateEnd);
        articlesLength = articlesArr.length;
        articlesArr = articlesArr.splice(skip, top);
        resolve(articlesArr);
      })
    .catch((err) => {
      console.log(err);
      throw new Error(err);
    });
    });
  }
  function findArticles(skip = 0, top = 10, filter = {}) {
    const promise = new Promise((resolve, reject) => {
      const ids = filterByTags(filter.tags);// || orderIndex;
      if (filter.author) {
        ids.then((idsArr) => {
          AuthorsIndexCollection.findByAuthor(filter.author)
          .then((idsAuthor) => {
            idsAuthor = idsAuthor[0]._doc.ids;
            idsAuthor = idsAuthor.filter((item) => {
              let flag = false;
              idsArr.forEach((item2) => {
                if (item.toString() === item2.toString()) flag = true;
              });
              return flag;
            });
           // idsArr = sameElements(idsArr, idsAuthor);

            outputArticles(resolve, new Promise(res => res(idsAuthor)), filter, skip, top);
          }).catch((err) => { console.log(err); });
        }).catch(err => reject(err));
      } else {
      outputArticles(resolve, ids, filter, skip, top);
      }
    });
    return promise;
/*    if (filter.author) {
      // const idsAuthor = filterByAuthor(filter.author);
      return AuthorsIndexCollection.findByAuthor({ author: filter.author })
        .then((idsAuthor) => {
          ids = sameElements(ids, idsAuthor);
          return ArticleCollection.find({
            _id: { $in: ids },
          }).then((articlesArr) => {
            articlesArr.sort((a, b) => b.createdAt - a.createdAt);
            articlesArr = filterByTime(articlesArr, filter.dateBegin, filter.dateEnd);
            articlesLength = articlesArr.length;
            articlesArr = articlesArr.splice(skip, top);
            return articlesArr;
          });
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
    // let articlesArr = transformIdsToArticles(ids);

    return ArticleCollection.find({
      _id: { $in: ids },
    }).then((articlesArr) => {
      articlesArr.sort((a, b) => b.createdAt - a.createdAt);
      articlesArr = filterByTime(articlesArr, filter.dateBegin, filter.dateEnd);
      articlesLength = articlesArr.length;
      articlesArr = articlesArr.splice(skip, top);
      return articlesArr;
    });*/
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
