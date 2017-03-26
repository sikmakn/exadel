
function downloadLocalStorageArticles() {
    var articlesString = localStorage.getItem("articles");
    if(articlesString){
        var articlesMass = JSON.parse(articlesString,function (key, value) {
            if(key == "createdAt"){
                return new Date(value);
            }
            return value;
        });
        NEWS_MODEL.setArticles(articlesMass);
    }
};

function unloadLocalStorageArticles() {
    var articlesMass = NEWS_MODEL.getAllArticles(),
        articlesJSONString = JSON.stringify(articlesMass);
    localStorage.setItem("articles",articlesJSONString);
}
