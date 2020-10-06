/*
    This module will fetch news from the following news websites :
    1) AajTak

*/

//import modules 

const cheerio = require('cheerio');
const chalk = require('chalk');
// Selenium web driver configuration

const firefox =require('selenium-webdriver/firefox');
const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    promise=webdriver.promise;

promise.USE_PROMISE_MANAGER =false;
const screen = {
  width: 1280,
  height: 720
};

const driver = new webdriver.Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().windowSize(screen)).build();

//global array of articles
var saved_articles = [];

// fetchNewsAajTak
var articleno=0;


async function fetchAajTak_trending_links() {
  links=[]
  await driver.get('https://www.aajtak.in/trending');
  //await driver.findElement(By.id("load_more")).click();
  html = await driver.getPageSource();
   $ = cheerio.load(html);
 
$('.manoranjan-widget li a').each((i,elem)=>{
 // pagetofetch.push(elem.attribs.href);
  url=elem.attribs.href;
  links.push(url);
});
 
// console.log(links);
 return links;
}





async function fetchNewsAajTak(links){
  
  //await driver.findElement(By.id("load_more")).click();
  console.log("lets grab :"+links.length+" articles");
      html_article=[]
     for(var  i=0;i<links.length;i++){
      console.log("fetching  article "+i);
         await driver.get(links[i]);
          html=await driver.getPageSource();

          saved_articles.push(helper(html));
      }

     return saved_articles;
     
}




 function helper(html){
    $ = require('cheerio').load(html);
    var news_title = $('.photo-Detail-LHS-Heading > h1').text();
    var news_body =  "";
    $('.photo-detail-text > p').each(function(){
        news_body += $(this).text()+"<br>";
    });
    var constructedArticle = {
        title : news_title,
        body : news_body,
        date : new Date()
    }
    return constructedArticle;
};

async function printArticles(articles){
    console.log("Print function called.");
    console.log("length of saved articles :"+articles.length);
    articles.forEach((article)=>{
        console.log("******************");
        console.log(article.title + "\n" + article.body.substring(0,article.body.indexOf('<br>')));
        console.log("******************");
        
    });
}

// fetchNewsAajTak().then((articles)=>{

// printArticles(articles);
// })

fetchAajTak_trending_links()
    .then((links)=>{
          fetchNewsAajTak(links)
            .then((articles)=>{
                 printArticles(articles);
            });
      });
    
   