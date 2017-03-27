"use strict";
/*Model*/
var TEGS = ["teg1", "teg2", "teg3", "teg4", "teg5", "teg6", "teg7", "teg8", "teg9", "teg10"];

function Article(id, title, summary, createdAt, author, content, teg) {
    this.id = id;
    this.title = title;
    this.summary = summary;
    this.createdAt = createdAt;
    this.author = author;
    this.content = content;
    this.teg = teg;

    Article.validateArticle = function (article) {
        if (!(article instanceof Article)) {
            return false;
        }
        if ((typeof article.id) == 'string' && (typeof article.title) == 'string' && (typeof article.summary) == 'string'
            && (typeof article.author) == 'string' && (typeof article.content) == 'string' && Array.isArray(article.teg)
            && (article.createdAt instanceof Date)) {

            if (article.id && article.title && article.summary && article.author && article.content && article.teg.length != 0 && article.teg[0]) {
                return true;
            }

            return false;
        }
        return false;
    };
};

function FilterConfig(author, dataBegin, dataEnd, teg) {
    this.author = author;
    this.dataBegin = dataBegin;
    this.dataEnd = dataEnd;
    this.teg = teg;
};

function NewsModel() {
    var articles = [
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
    ].map(function (item) {
        return new Article(item.id, item.title, item.summary, item.createdAt, item.author, item.content, item.teg);
    });

    this.articleLength = articles.length;

    this.setArticles = function (articlesObjects) {
        articles = articlesObjects.map(function (item) {
            return new Article(item.id, item.title, item.summary, item.createdAt, item.author, item.content, item.teg);
        });
        this.articleLength = articles.length;
    };

    this.getAllArticles = function () {
        return articles.slice();
    };

    function compareData(first, second) {
        return second.createdAt - first.createdAt;
    };

    function getArticlesByTeg(sortedArticles, filterConfig) {

        if (filterConfig.teg && filterConfig.teg[0].length) {

            if (typeof filterConfig.teg == 'string') {
                filterConfig.teg = [filterConfig.teg];
            }

            if (Array.isArray(filterConfig.teg)) {
                for (var j = 0; j < filterConfig.teg.length; j++) {
                    sortedArticles = sortedArticles.filter(function (obj) {
                        for (var i = 0; i < obj.teg.length; i++) {
                            if (obj.teg[i] == filterConfig.teg[j]) {
                                return true;
                            }
                        }
                        return false;

                    });
                }
            }

        }
        return sortedArticles;
    };

    function getArticlesByAuthor(sortedArticles, filterConfig) {
        if (filterConfig.author && typeof filterConfig.author == 'string') {
            sortedArticles = articles.filter(function (obj) {
                if (obj.author.toLowerCase() == filterConfig.author.toLowerCase()) {
                    return true;
                }
                return false;
            });
        }
        return sortedArticles;
    };

    function getArticlesByData(sortedArticles, filterConfig) {
        if ((filterConfig.dataBegin || filterConfig.dataEnd) &&
            (filterConfig.dataBegin instanceof Date && filterConfig.dataEnd instanceof Date)) {

            sortedArticles = sortedArticles.filter(function (obj) {
                if (obj.createdAt >= filterConfig.dataBegin) {
                    if (!filterConfig.dataEnd) {
                        return true;
                    } else {
                        if (obj.createdAt <= filterConfig.dataEnd) {
                            return true;
                        }
                        return false;
                    }
                }
                return false;
            });

        }

        return sortedArticles;
    };

    this.getArticles = function (skip, top, filterConfig) {
        skip = skip || 0;
        if (!top || (top instanceof Object) || (typeof top == "string")) {
            top = 10;
        }
        if (!(filterConfig && filterConfig instanceof FilterConfig)) {
            filterConfig = new FilterConfig("", 0, 0);
        }

        articles.sort(compareData);
        var sortedArticles = articles;

        sortedArticles = getArticlesByAuthor(sortedArticles, filterConfig);
        sortedArticles = getArticlesByTeg(sortedArticles, filterConfig);
        sortedArticles = getArticlesByData(sortedArticles, filterConfig);
        this.articleLength = sortedArticles.length;

        sortedArticles = sortedArticles.slice(skip, top);
        return sortedArticles;
    };

    this.getArticle = function (id) {
        var idArticleMass = articles.filter(function (obj) {
            if (obj.id == id) {
                return true;
            }
            return false;
        });
        if (!idArticleMass.length) {
            return false;
        }
        var idArticle = new Article(idArticleMass[0].id, idArticleMass[0].title, idArticleMass[0].summary,
            idArticleMass[0].createdAt, idArticleMass[0].author, idArticleMass[0].content, idArticleMass[0].teg);
        return idArticle;
    };

    this.addArticle = function (article) {
        if (!Article.validateArticle(article)) {
            return false;
        }
        articles.push(article);
        return true;
    };

    this.editArticle = function (id, article) {
        if (typeof id != 'string' || !id || !article) {
            return false;
        }
        var index = -1;
        for (var i = 0; i < articles.length; i++) {
            if (id === articles[i].id) {
                index = i;
                break;
            }
        }
        if (index < 0 || !Article.validateArticle(articles[index])) {
            return false;
        }
        if ((typeof article.title) == 'string' && article.title) {
            articles[index].title = article.title;
        }
        if ((typeof article.summary) == 'string' && article.summary) {
            articles[index].summary = article.summary;
        }
        if ((typeof article.content) == 'string' && article.content) {
            articles[index].content = article.content;
        }
        return true;
    };

    this.removeArticle = function (id) {
        var index = -1;
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].id == id) {
                index = i;
                break;
            }
        }
        if (index || index == 0) {
            articles.splice(index, 1);
        }
        if (index != -1) {
            return true;
        }
        return false;
    };

    function pasteTegs(index, teg) {
        var flagReturn = false;
        var flagDoubleTeg;
        if (typeof teg == 'string') {
            teg = [teg];

        }
        if (Array.isArray(teg)) {
            flagDoubleTeg = false;
            var j = 0;
            for (var i = 0; i < TEGS.length; i++) {
                if (TEGS[i] == teg[j]) {
                    for (var k = 0; k < articles[index].teg.length; k++) {
                        if (articles[index].teg[k] == teg[j]) {
                            flagDoubleTeg = true;
                            return false;
                        }
                    }
                    j++;
                    i = -1;
                }
            }
            if (j == teg.length) {
                teg.forEach(function (item) {
                    articles[index].teg.push(item);
                });
                return true;
            }
        }
        return false;
    };

    this.addTegs = function (id, teg) {
        var index;
        articles.forEach(function (item, i) {
            if (item.id == id) {
                index = i;
            }
        });
        if (!index || !teg) {
            return false;
        }
        if (pasteTegs(index, teg)) {
            return true;
        }
        return false;
    };

    this.removeTeg = function (id, teg) {
        var index;
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].id == id) {
                index = i;
                break;
            }
        }
        if (!index || articles[index].teg.length <= 1) {
            return false;
        }
        if (teg && typeof teg == 'string') {
            var flag = false;
            for (var i = 0; i < TEGS.length; i++) {
                if (TEGS[i] == teg) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                var indexTeg;
                for (var i = 0; i < articles[index].teg.length; i++) {
                    if (articles[index].teg[i] == teg) {
                        indexTeg = i;
                    }
                }
                articles[index].teg.splice(indexTeg, 1);
                return true;
            }
            return false;
        }
        return false;
    };

    this.replaceAllTegs = function (id, tegs) {
        var index;
        if (!(Array.isArray(tegs) && tegs.length != 0)) {
            return false;
        }

        for (var i = 0; i < articles.length; i++) {
            if (articles[i].id == id) {
                index = i;
                break;
            }
        }
        if (!index) {
            return false;
        }

        var vrem = articles[index].teg;
        articles[index].teg = [];
        if (!pasteTegs(id, tegs)) {
            articles[index].teg = vrem;
            return false;
        }
        return true;
    };
};

