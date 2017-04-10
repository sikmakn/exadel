"use strict";
const DiskDB = require('diskdb');
const db = DiskDB.connect(__dirname + '/db', ['articles']);
/*Model*/
const TEGS = ["teg1", "teg2", "teg3", "teg4", "teg5", "teg6", "teg7", "teg8", "teg9", "teg10"];

function Article(_id, title, summary, createdAt, author, content, teg) {
    this._id = _id;
    this.title = title;
    this.summary = summary;
    this.createdAt = createdAt;
    this.author = author;
    this.content = content;
    this.teg = teg;

    Article.fromObjToArticle = function (obj) {
        return new Article(
            obj.id,
            obj.title,
            obj.summary,
            new Date(obj.createdAt),
            obj.author,
            obj.content,
            obj.teg
        );
    };

    Article.validateArticle = function (article) {
        if (!(article instanceof Article)) {
            return false;
        }
        if (
            (typeof article._id) === 'string' &&
            (typeof article.title) === 'string' &&
            (typeof article.summary) === 'string' &&
            (typeof article.author) === 'string' &&
            (typeof article.content) === 'string' &&
            Array.isArray(article.teg) &&
            (article.createdAt instanceof Date)
        ) {

            return article._id &&
                article.title &&
                article.summary &&
                article.author &&
                article.content &&
                article.teg.length !== 0 &&
                article.teg[0];

        }
        return false;

    };
}

function FilterConfig(author, dateBegin, dateEnd, teg) {
    this.author = author;
    this.dateBegin = dateBegin;
    this.dateEnd = dateEnd;
    this.teg = teg;
}

