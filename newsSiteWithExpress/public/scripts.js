/**
 * Created by Никита on 01.03.2017.
 */


/* CONTROLLER*/

let USER = null;

let FILTER_CONFIG = {};
let INDEX_THIS_PAGE = 1;
let ARTICLE_AMOUNT;

const ORIGINAL_DATA_EDITING_NEWS = [];
const NEWS_VIEW = new NewsView();

unLogInUser();
printArticles();