/*var newsModel = new NewsModel();*/

/*console.log("GET ARTICLES\n\n");

 console.log("getArticles():\n\n");
 console.log(newsModel.getArticles());

 console.log("getArticles(0,10):\n\n");
 console.log(newsModel.getArticles(0,10));

 console.log("getArticles(-3,10):\n\n");
 console.log(newsModel.getArticles(-3,10));

 console.log("getArticles(0,-3):\n\n");
 console.log(newsModel.getArticles(0,-3));

 console.log("getArticles({},10):\n\n");
 console.log(newsModel.getArticles({},10));

 console.log("getArticles({},{}):\n\n");
 console.log(newsModel.getArticles({},{}));

 console.log("getArticles('',10):\n\n");
 console.log(newsModel.getArticles('',10));

 console.log("getArticles('','aa'):\n\n");
 console.log(newsModel.getArticles('','aa'));

 console.log("getArticles(0,10,new FilterConfig('Иванов Иван')):\n\n");
 console.log(newsModel.getArticles(0,10,new FilterConfig('Иванов Иван')));

 console.log("getArticles(0,10,new FilterConfig(null,0,0,'teg1')):\n\n");
 console.log(newsModel.getArticles(0, 10, new FilterConfig(null, 0, 0, 'teg1')));

 console.log("getArticles(0,10,new FilterConfig(null,0,0,['teg1'])):\n\n");
 console.log(newsModel.getArticles(0, 10, new FilterConfig(null, 0, 0, ['teg1'])));

 console.log("getArticles(0,10,new FilterConfig('',0,new Date('2017-02-27T23:00:00'))):\n\n");
 console.log(newsModel.getArticles(0,10,new FilterConfig('',0,new Date('2017-02-27T23:00:00'))));

 console.log("getArticles(0,10,new FilterConfig('',new Date('2017-02-27T23:00:00'))):\n\n");
 console.log(newsModel.getArticles(0,10,new FilterConfig('',new Date('2017-02-27T23:00:00'))));

 console.log("getArticles(0,10,new FilterConfig('',0,new Date('2017-02-27T23:00:00'))):\n\n");
 console.log(newsModel.getArticles(0,10,new FilterConfig('',0,new Date('2017-02-27T23:00:00'))));

 console.log("getArticles(0,10,new FilterConfig('',new Date('2017-02-27T23:00:00'),new Date('2017-02-30T23:00:00'))):\n\n");
 console.log(newsModel.getArticles(0,10,new FilterConfig('',new Date('2017-02-27T23:00:00'),new Date('2017-02-30T23:00:00'))));

 console.log("getArticles(0,10,new FilterConfig(null,null,null)):\n\n");
 console.log(newsModel.getArticles(0, 10, new FilterConfig(null, null, null)));

 console.log("getArticles(0,10,new FilterConfig(null,{},{})):\n\n");
 console.log(newsModel.getArticles(0, 10, new FilterConfig(null, {}, {})));

 console.log("getArticles(0,10,new FilterConfig(null,0,0)):\n\n");
 console.log(newsModel.getArticles(0, 10, new FilterConfig(null, 0, 0)));*/
