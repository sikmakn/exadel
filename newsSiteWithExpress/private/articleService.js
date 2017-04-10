const articleService = (function() {

    // private first
    const articles = {
        'id1': {
            id: 'id1',
            text: 'news 1',
            tags: ['tag1', 'tag2'],
        },
        'id2': {
            id: 'id2',
            text: 'text2',
            tags: ['tag2'],
        }
    };

    const orderIndex = ['id1', 'id2'];

    const tagsIndex = {
        'tag1': ['id1'],
        'tag2': ['id1', 'id2'],
    };

    const feedActionHash = {
        [true]: function (id, tags) {
            tags.map(tagKey => createTagBucket(tagKey))
                .forEach(tag => tag.push(id));
        },
        [false]: function (id, tags) {
            tags.map(tagKey => tagsIndex[tagKey])
                .forEach(ids => removeArticleId(id, ids));
        }
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

    function createTagBucket(tagKey) {
        let tagBucket = tagsIndex[tagKey];
        if (!tagBucket) {
            tagsIndex[tagKey] = [];
            tagBucket = tagsIndex[tagKey];
        }
        return tagBucket;
    }

    function removeArticleId(id, articleIds) {
        const index = articleIds.indexOf(id);
        articleIds.splice(index, 1);
    }

    // public functions go next
    function createArticle(article) {
        const id = article.id;
        orderIndex.push(id);
        articles[id] = article;
        feedTagsIndex(article, true);
    }

    function readArticle(id) {
        if (!id) {
            throw new Error('please provide id');
        }
        return articles[id];
    }

    function updateArticle(article) {
        const id = article.id;
        const oldArticle = articles[id];

        feedTagsIndex(oldArticle, false);
        feedTagsIndex(article, true);
        articles[id] = article;
    }

    function deleteArticle(id) {
        const article = articles[id];
        articles[id] = null;
        delete articles[id];

        feedTagsIndex(article, false);
        removeArticleId(id, orderIndex);
    }

    function findArticles(tag) {
        const ids = tagsIndex[tag] || orderIndex;
        return ids.map(id => articles[id]);
    }

    function findTags() {
        const ids = Object.keys(tagsIndex);
        return ids;
    }

    return {
        createArticle,
        readArticle,
        updateArticle,
        deleteArticle,

        findArticles,
        findTags,
    }
})();

function main() {
    const allArticles = articleService.findArticles();
    console.log(`searching for all articles...`);
    console.log(`all articles in initial order:
        ${JSON.stringify(allArticles)}`);
    console.log(`\n`);

    const allTags = articleService.findTags();
    console.log(`searching for all tag ids...`);
    console.log(`all tag ids in bad order:
        ${JSON.stringify(allTags)}`);
    console.log(`\n`);

    const tag = allTags[1];
    console.log(`checking any tag...`);
    console.log(`tag is ${tag}`);
    console.log(`\n`);


    const articles = articleService.findArticles(tag);
    console.log(`searching articles for ${tag}...`);
    console.log(`found articles: 
        ${JSON.stringify(articles)}`);
    console.log(`\n`);

    const article = {
        id: 'id3',
        text: 'news 3',
        tags: ['tag2', 'tag3']
    };
    articleService.createArticle(article);
    console.log(`creating article: 
        ${JSON.stringify(article)}`);
    const retrievedArticle = articleService.readArticle(article.id);
    console.log(`searching article by ${article.id}: 
        ${JSON.stringify(retrievedArticle)}`);
    const newTags = articleService.findTags();
    console.log(`searching for all tag ids again...`);
    console.log(`all tag ids in bad order:
        ${JSON.stringify(newTags)}`);
    console.log(`please see new tag was created`);
    console.log(`\n`);

    const tag3Articles = articleService.findArticles('tag3');
    console.log(`searching articles for tag3...`);
    console.log(`found articles: 
        ${JSON.stringify(tag3Articles)}`);
    console.log(`\n`);

    const tag2Articles = articleService.findArticles('tag2');
    console.log(`searching articles for tag2...`);
    console.log(`found articles: 
        ${JSON.stringify(tag2Articles)}`);
    console.log(`\n`);

    const article3 = articleService.readArticle('id3');
    console.log(`reading article by 'id3'... 
        please use article id with html data-attr`);
    console.log(`found article: 
        ${JSON.stringify(article3)}`);
    console.log(`\n`);

    article3.tags = ['tag1'];
    articleService.updateArticle(article3);
    console.log(`updating article with 'id3'...`);
    const updatedArticle3 = articleService.readArticle('id3');
    console.log(`reading article by 'id3'...`);
    console.log(`found article: 
        ${JSON.stringify(updatedArticle3)}`);
    console.log(`\n`);

    const allNewTags = articleService.findTags();
    console.log(`searching for all tag ids...`);
    console.log(`all tag ids in bad order:
        ${JSON.stringify(allNewTags)}`);
    console.log(`BUT! We don't have article with tag3 any more!`);
    const allNewArticles = articleService.findArticles();
    console.log(`searching for all articles...`);
    console.log(`all articles in initial order:
        ${JSON.stringify(allArticles)}`);
    console.log(`to get 10, please fix tags index!`);
    console.log(`\n`);


    const article4 = {
        id: 'id4',
        text: 'news 4',
        tags: ['tag2', 'tag4']
    };
    articleService.createArticle(article4);
    console.log(`creating article: 
        ${JSON.stringify(article4)}`);
    const retrievedArticle4 = articleService.readArticle(article4.id);
    console.log(`searching article by ${article4.id}: 
        ${JSON.stringify(retrievedArticle4)}`);
    const newTagsTest = articleService.findTags();
    console.log(`searching for all tag ids again...`);
    console.log(`all tag ids in bad order:
        ${JSON.stringify(newTagsTest)}`);
    console.log(`please see new tag was created`);
    console.log(`lets remove article id4`);
    articleService.deleteArticle('id4');
    const allArticlesAfterDel = articleService.findArticles();
    console.log(`searching for all articles...`);
    console.log(`all articles in initial order:
        ${JSON.stringify(allArticlesAfterDel)}`);
    const newTagsAfterDel = articleService.findTags();
    console.log(`searching for all tag ids again...`);
    console.log(`all tag ids in bad order:
        ${JSON.stringify(newTagsAfterDel)}`);
    console.log(`to get 10, please fix tags index!`);
    console.log(`\n`);
}

main();
