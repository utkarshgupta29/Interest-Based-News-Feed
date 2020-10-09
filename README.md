# Interest Based News Feed


# Mongodb Schema
  Articles {
           _id:
           url:
           title:
           thumbnail:
           date:
           websiteName:
           category:
           subcategory:
           keywords:
           }
           
   toScrap {
           _id:
           url:
           category:
           subcategory:
           websiteName:
           date:
           }
   keyword_idexing {
                    _id:
                    keyword:
                    articles: [_id from Articles]
                   }
                   
 # Web Scraper
    
      main.js  
      websites/ 
             aajtak.js
             jagran.js
             theHindu.js
             ani.js
             beebom.js
             
   # Modules structure
      
      website module ( aajtak.js )
        CATEGORY[]  //list of available categories
        getTrending() --> [{title,url,date,thumbnail}]
        getArticle(link) --> {title,image,date,body{paragraph1,paragraph2,..}}
        getByCategory(category) --> [{title,url,date,thumbnail}]
        search(keyword) --> [{title,url,date,thumbnail}]
        getLatest() --> [{title,url,date,thumbnail}]
        
     main.js
        startTimer()
        //TODO Later
      
  # Frontend
      
      app.js
      public/
          css
          js
          img
      views/
          home.ejs
          login.ejs
          signup.ejs
          preference.ejs
          subscription.ejs
      schema/
          articles.js
          toScrap.js
          users.js
          

  
   