/*console.log("GET ARTICLE\n\n");

 console.log("getArticle('1')");
 console.log(NewsModel.getArticle('1'));

 console.log("getArticle('')");
 console.log(NewsModel.getArticle(''));

 console.log("getArticle(null)");
 console.log(NewsModel.getArticle(null));

 console.log("getArticle(0)");
 console.log(NewsModel.getArticle(0));

 console.log("getArticle('never')");
 console.log(NewsModel.getArticle('never'));

 console.log("getArticle(1)");
 console.log(NewsModel.getArticle(1));*/
/*console.log("VALIDATE ARTICLE \n\n");

 console.log("validateArticle()");
 console.log(Article.validateArticle());

 console.log("validateArticle({}))");
 console.log(Article.validateArticle({}));

 console.log("validateArticle(new Article('')");
 console.log(Article.validateArticle(new Article('')));

 console.log("validateArticle(new Article('1','title','summary',new Date(),'author','content',['teg']))");
 console.log(Article.validateArticle(new Article('1','title','summary',new Date(),'author','content',['teg'])));

 console.log("validateArticle(new Article('1','title','summary',new Date(),'author','content','teg'))");
 console.log(Article.validateArticle(new Article('1','title','summary',new Date(),'author','content','teg')));

 console.log("validateArticle(new Article('','title','summary',new Date(),'author','content',['teg']))");
 console.log(Article.validateArticle(new Article('','title','summary',new Date(),'author','content',['teg'])));

 console.log("validateArticle(new Article(null,'title','summary',new Date(),'author','content',['teg']))");
 console.log(Article.validateArticle(new Article(null,'title','summary',new Date(),'author','content',['teg'])));

 console.log("validateArticle(new Article({},'title','summary',new Date(),'author','content',['teg']))");
 console.log(Article.validateArticle(new Article({},'title','summary',new Date(),'author','content',['teg'])));

 console.log("validateArticle(new Article('1','title','summary',new Date(),'author','content',[]))");
 console.log(Article.validateArticle(new Article('1','title','summary',new Date(),'author','content',[])));

 console.log("validateArticle(new Article('1','title','summary',new Date(),'author','content',{}))");
 console.log(Article.validateArticle(new Article('1','title','summary',new Date(),'author','content',{})));

 console.log("validateArticle(new Article('1','title','summary',0,'author','content',['teg']))");
 console.log(Article.validateArticle(new Article('1','title','summary',0,'author','content',['teg'])));

 console.log("validateArticle(new Article('1','title','summary',1,'author','content',['teg']))");
 console.log(Article.validateArticle(new Article('1','title','summary',1,'author','content',['teg'])));

 console.log("validateArticle(new Article('1','title','summary','aaa','author','content',['teg']))");
 console.log(Article.validateArticle(new Article('1','title','summary','aaa','author','content',['teg'])));

 console.log("validateArticle(new Article('1','title','summary',{},'author','content',['teg']))");
 console.log(Article.validateArticle(new Article('1','title','summary',{},'author','content',['teg'])));*/
