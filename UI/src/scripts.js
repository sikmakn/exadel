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
        var string = "id:" + this.id + " title: " + this.title + " summary:" + summary +
            " createdAt: " + this.createdAt + " author:" + author + " content:" + content + " teg:" + teg + "\n";
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
function FilterConfig(author, dataBegin, dataEnd) {
    this.author = author;
    this.dataBegin = dataBegin;
    this.dataEnd = dataEnd;
}
var TEGS = ["teg1", "teg2", "teg3", "teg4", "teg5", "teg6", "teg7", "teg8", "teg9"];
function News() {
    var articles = [new Article('1',
        'Минское «Динамо» обыграло ярославский «Локомотив»',
        'Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2',
        new Date('2017-02-27T23:00:00'),
        'Иванов Иван',
        'Гости создали больше опасных моментов и в два раза перебросали минчан,' +
        ' но «зубры» на этот раз очень эффективно использовали свои моменты.',
        "teg1"
    ),
        new Article('2',
            'Как казахстанцы исполнили мечту бедуина',
            'Эта история о приключении казахстанцев,человеческой доброте и о том, как сбылась мечта человека из далекой пустыни на границе Индии с Пакистаном.',
            new Date('2017-02-28T23:00:00'),
            'Иванов2 Иван2',
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
            'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'
            , "teg2"),
        new Article(
            '3',
            'Кто имеет право на отсрочку от армии в Казахстане',
            'Редакция Tengrinews.kz разъясняет, кто может не отдавать долг родине.',
            new Date('2017-02-29T23:00:00'),
            'Иванов3 Иван3',
            '3Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ' +
            'industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'
            , "teg3"),
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
            , "teg4"),
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
            , "teg5"),
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
            , "teg6"),
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
            , "teg7"),
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
            , "teg8"),
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
            , "teg9")
    ];

    function compareData(first, second) {
        return first.createdAt - second.createdAt;
    }

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
        if (filterConfig.author && filterConfig.author instanceof String) {
            sortedArticles = articles.filter(function (obj) {
                if (obj.author == filterConfig.author) {
                    return true;
                }
                return false;
            });
        }
        if (filterConfig.teg && Array.isArray(filterConfig.teg)) {
            for (var j = 0; j < obj.teg.length; j++) {
                for (var i = 0; i < filterConfig.teg.length; i++) {
                    sortedArticles = articles.filter(function (obj) {
                        if (obj.teg[i] == filterConfig.teg[j]) {
                            return true;
                        }
                        return false;
                    });
                }
            }

        }
        if ((filterConfig.dataBegin || filterConfig.dataEnd)) {
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
        if (typeof id != 'string' || !id) {
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
        var index;
        articles.forEach(function (item, i) {
            if (item.id == id) {
                index = i;
            }
        });
        articles.splice(index, 1);
        if (index) {
            return true;
        }
        return false;
    };

    this.addTeg = function (id, teg) {
        var index;
        articles.forEach(function (item, i) {
            if (item.id == id) {
                index = i;
            }
        });
        if (!index) {
            return false;
        }
        if (teg && typeof teg == 'string') {
            var flag = false;
            TEGS.forEach(function (item) {
                if (item.teg == teg) {
                    flag = true;
                }
            });
            if (flag) {
                articles[index].teg.push(teg);
                return true;
            }
            return false;
        }
        return false;
    }

    this.removeTeg = function (id, teg) {
        var index;
        articles.forEach(function (item, i) {
            if (item.id == id) {
                index = i;
            }
        });
        if (!index && articles[index].teg.length <= 1) {
            return false;
        }
        if (teg && typeof teg == 'string') {
            var flag = false;
            TEGS.forEach(function (item) {
                if (item.teg == teg) {
                    flag = true;
                }
            });
            if (flag) {
                var indexTeg;
                articles[index].teg.forEach(function (item, i) {
                    if (item == teg) {
                        indexTeg = i;
                    }
                });
                articles[index].teg.splice(indexTeg, 1);
                return true;
            }
            return false;
        }
        return false;
    }
}

var news = new News();