function NewsModel() {
    let articles = /* [
     {
     id: '1',
     title: 'Минское «Динамо» обыграло ярославский «Локомотив»',
     summary: 'Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2',
     createdAt: new Date('2017-02-27T23:00:00'),
     author: 'Иванов Иван',
     content: 'Гости создали больше опасных моментов и в два раза перебросали минчан,' +
     ' но «зубры» на этот раз очень эффективно использовали свои моменты.',
     teg: ["teg1"]
     },
     {
     id: '2',
     title: 'Как казахстанцы исполнили мечту бедуина',
     summary: 'Эта история о приключении казахстанцев,человеческой доброте и о том' +
     ', как сбылась мечта человека из далекой пустыни на границе Индии с Пакистаном.',
     createdAt: new Date('2017-02-28T23:00:00'),
     author: 'Иванов2 Иван2',
     content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
     'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
     teg: ["teg2"]
     },
     {
     id: '3',
     title: 'Кто имеет право на отсрочку от армии в Казахстане',
     summary: 'Редакция Tengrinews.kz разъясняет, кто может не отдавать долг родине.',
     createdAt: new Date('2017-02-29T23:00:00'),
     author: 'Иванов3 Иван3',
     content: '3Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
     'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
     teg: ["teg3"]
     },
     {
     id: '4',
     title: 'Препарируя любовь. Психологи о главном чувстве',
     summary: '14 февраля многие отмечают День влюбленных,' +
     'и это еще один повод проявить свои чувства к любимым,' +
     'а также поговорить о чувстве любви - великом даре или великом мифе.',
     createdAt: new Date('2017-02-30T23:00:00'),
     author: 'Иванов4 Иван4',
     content: '4Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
     'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
     teg: ["teg4"]
     },
     {
     id: '5',
     title: '5Препарируя любовь. Психологи о главном чувстве',
     summary: '5 14 февраля многие отмечают День влюбленных,' +
     'и это еще один повод проявить свои чувства к любимым,' +
     'а также поговорить о чувстве любви - великом даре или великом мифе.',
     createdAt: new Date('2017-02-30T23:00:00'),
     author: 'Иванов5 Иван5',
     content: '5Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
     'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
     teg: ["teg5"]
     },
     {
     id: '6',
     title: '6 Препарируя любовь. Психологи о главном чувстве',
     summary: '614 февраля многие отмечают День влюбленных,' +
     'и это еще один повод проявить свои чувства к любимым,' +
     'а также поговорить о чувстве любви - великом даре или великом мифе.',
     createdAt: new Date('2017-02-31T23:00:00'),
     author: 'Иванов6 Иван6',
     content: '6Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
     'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
     teg: ["teg6"]
     },
     {
     id: '7',
     title: '7 Препарируя любовь. Психологи о главном чувстве',
     summary: '7 14 февраля многие отмечают День влюбленных,' +
     'и это еще один повод проявить свои чувства к любимым,' +
     'а также поговорить о чувстве любви - великом даре или великом мифе.',
     createdAt: new Date('2017-03-04T23:00:00'),
     author: 'Иванов7 Иван7',
     content: '7Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
     'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
     teg: ["teg7"]
     },
     {
     id: '8',
     title: '8 Препарируя любовь. Психологи о главном чувстве',
     summary: '8 14 февраля многие отмечают День влюбленных,' +
     'и это еще один повод проявить свои чувства к любимым,' +
     'а также поговорить о чувстве любви - великом даре или великом мифе.',
     createdAt: new Date('2017-02-14T23:00:00'),
     author: 'Иванов8 Иван8',
     content: '8Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
     'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
     teg: ["teg8", "teg1"]
     },
     {
     id: '9',
     title: '9 Препарируя любовь. Психологи о главном чувстве',
     summary: '9 14 февраля многие отмечают День влюбленных,' +
     'и это еще один повод проявить свои чувства к любимым,' +
     'а также поговорить о чувстве любви - великом даре или великом мифе.',
     createdAt: new Date('2017-02-30T23:00:00'),
     author: 'Иванов9 Иван9',
     content: '9Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
     'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
     teg: ["teg9"]
     },
     {
     id: '10',
     title: '10 Препарируя любовь. Психологи о главном чувстве',
     summary: '10 14 февраля многие отмечают День влюбленных,' +
     'и это еще один повод проявить свои чувства к любимым,' +
     'а также поговорить о чувстве любви - великом даре или великом мифе.',
     createdAt: new Date('2017-02-30T23:00:00'),
     author: 'Иванов10 Иван10',
     content: '10Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
     'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
     teg: ["teg10"]
     },
     {
     id: '11',
     title: '11 Препарируя любовь. Психологи о главном чувстве',
     summary: '11 14 февраля многие отмечают День влюбленных,' +
     'и это еще один повод проявить свои чувства к любимым,' +
     'а также поговорить о чувстве любви - великом даре или великом мифе.',
     createdAt: new Date('2017-02-30T23:00:00'),
     author: 'Иванов11 Иван11',
     content: '11Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
     'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
     teg: ["teg10", "teg1"]
     }
     ]*/db.articles.find().map(function (item) {
        return new Article(
            item._id,
            item.title,
            item.summary,
            new Date(item.createdAt),
            item.author,
            item.content,
            item.teg
        );
    });

    this.articleLength = articles.length;

    this.setArticles = function (articlesObjects) {
        articles = articlesObjects.map(function (item) {
            return new Article(
                item._id,
                item.title,
                item.summary,
                new Date(item.createdAt),
                item.author,
                item.content,
                item.teg
            );
        });
        this.articleLength = articles.length;
    };

    this.getAllArticles = function () {
        return articles.slice();
    };

    function compareData(first, second) {
        return second.createdAt - first.createdAt;
    }

    function getArticlesByTeg(sortedArticles, filterConfig) {

        if (filterConfig.teg && filterConfig.teg[0].length) {

            if (typeof filterConfig.teg === 'string') {
                filterConfig.teg = [filterConfig.teg];
            }

            if (Array.isArray(filterConfig.teg)) {
                for (let j = 0; j < filterConfig.teg.length; j++) {
                    sortedArticles = sortedArticles.filter(function (obj) {
                        for (let i = 0; i < obj.teg.length; i++) {
                            if (obj.teg[i] === filterConfig.teg[j]) {
                                return true;
                            }
                        }
                        return false;

                    });
                }
            }

        }
        return sortedArticles;
    }

    function getArticlesByAuthor(sortedArticles, filterConfig) {
        if (!(filterConfig.author && typeof filterConfig.author === 'string')) {
            return sortedArticles;
        }

        sortedArticles = articles.filter(
            (obj) =>
            obj.author.toLowerCase() === filterConfig.author.toLowerCase()
        );
        return sortedArticles;
    }

    function getArticlesByData(sortedArticles, filterConfig) {

        if (filterConfig.dateBegin !== 0 && !(filterConfig.dateBegin instanceof Date)) {
            return sortedArticles;
        }
        if (filterConfig.dateEnd !== 0 && !(filterConfig.dateEnd instanceof Date)) {
            return sortedArticles;
        }

        sortedArticles = sortedArticles.filter(function (obj) {
            if (obj.createdAt < filterConfig.dateBegin) return false;

            if (!filterConfig.dateEnd) return true;

            return obj.createdAt === filterConfig.dateEnd;

        });
        return sortedArticles;
    }

    this.getArticles = function (skip = 0, top = 10, filterConfig) {
        if (!(filterConfig && filterConfig instanceof FilterConfig)) {
            filterConfig = new FilterConfig("", 0, 0);
        }

        articles.sort(compareData);

        let sortedArticles = articles;
        sortedArticles = getArticlesByAuthor(sortedArticles, filterConfig);
        sortedArticles = getArticlesByTeg(sortedArticles, filterConfig);
        sortedArticles = getArticlesByData(sortedArticles, filterConfig);

        this.articleLength = sortedArticles.length;
        sortedArticles = sortedArticles.slice(skip, top);

        return sortedArticles;
    };

    this.getArticle = function (_id) {
        const idArticleMass = articles.filter((obj) => obj._id === _id);
        if (!idArticleMass.length) return false;

        return new Article(
            idArticleMass[0].id,
            idArticleMass[0].title,
            idArticleMass[0].summary,
            idArticleMass[0].createdAt,
            idArticleMass[0].author,
            idArticleMass[0].content,
            idArticleMass[0].teg
        );
    };

    this.addArticle = function (article) {
        if (!Article.validateArticle(article)) return false;

        article = db.articles.save(article);
        article.createdAt = new Date(article.createdAt);
        const _id = article._id;
        articles.push(article);

        return _id;
    };

    this.editArticle = function (_id, article) {
        if (typeof _id !== 'string' || !_id || !article) return false;

        let index = -1;
        for (let i = 0; i < articles.length; i++) {
            if (_id === articles[i]._id) {
                index = i;
                break;
            }
        }
        if (index < 0) return false;

        const query = {
            _id: _id
        };
        const dataToUpdate = {};
        if (article.title) {
            articles[index].title = article.title;
            dataToUpdate.title = article.title;
        }
        if (article.summary) {
            articles[index].summary = article.summary;
            dataToUpdate.summary = article.summary;
        }
        if (article.content) {
            articles[index].content = article.content;
            dataToUpdate.content = article.content;
        }
        db.articles.update(query, dataToUpdate);
        return true;
    };

    this.removeArticle = function (_id) {
        let index = -1;
        for (let i = 0; i < articles.length; i++) {
            if (articles[i]._id === _id) {
                index = i;
                break;
            }
        }

        if (index < 0)  return false;

        articles.splice(index, 1);
        db.articles.remove({_id: _id});
        return true;
    };

    function pasteTegs(index, teg) {
        if (typeof teg === 'string') {
            teg = [teg];
        }
        if (!Array.isArray(teg)) return false;
        let j = 0;
        for (let i = 0; i < TEGS.length; i++) {
            if (TEGS[i] === teg[j]) {
                for (let k = 0; k < articles[index].teg.length; k++) {
                    if (articles[index].teg[k] === teg[j]) {
                        return false;
                    }
                }
                j++;
                i = -1;
            }
        }
        if (j === teg.length) {
            teg.forEach((item) => articles[index].teg.push(item));
            return true;
        }

        return false;
    }

    this.addTegs = function (_id, teg) {
        let index = -1;
        articles.forEach(function (item, ind) {
            if (item._id === _id) {
                index = ind;
            }
        });
        if (index < 0 || !teg) return false;

        return pasteTegs(index, teg);
    };

    this.removeTeg = function (_id, teg) {
        let index = -1;
        for (let i = 0; i < articles.length; i++) {
            if (articles[i]._id === _id) {
                index = i;
                break;
            }
        }
        if (index < 0 || articles[index].teg.length <= 1) return false;

        if (!(teg && typeof teg === 'string')) return false;

        let flag = false;
        for (let i = 0; i < TEGS.length; i++) {
            if (TEGS[i] === teg) {
                flag = true;
                break;
            }
        }

        if (!flag) return false;

        let indexTeg;
        for (let i = 0; i < articles[index].teg.length; i++) {
            if (articles[index].teg[i] === teg) {
                indexTeg = i;
            }
        }
        articles[index].teg.splice(indexTeg, 1);
        return true;

    };

    this.replaceAllTegs = function (_id, tegs) {
        let index = -1;
        if (!(Array.isArray(tegs) && tegs.length)) return false;

        for (let i = 0; i < articles.length; i++) {
            if (articles[i]._id === _id) {
                index = i;
                break;
            }
        }

        if (index < 0) return false;

        articles[index].teg = [];
        db.articles.update({_id: _id}, {teg: tegs});
        articles[index].teg = tegs;
        return true;
    };
}

exports.newsModel = NewsModel;
exports.filter = FilterConfig;
exports.Article = Article;