/*console.log("ADD ARTICLE");

 console.log("NewsModel.addArticle()");
 console.log(NewsModel.addArticle());

 console.log("addArticle(new Article())");
 console.log(NewsModel.addArticle(new Article()));

 console.log("addArticle({})");
 console.log(NewsModel.addArticle({}));

 console.log("addArticle('')");
 console.log(NewsModel.addArticle(''));

 console.log("addArticle(new Article('1','title','summary',new Date(),'author','content',['teg']))");
 console.log(NewsModel.addArticle(new Article('1','title','summary',new Date(),'author','content',['teg'])));

 console.log("addArticle(new Article('1','title','summary',new Date(),'author','content','teg'))");
 console.log(NewsModel.addArticle(new Article('1','title','summary',new Date(),'author','content','teg')));

 console.log("addArticle(new Article('','title','summary',new Date(),'author','content',['teg']))");
 console.log(NewsModel.addArticle(new Article('','title','summary',new Date(),'author','content',['teg'])));

 console.log("addArticle(new Article(null,'title','summary',new Date(),'author','content',['teg']))");
 console.log(NewsModel.addArticle(new Article(null,'title','summary',new Date(),'author','content',['teg'])));

 console.log("addArticle(new Article({},'title','summary',new Date(),'author','content',['teg']))");
 console.log(NewsModel.addArticle(new Article({},'title','summary',new Date(),'author','content',['teg'])));

 console.log("addArticle(new Article('1','title','summary',new Date(),'author','content',[]))");
 console.log(NewsModel.addArticle(new Article('1','title','summary',new Date(),'author','content',[])));

 console.log("addArticle(new Article('1','title','summary',new Date(),'author','content',{}))");
 console.log(NewsModel.addArticle(new Article('1','title','summary',new Date(),'author','content',{})));

 console.log("addArticle(new Article('1','title','summary',0,'author','content',['teg']))");
 console.log(NewsModel.addArticle(new Article('1','title','summary',0,'author','content',['teg'])));

 console.log("addArticle(new Article('1','title','summary',1,'author','content',['teg']))");
 console.log(NewsModel.addArticle(new Article('1','title','summary',1,'author','content',['teg'])));

 console.log("addArticle(new Article('1','title','summary','aaa','author','content',['teg']))");
 console.log(NewsModel.addArticle(new Article('1','title','summary','aaa','author','content',['teg'])));

 console.log("addArticle(new Article('1','title','summary',{},'author','content',['teg']))");
 console.log(NewsModel.addArticle(new Article('1','title','summary',{},'author','content',['teg'])));*/
