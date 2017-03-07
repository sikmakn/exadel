/**
 * Created by Никита on 01.03.2017.
 */
"use strict";
function Article(id, title, summary, createdAt, author, content, teg) {
    this.id = id;
    this.title = title;
    this.summary = summary;
    this.createdAt = createdAt;
    this.author = author;
    this.content = content;
    this.teg = teg;
    Article.prototype.toString = function () {
        var string = "ID:" + this.id + " ACREATEDaT: " + this.createdAt +
            " TITLE: " + this.title + " SUMMARY:" + this.summary +
            " AUTHOR:" + this.author + " CONTENT:" + this.content + " TEG:" + this.teg + "\n\n";
        return string;
    }
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
    }
}
function FilterConfig(author, dataBegin, dataEnd, teg) {
    this.author = author;
    this.dataBegin = dataBegin;
    this.dataEnd = dataEnd;
    this.teg = teg;
}
var TEGS = ["teg1", "teg2", "teg3", "teg4", "teg5", "teg6", "teg7", "teg8", "teg9"];
function News() {
    var articles = [
        new Article('1',
            'Минское «Динамо» обыграло ярославский «Локомотив»',
            'Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2',
            new Date('2017-02-27T23:00:00'),
            'Иванов Иван',
            'Гости создали больше опасных моментов и в два раза перебросали минчан,' +
            ' но «зубры» на этот раз очень эффективно использовали свои моменты.',
            ["teg1"]
        ),
        new Article('2',
            'Как казахстанцы исполнили мечту бедуина',
            'Эта история о приключении казахстанцев,человеческой доброте и о том, как сбылась мечта человека из далекой пустыни на границе Индии с Пакистаном.',
            new Date('2017-02-28T23:00:00'),
            'Иванов2 Иван2',
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
            'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'
            , ["teg2"]
        ),
        new Article(
            '3',
            'Кто имеет право на отсрочку от армии в Казахстане',
            'Редакция Tengrinews.kz разъясняет, кто может не отдавать долг родине.',
            new Date('2017-02-29T23:00:00'),
            'Иванов3 Иван3',
            '3Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
            'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'
            , ["teg3"]
        ),
        new Article(
            '4',
            'Препарируя любовь. Психологи о главном чувстве',
            '14 февраля многие отмечают День влюбленных,' +
            'и это еще один повод проявить свои чувства к любимым,' +
            'а также поговорить о чувстве любви - великом даре или великом мифе.',
            new Date('2017-02-30T23:00:00'),
            'Иванов4 Иван4',
            '4Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
            'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'
            , ["teg4"]
        ),
        new Article(
            '5',
            '5Препарируя любовь. Психологи о главном чувстве',
            '5 14 февраля многие отмечают День влюбленных,' +
            'и это еще один повод проявить свои чувства к любимым,' +
            'а также поговорить о чувстве любви - великом даре или великом мифе.',
            new Date('2017-02-30T23:00:00'),
            'Иванов5 Иван5',
            '5Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
            'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley ' +
            'of type and scrambled it to make a type specimen book.'
            , ["teg5"]
        ),
        new Article(
            '6',
            '6 Препарируя любовь. Психологи о главном чувстве',
            '614 февраля многие отмечают День влюбленных,' +
            'и это еще один повод проявить свои чувства к любимым,' +
            'а также поговорить о чувстве любви - великом даре или великом мифе.',
            new Date('2017-02-31T23:00:00'),
            'Иванов6 Иван6',
            '6Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
            'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'
            , ["teg6"]
        ),
        new Article(
            '7',
            '7 Препарируя любовь. Психологи о главном чувстве',
            '7 14 февраля многие отмечают День влюбленных,' +
            'и это еще один повод проявить свои чувства к любимым,' +
            'а также поговорить о чувстве любви - великом даре или великом мифе.',
            new Date('2017-03-04T23:00:00'),
            'Иванов7 Иван7',
            '7 Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
            'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'
            , ["teg7"]
        ),
        new Article(
            '8',
            '8 Препарируя любовь. Психологи о главном чувстве',
            '8 14 февраля многие отмечают День влюбленных,' +
            'и это еще один повод проявить свои чувства к любимым,' +
            'а также поговорить о чувстве любви - великом даре или великом мифе.',
            new Date('2017-02-14T23:00:00'),
            'Иванов8 Иван8',
            '8Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
            'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'
            , ["teg8"]
        ),
        new Article(
            '9',
            '9 Препарируя любовь. Психологи о главном чувстве',
            '9 14 февраля многие отмечают День влюбленных,' +
            'и это еще один повод проявить свои чувства к любимым,' +
            'а также поговорить о чувстве любви - великом даре или великом мифе.',
            new Date('2017-02-30T23:00:00'),
            'Иванов9 Иван9',
            '9Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
            'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'
            , ["teg9"]
        )
    ];

    function compareData(first, second) {
        return first.createdAt - second.createdAt;
    };

    this.getArticles = function (skip, top, filterConfig) {
        skip = skip || 0;
        if ((top instanceof Object) || (typeof top == "string")) {
            top = 10;
        }
        if (filterConfig && filterConfig instanceof FilterConfig) {
            filterConfig = filterConfig;
        } else {
            filterConfig = new FilterConfig("", 0, 0);
        }

        articles.sort(compareData);
        var sortedArticles = articles;
        if (filterConfig.author && typeof filterConfig.author == 'string') {
            sortedArticles = articles.filter(function (obj) {
                if (obj.author == filterConfig.author) {
                    return true;
                }
                return false;
            });
        }
        if (filterConfig.teg) {
            if (Array.isArray(filterConfig.teg)) {
                for (var j = 0; j < filterConfig.teg.length; j++) {
                    sortedArticles = articles.filter(function (obj) {
                        for (var i = 0; i < obj.teg.length; i++) {
                            if (obj.teg[i] == filterConfig.teg[j]) {
                                return true;
                            }
                        }
                        return false;
                    });
                }
            }

            if (typeof filterConfig.teg == 'string') {
                sortedArticles = articles.filter(function (obj) {
                    if (obj.teg == filterConfig.teg) {
                        return true;
                    }
                    return false;
                });
            }
        }
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
        var idArticle = idArticleMass[0];
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
        var index;
        articles.forEach(function (item, i) {
            if (item.id == id) {
                index = i;
            }
        });
        if (index && !Article.validateArticle(articles[index])) {
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
        var index = undefined;
        articles.forEach(function (item, i) {
            if (item.id == id) {
                index = i;
            }
        });
        if (index || index == 0) {
            articles.splice(index, 1);
        }
        if (index) {
            return true;
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
        if (typeof teg == 'string') {
            var flagReturn = false;
            var flagDoubleTeg;
            for (var i = 0; i < TEGS.length; i++) {
                if (TEGS[i] == teg) {
                    flagDoubleTeg = true;
                    for (var k = 0; k < articles[index].teg.length; k++) {
                        if (articles[index].teg[k] == teg) {
                            flagDoubleTeg = false;
                            break;
                        }
                    }
                    if (flagDoubleTeg) {
                        articles[index].teg.push(teg);
                        flagReturn = true;
                    }
                    break;
                }
            }
            if (flagReturn) {
                return true;
            }
        } else if (Array.isArray(teg)) {
            var flagReturn = false;
            var flagDoubleTeg;
            var j = 0;
            for (var i = 0; i < TEGS.length; i++) {
                if (TEGS[i] == teg[j]) {
                    flagDoubleTeg = true;
                    for (var k = 0; k < articles[index].teg.length; k++) {
                        if (articles[index].teg[k] == teg[j]) {
                            flagDoubleTeg = false;
                            break;
                        }
                    }
                    if (flagDoubleTeg) {
                        articles[index].teg.push(teg[j]);
                        flagReturn = true;
                    }
                    j++;
                    i = -1;
                }
            }
            if (flagReturn) {
                return true;
            }
        }
        return false;
    };

    this.removeTeg = function (id, teg) {
        var index;
        for(var i = 0; i< articles.length; i++){
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
            for(var i = 0; i< TEGS.length; i++){
                if (TEGS[i] == teg) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                var indexTeg;
                for(var i = 0; i< articles[index].teg.length; i++){
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
}

var news = new News();
/*
 console.log("GET ARTICLES\n\n");

 console.log("getArticles():\n\n");
 console.log(news.getArticles());

 console.log("getArticles(0,10):\n\n");
 console.log(news.getArticles(0,10));

 console.log("getArticles(-3,10):\n\n");
 console.log(news.getArticles(-3,10));

 console.log("getArticles(0,-3):\n\n");
 console.log(news.getArticles(0,-3));

 console.log("getArticles({},10):\n\n");
 console.log(news.getArticles({},10));

 console.log("getArticles({},{}):\n\n");
 console.log(news.getArticles({},{}));

 console.log("getArticles('',10):\n\n");
 console.log(news.getArticles('',10));

 console.log("getArticles('','aa'):\n\n");
 console.log(news.getArticles('','aa'));

 console.log("getArticles(0,10,new FilterConfig('Иванов Иван')):\n\n");
 console.log(news.getArticles(0,10,new FilterConfig('Иванов Иван')));

 console.log("getArticles(0,10,new FilterConfig(null,0,0,'teg1')):\n\n");
 console.log(news.getArticles(0, 10, new FilterConfig(null, 0, 0, 'teg1')));

 console.log("getArticles(0,10,new FilterConfig(null,0,0,['teg1'])):\n\n");
 console.log(news.getArticles(0, 10, new FilterConfig(null, 0, 0, ['teg1'])));

 console.log("getArticles(0,10,new FilterConfig('',0,new Date('2017-02-27T23:00:00'))):\n\n");
 console.log(news.getArticles(0,10,new FilterConfig('',0,new Date('2017-02-27T23:00:00'))));

 console.log("getArticles(0,10,new FilterConfig('',new Date('2017-02-27T23:00:00'))):\n\n");
 console.log(news.getArticles(0,10,new FilterConfig('',new Date('2017-02-27T23:00:00'))));

 console.log("getArticles(0,10,new FilterConfig('',0,new Date('2017-02-27T23:00:00'))):\n\n");
 console.log(news.getArticles(0,10,new FilterConfig('',0,new Date('2017-02-27T23:00:00'))));

 console.log("getArticles(0,10,new FilterConfig('',new Date('2017-02-27T23:00:00'),new Date('2017-02-30T23:00:00'))):\n\n");
 console.log(news.getArticles(0,10,new FilterConfig('',new Date('2017-02-27T23:00:00'),new Date('2017-02-30T23:00:00'))));

 console.log("getArticles(0,10,new FilterConfig(null,null,null)):\n\n");
 console.log(news.getArticles(0, 10, new FilterConfig(null, null, null)));

 console.log("getArticles(0,10,new FilterConfig(null,{},{})):\n\n");
 console.log(news.getArticles(0, 10, new FilterConfig(null, {}, {})));

 console.log("getArticles(0,10,new FilterConfig(null,0,0)):\n\n");
 console.log(news.getArticles(0, 10, new FilterConfig(null, 0, 0)));
 */

/*console.log("GET ARTICLE\n\n");

 console.log("getArticle('1')");
 console.log(news.getArticle('1'));

 console.log("getArticle('')");
 console.log(news.getArticle(''));

 console.log("getArticle(null)");
 console.log(news.getArticle(null));

 console.log("getArticle(0)");
 console.log(news.getArticle(0));

 console.log("getArticle('never')");
 console.log(news.getArticle('never'));

 console.log("getArticle(1)");
 console.log(news.getArticle(1));*/

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

 console.log("news.addArticle()");
 console.log(news.addArticle());

 console.log("addArticle(new Article())");
 console.log(news.addArticle(new Article()));

 console.log("addArticle({})");
 console.log(news.addArticle({}));

 console.log("addArticle('')");
 console.log(news.addArticle(''));

 console.log("addArticle(new Article('1','title','summary',new Date(),'author','content',['teg']))");
 console.log(news.addArticle(new Article('1','title','summary',new Date(),'author','content',['teg'])));

 console.log("addArticle(new Article('1','title','summary',new Date(),'author','content','teg'))");
 console.log(news.addArticle(new Article('1','title','summary',new Date(),'author','content','teg')));

 console.log("addArticle(new Article('','title','summary',new Date(),'author','content',['teg']))");
 console.log(news.addArticle(new Article('','title','summary',new Date(),'author','content',['teg'])));

 console.log("addArticle(new Article(null,'title','summary',new Date(),'author','content',['teg']))");
 console.log(news.addArticle(new Article(null,'title','summary',new Date(),'author','content',['teg'])));

 console.log("addArticle(new Article({},'title','summary',new Date(),'author','content',['teg']))");
 console.log(news.addArticle(new Article({},'title','summary',new Date(),'author','content',['teg'])));

 console.log("addArticle(new Article('1','title','summary',new Date(),'author','content',[]))");
 console.log(news.addArticle(new Article('1','title','summary',new Date(),'author','content',[])));

 console.log("addArticle(new Article('1','title','summary',new Date(),'author','content',{}))");
 console.log(news.addArticle(new Article('1','title','summary',new Date(),'author','content',{})));

 console.log("addArticle(new Article('1','title','summary',0,'author','content',['teg']))");
 console.log(news.addArticle(new Article('1','title','summary',0,'author','content',['teg'])));

 console.log("addArticle(new Article('1','title','summary',1,'author','content',['teg']))");
 console.log(news.addArticle(new Article('1','title','summary',1,'author','content',['teg'])));

 console.log("addArticle(new Article('1','title','summary','aaa','author','content',['teg']))");
 console.log(news.addArticle(new Article('1','title','summary','aaa','author','content',['teg'])));

 console.log("addArticle(new Article('1','title','summary',{},'author','content',['teg']))");
 console.log(news.addArticle(new Article('1','title','summary',{},'author','content',['teg'])));*/

/*console.log("EDIT ARTICLE");

 console.log("editArticle('1')");
 console.log(news.editArticle('1'));
 console.log('\n');

 console.log("editArticle('1',{})");
 console.log(news.editArticle('1',{}));
 console.log(news.getArticle('1'));
 console.log('\n');

 console.log("editArticle('1',new Article())");
 console.log(news.editArticle('1',new Article()));
 console.log(news.getArticle('1'));
 console.log('\n');

 console.log("editArticle('',{})");
 console.log(news.editArticle('',{}));

 console.log("editArticle(null,{})");
 console.log(news.editArticle(null,{}));

 console.log("editArticle({},{})");
 console.log(news.editArticle({},{}));
 console.log('\n');

 console.log("editArticle('1',{title:'title', summary:'summary', content:'content'})");
 console.log(news.editArticle('1',{title:'title', summary:'summary', content:'content'}));
 console.log(news.getArticle('1'));
 console.log('\n');

 console.log("editArticle('1',{title:'title', summary:'summary', content:'content', author:'newAuthor', createdAt:new Date(), id:'newId', teg:['teg2']})");
 console.log(news.editArticle('1',{title:'title', summary:'summary', content:'content', author:'newAuthor', createdAt:new Date(), id:'newId', teg:['teg2']}));
 console.log(news.getArticle('1'));
 console.log('\n');

 console.log("editArticle('1',new Article('id','title2','summary2',new Date(),'newAuthor','content2',['teg2']))");
 console.log(news.editArticle('1',new Article('id','title2','summary2',new Date(),'newAuthor','content2',['teg2'])));
 console.log(news.getArticle('1'));
 console.log('\n');


 console.log("editArticle('1',{title:'title', summary:'summary']})");
 console.log(news.editArticle('1',{title:'title', summary:'summary'}));
 console.log(news.getArticle('1'));
 console.log('\n');

 console.log("editArticle('1',{ summary:'summary2', content:'content'})");
 console.log(news.editArticle('1',{summary:'summary2', content:'content'}));
 console.log(news.getArticle('1'));
 console.log('\n');

 console.log("editArticle('1',{title:'title2', content:'content2'})");
 console.log(news.editArticle('1',{title:'title2', content:'content2'}));
 console.log(news.getArticle('1'));
 console.log('\n');

 console.log("editArticle('1',{title:'', summary:'summary', content:'content'})");
 console.log(news.editArticle('1',{title:'', summary:'summary', content:'content'}));
 console.log(news.getArticle('1'));
 console.log('\n');

 console.log("editArticle('1',{title:{}, summary:'summary', content:'content'})");
 console.log(news.editArticle('1',{title:{}, summary:'summary', content:'content'}));
 console.log(news.getArticle('1'));
 console.log('\n');

 console.log("editArticle('1',{title:1, summary:'summary', content:'content'})");
 console.log(news.editArticle('1',{title:1, summary:'summary', content:'content'}));
 console.log(news.getArticle('1'));
 console.log('\n');

 console.log("editArticle('1',{title:null, summary:'summary', content:'content'})");
 console.log(news.editArticle('1',{title:'title', summary:'summary', content:'content'}));
 console.log(news.getArticle('1'));
 console.log('\n');*/

/*console.log("REMOVE ARTICLE");
 console.log('\n');

 console.log("news.removeArticle('1')");
 console.log(news.removeArticle('1'));
 console.log(news.getArticles());
 console.log('\n');

 console.log("news.removeArticle('')");
 console.log(news.removeArticle(''));
 console.log(news.getArticles());
 console.log('\n');

 console.log("news.removeArticle('-1')");
 console.log(news.removeArticle('-1'));
 console.log(news.getArticles());
 console.log('\n');

 console.log("news.removeArticle({})");
 console.log(news.removeArticle({}));
 console.log(news.getArticles());
 console.log('\n');

 console.log("news.removeArticle(null)");
 console.log(news.removeArticle(null));
 console.log(news.getArticles());
 console.log('\n');

 console.log("news.removeArticle('aa')");
 console.log(news.removeArticle('aa'));
 console.log(news.getArticles());
 console.log('\n');*/

/*console.log("ADD TEG");
console.log('\n');

console.log("addTeg('2','teg3')");
console.log(news.addTegs('2', 'teg3'));
console.log(news.getArticles());
console.log('\n');

console.log("addTeg('2',['teg3'])");
console.log(news.addTegs('2', ['teg3']));
console.log(news.getArticles());
console.log('\n');

console.log("addTeg('2','teg3')");
console.log(news.addTegs('2', 'teg3'));
console.log(news.getArticles());
console.log('\n');

console.log("addTeg('2','')");
console.log(news.addTegs('2', ''));
console.log(news.getArticles());
console.log('\n');

console.log("addTeg('2',{})");
console.log(news.addTegs('2', {}));
console.log(news.getArticles());
console.log('\n');

console.log("addTeg('2',null)");
console.log(news.addTegs('2', null));
console.log(news.getArticles());
console.log('\n');

console.log("addTeg('2','tegNotFromTEGS')");
console.log(news.addTegs('2', 'tegNotFromTEGS'));
console.log(news.getArticles());
console.log('\n');*/

console.log("REMOVE TEG");
console.log('\n');

console.log("addTeg('2',['teg3'])");
console.log(news.addTegs('2', ['teg3']));
console.log(news.getArticles());
console.log('\n');

console.log("removeTeg('2','teg3')");
console.log(news.removeTeg('2','teg3'));
console.log(news.getArticle('2'));
console.log('\n');

console.log("removeTeg('2',['teg3'])");
console.log(news.removeTeg('2',['teg3']));
console.log(news.getArticle('2'));
console.log('\n');

console.log("removeTeg('2','')");
console.log(news.removeTeg('2',''));
console.log(news.getArticle('2'));
console.log('\n');

console.log("removeTeg('2',{})");
console.log(news.removeTeg('2',{}));
console.log(news.getArticle('2'));
console.log('\n');

console.log("removeTeg('2',null)");
console.log(news.removeTeg('2',null));
console.log(news.getArticle('2'));
console.log('\n');

console.log("removeTeg('2',undefined)");
console.log(news.removeTeg('2',undefined));
console.log(news.getArticle('2'));
console.log('\n');

console.log("removeTeg('2',100)");
console.log(news.removeTeg('2',100));
console.log(news.getArticle('2'));
console.log('\n');

console.log("removeTeg('2','newTeg')");
console.log(news.removeTeg('2','newTeg'));
console.log(news.getArticle('2'));
console.log('\n');

console.log("removeTeg('','teg3')");
console.log(news.removeTeg('','teg3'));
console.log('\n');

console.log("removeTeg('1000','teg3')");
console.log(news.removeTeg('1000','teg3'));
console.log('\n');

console.log("removeTeg(2,'teg3')");
console.log(news.removeTeg(2,'teg3'));
console.log(news.getArticle('2'));
console.log('\n');

console.log("removeTeg(null,'teg3')");
console.log(news.removeTeg(null,'teg3'));
console.log('\n');