# Interest Based News Feed


# Mongodb Schema
  Articles {
           _id:
           url:
           title:
           body:
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
        fetchArticle(link) --> {title,image,date,body{paragraph1,paragraph2,..}}
        getByCategory(category,subcategory(optional)) --> [{title,url,date,thumbnail}]
        search(keyword) --> [{title,url,date,thumbnail}]
        getLatest() --> [{title,url,date,thumbnail}]
        
     main.js
        startTimer()
        
        getByCategory(website,category,subcategory) --> [{title,url,date,thumbnail}]
        
        getLatest(website) --> [{title,url,date,thumbnail}]
             update database - toScrap with latest article links
             
        getArticle({url,website,category,subcategory})  --> {title,image,date,body{paragraph1,paragraph2,..}}   
        
        customsearch(keyword,website) -->  [{title,url,date,thumbnail}]       
              -if checkCache(keyword)       //check if keyword already indexed
                  return 
               else return searchWeb(keyword,website)    //time to search on website
               
        checkCache(keyword) --> [_id]   
               - search in keyword-indexing in monogodb
               - fast searching algo and check in saved articles     // not good idea maybe, will remove if required
               
        searchWeb() --> [{title,url,date,thumbnail}]
        
        saveArticle({title,image,date,body{paragraph1,paragraph2,..}} )  --> boolean
               find keyword from aricle and add them as tag
               
        timerGetLatest(website,delay)   //auto recall after period of time
        timerGetArticle(website,delay)
      
  # WEB
      
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
          
   # Routes
    TYPE                ROUTE               VIEW                  FUNCTION                
    GET                 /                   home.ejs              home page render
    GET                 /login              login.ejs             login page  render
    POST                /login                                    login request
    GET                 /signup             signup.ejs            signup page render
    POST                /signup                                   signup request
    
    
   

  
   