/*console.log("EDIT ARTICLE");

 console.log("editArticle('1')");
 console.log(NewsModel.editArticle('1'));
 console.log('\n');

 console.log("editArticle('1',{})");
 console.log(NewsModel.editArticle('1',{}));
 console.log(NewsModel.getArticle('1'));
 console.log('\n');

 console.log("editArticle('1',new Article())");
 console.log(NewsModel.editArticle('1',new Article()));
 console.log(NewsModel.getArticle('1'));
 console.log('\n');

 console.log("editArticle('',{})");
 console.log(NewsModel.editArticle('',{}));

 console.log("editArticle(null,{})");
 console.log(NewsModel.editArticle(null,{}));

 console.log("editArticle({},{})");
 console.log(NewsModel.editArticle({},{}));
 console.log('\n');

 console.log("editArticle('1',{title:'title', summary:'summary', content:'content'})");
 console.log(NewsModel.editArticle('1',{title:'title', summary:'summary', content:'content'}));
 console.log(NewsModel.getArticle('1'));
 console.log('\n');

 console.log("editArticle('1',{title:'title', summary:'summary', content:'content', author:'newAuthor', createdAt:new Date(), id:'newId', teg:['teg2']})");
 console.log(NewsModel.editArticle('1',{title:'title', summary:'summary', content:'content', author:'newAuthor', createdAt:new Date(), id:'newId', teg:['teg2']}));
 console.log(NewsModel.getArticle('1'));
 console.log('\n');

 console.log("editArticle('1',new Article('id','title2','summary2',new Date(),'newAuthor','content2',['teg2']))");
 console.log(NewsModel.editArticle('1',new Article('id','title2','summary2',new Date(),'newAuthor','content2',['teg2'])));
 console.log(NewsModel.getArticle('1'));
 console.log('\n');


 console.log("editArticle('1',{title:'title', summary:'summary']})");
 console.log(NewsModel.editArticle('1',{title:'title', summary:'summary'}));
 console.log(NewsModel.getArticle('1'));
 console.log('\n');

 console.log("editArticle('1',{ summary:'summary2', content:'content'})");
 console.log(NewsModel.editArticle('1',{summary:'summary2', content:'content'}));
 console.log(NewsModel.getArticle('1'));
 console.log('\n');

 console.log("editArticle('1',{title:'title2', content:'content2'})");
 console.log(NewsModel.editArticle('1',{title:'title2', content:'content2'}));
 console.log(NewsModel.getArticle('1'));
 console.log('\n');

 console.log("editArticle('1',{title:'', summary:'summary', content:'content'})");
 console.log(NewsModel.editArticle('1',{title:'', summary:'summary', content:'content'}));
 console.log(NewsModel.getArticle('1'));
 console.log('\n');

 console.log("editArticle('1',{title:{}, summary:'summary', content:'content'})");
 console.log(NewsModel.editArticle('1',{title:{}, summary:'summary', content:'content'}));
 console.log(NewsModel.getArticle('1'));
 console.log('\n');

 console.log("editArticle('1',{title:1, summary:'summary', content:'content'})");
 console.log(NewsModel.editArticle('1',{title:1, summary:'summary', content:'content'}));
 console.log(NewsModel.getArticle('1'));
 console.log('\n');

 console.log("editArticle('1',{title:null, summary:'summary', content:'content'})");
 console.log(NewsModel.editArticle('1',{title:'title', summary:'summary', content:'content'}));
 console.log(NewsModel.getArticle('1'));
 console.log('\n');*/
