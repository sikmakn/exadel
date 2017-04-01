/**
 * Created by Никита on 01.03.2017.
 */
"use strict";



/*CONTROLLER*/
var userInformation = function (login,password) {
    var login = login;
    var password = password;
    this.getLogin = function () {
        return login;
    };
    this.getPassword = function () {
        return password;
    };
};
var USERS = [new userInformation("sikmak","12345678")];
var USER = null;


var FILTER_CONFIG = null,
    INDEX_THIS_PAGE = 1;
//var NEWS_MODEL = new NewsModel();
var NEWS_VIEW = new NewsView();


function printArticles(articles) {
    var articles = articles||NEWS_MODEL.getArticles();
    NEWS_VIEW.printNewsList(articles);
    NEWS_VIEW.createPagination(0, NEWS_MODEL.articleLength);
};

/*function addArticle(newArticle) {
    if (NEWS_MODEL.addArticle(newArticle)) {
        NEWS_VIEW.addOneNews(newArticle);
        return true;
    }
    return false;

};
function editTegs(id, tegs) {
 if (typeof tegs == 'string') {
 tegs = tegs.split(',')
 }
 if (NEWS_MODEL.replaceAllTegs(id, tegs)) {
 NEWS_VIEW.editTegsNews(id, tegs);
 return true;
 }
 return false;
 }*/

function removeArticle(id) {
    if (NEWS_MODEL.removeArticle(id)) {
        NEWS_VIEW.removeNews(id);
        return true;
    }
    return false;

};

function editArticle(id, article) {
    if (NEWS_MODEL.editArticle(id, article)) {
        NEWS_VIEW.editNews(id, article);
        return true;
    }
    return false;
};

///////
downloadLocalStorageArticles();
unLogInUser();
//printArticles();
