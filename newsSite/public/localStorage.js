
function downloadLocalStorageArticles() {
   /* var articlesString = localStorage.getItem("articles");
    if(articlesString){
        var articlesMass = JSON.parse(articlesString,function (key, value) {
            if(key == "createdAt"){
                return new Date(value);
            }
            return value;
        });
        NEWS_MODEL.setArticles(articlesMass);
    }*/
   var xhrFirstArticles = new XMLHttpRequest();
   var firstArticles;
   function handler() {
       firstArticles = JSON.parse(xhrFirstArticles.responseText,function (key, value) {
           if(key == "createdAt"){
               return new Date(value);
           }
           return value;
       });
       xhrFirstArticles.removeEventListener('load', handler);
       printArticles(firstArticles);
   };
   xhrFirstArticles.addEventListener('load', handler);
   xhrFirstArticles.open('GET','/');
   xhrFirstArticles.send();
};