/*console.log("REMOVE ARTICLE");
 console.log('\n');

 console.log("NewsModel.removeArticle('1')");
 console.log(NewsModel.removeArticle('1'));
 console.log(NewsModel.getArticles());
 console.log('\n');

 console.log("NewsModel.removeArticle('')");
 console.log(NewsModel.removeArticle(''));
 console.log(NewsModel.getArticles());
 console.log('\n');

 console.log("NewsModel.removeArticle('-1')");
 console.log(NewsModel.removeArticle('-1'));
 console.log(NewsModel.getArticles());
 console.log('\n');

 console.log("NewsModel.removeArticle({})");
 console.log(NewsModel.removeArticle({}));
 console.log(NewsModel.getArticles());
 console.log('\n');

 console.log("NewsModel.removeArticle(null)");
 console.log(NewsModel.removeArticle(null));
 console.log(NewsModel.getArticles());
 console.log('\n');

 console.log("NewsModel.removeArticle('aa')");
 console.log(NewsModel.removeArticle('aa'));
 console.log(NewsModel.getArticles());
 console.log('\n');*/
/*console.log("ADD TEG");
 console.log('\n');

 console.log("addTeg('2','teg3')");
 console.log(newsModel.addTegs('2', 'teg3'));
 console.log(newsModel.getArticles());
 console.log('\n');

 console.log("addTeg('2',['teg3'])");
 console.log(newsModel.addTegs('2', ['teg3']));
 console.log(newsModel.getArticles());
 console.log('\n');

 console.log("addTeg('2','teg3')");
 console.log(newsModel.addTegs('2', 'teg3'));
 console.log(newsModel.getArticles());
 console.log('\n');

 console.log("addTeg('2','')");
 console.log(newsModel.addTegs('2', ''));
 console.log(newsModel.getArticles());
 console.log('\n');

 console.log("addTeg('2',{})");
 console.log(newsModel.addTegs('2', {}));
 console.log(newsModel.getArticles());
 console.log('\n');

 console.log("addTeg('2',null)");
 console.log(newsModel.addTegs('2', null));
 console.log(newsModel.getArticles());
 console.log('\n');

 console.log("addTeg('2','tegNotFromTEGS')");
 console.log(newsModel.addTegs('2', 'tegNotFromTEGS'));
 console.log(newsModel.getArticles());
 console.log('\n');*/
/*
 console.log("REMOVE TEG");
 console.log('\n');

 console.log("addTeg('2',['teg3'])");
 console.log(NewsModel.addTeg('2', ['teg3']));
 console.log(NewsModel.getArticles());
 console.log('\n');

 console.log("removeTeg('2','teg3')");
 console.log(NewsModel.removeTeg('2', 'teg3'));
 console.log(NewsModel.getArticle('2'));
 console.log('\n');

 console.log("removeTeg('2',['teg3'])");
 console.log(NewsModel.removeTeg('2', ['teg3']));
 console.log(NewsModel.getArticle('2'));
 console.log('\n');

 console.log("removeTeg('2','')");
 console.log(NewsModel.removeTeg('2', ''));
 console.log(NewsModel.getArticle('2'));
 console.log('\n');

 console.log("removeTeg('2',{})");
 console.log(NewsModel.removeTeg('2', {}));
 console.log(NewsModel.getArticle('2'));
 console.log('\n');

 console.log("removeTeg('2',null)");
 console.log(NewsModel.removeTeg('2', null));
 console.log(NewsModel.getArticle('2'));
 console.log('\n');

 console.log("removeTeg('2',undefined)");
 console.log(NewsModel.removeTeg('2', undefined));
 console.log(NewsModel.getArticle('2'));
 console.log('\n');

 console.log("removeTeg('2',100)");
 console.log(NewsModel.removeTeg('2', 100));
 console.log(NewsModel.getArticle('2'));
 console.log('\n');

 console.log("removeTeg('2','newTeg')");
 console.log(NewsModel.removeTeg('2', 'newTeg'));
 console.log(NewsModel.getArticle('2'));
 console.log('\n');

 console.log("removeTeg('','teg3')");
 console.log(NewsModel.removeTeg('', 'teg3'));
 console.log('\n');

 console.log("removeTeg('1000','teg3')");
 console.log(NewsModel.removeTeg('1000', 'teg3'));
 console.log('\n');

 console.log("removeTeg(2,'teg3')");
 console.log(NewsModel.removeTeg(2, 'teg3'));
 console.log(NewsModel.getArticle('2'));
 console.log('\n');

 console.log("removeTeg(null,'teg3')");
 console.log(NewsModel.removeTeg(null, 'teg3'));
 console.log('\n');*/