const DiskDB = require('diskdb');

const db = DiskDB.connect(`${__dirname}/db`, [
  'articles',
  'orderIndex',
  'tagsIndex',
  'authorsIndex',
]);
const articles = {};
const orderIndex = [];
const tagsIndex = [];
const authorsIndex = [];
db.articles.find().forEach((item) => {
  articles[item._id] = {
    id: item._id,
    title: item.title,
    summary: item.summary,
    createdAt: new Date(item.createdAt),
    author: item.author,
    content: item.content,
    tags: item.tags,
  };
  orderIndex.push(item._id);
  feedAuthorsIndex(articles[item._id], true);
  feedTagsIndex(articles[item._id], true);
});
// ///////////////////////

function feedAuthorsIndex(article, isAddMode) {
  const id = article.id;
  const author = article.author;
  if (!author) return;

  let authorBucket;
  for (let i = 0; i < authorsIndex.length; i += 1) {
    if (authorsIndex[i].author === author) {
      authorBucket = authorsIndex[i];
      break;
    }
  }
  if (!authorBucket) {
    authorBucket = {
      author,
      ids: [],
    };
    authorsIndex.push(authorBucket);
  }
  authorBucket.ids.push(id);
}
// ///////////////////////////////////////////////////////////
function createTagBucket(tagKey) {
  let tagBucket;
  for (let i = 0; i < tagsIndex.length; i += 1) {
    if (tagsIndex[i].tagKey === tagKey) {
      tagBucket = tagsIndex[i];
      break;
    }
  }
  if (!tagBucket) {
    tagBucket = {
      tagKey,
      ids: [],
    };
    tagsIndex.push(tagBucket);
  }
  return tagBucket;
}

function feedTagsIndex(article, isAddMode) {
  const id = article.id;
  const tags = article.tags;
  if (!tags || tags.length === 0) {
    return;
  }
  const actionFunction = function (id, tags) {
    tags
      .map(tagKey => createTagBucket(tagKey))
      .forEach(tag => tag.ids.push(id));
  };
  actionFunction(id, tags);
}
// ////////////////////
console.log(articles);
console.log(orderIndex);
console.log(authorsIndex);
console.log(tagsIndex);
db.orderIndex.save(orderIndex);
db.authorsIndex.save(authorsIndex);
db.tagsIndex.save(tagsIndex);
