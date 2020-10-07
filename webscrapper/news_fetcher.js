/*
    This module will fetch news from the following news websites :
    1) AajTak
    2) Beebom
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

          saved_articles.push(helperAajTak(html));
      }

     return saved_articles;
     
}

function helperAajTak(html){
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

/*fetchAajTak_trending_links()
    .then((links)=>{
          fetchNewsAajTak(links)
            .then((articles)=>{
                 printArticles(articles);
            });
      });   
*/

//  Beebom Section : 

async function fetchBeeBom_trending_links() {
    var links=[]
    await driver.get('https://beebom.com/category/news/');
    //await driver.findElement(By.id("load_more")).click();
    html = await driver.getPageSource();
    $ = cheerio.load(html);
    $('.bee-list > div > a').each((i,elem)=>{
        url=elem.attribs.href;
        links.push(url);
    });
    return links;
}

async function fetchNewsBeeBom(links){
    var tech_articles = [];
    //await driver.findElement(By.id("load_more")).click();
    console.log("lets grab :"+links.length+" articles");
    html_article=[]
    for(var  i=0;i<links.length;i++){
        console.log("fetching  article "+i);
        await driver.get(links[i]);
        html=await driver.getPageSource();
        tech_articles.push(helperBeeBom(html));
    }
  
    return tech_articles;
       
}
function helperBeeBom(html){
    $ = require('cheerio').load(html);
    var news_title = $('.entry-title').text();
    var last_modified = $('.the-modified-date > .updated').text();
    var news_body =  "";
    $('.td-post-content > p').each(function(){
        news_body += $(this).text()+"<br>";
    });
    var constructedArticle = {
        title : news_title,
        body : news_body,
        date : last_modified
    };
    return constructedArticle;
};



/*fetchBeeBom_trending_links().then((links)=>{
    fetchNewsBeeBom(links).then((articles)=>{
        printArticles(articles);
    })
})*/

// Time of India Latest News Section

async function fetchTOI_trending_links() {
    var links=[]
    await driver.get('https://timesofindia.indiatimes.com/news');
    //await driver.findElement(By.id("load_more")).click();
    html = await driver.getPageSource();
    $ = cheerio.load(html);
    $('.main-content .w_tle > a').each((i,elem)=>{
        url="https://timesofindia.indiatimes.com/"+elem.attribs.href;
        links.push(url);
    });
    return links;
}

async function fetchNewsTOI(links){ 
    var saved_articles = [];
    //await driver.findElement(By.id("load_more")).click();
    console.log("lets grab :"+links.length+" articles");
    for(var  i=0;i<links.length;i++){
        console.log("fetching  article "+i);
        await driver.get(links[i]);
        html=await driver.getPageSource();
        saved_articles.push(helperTOI(html));
    }
  
    return saved_articles;
       
}

function helperTOI(html){
    $ = require('cheerio').load(html);
    var news_title = $('._23498').text();
    var last_modified = $('._3Mkg-.byline').text();
    var news_body =  $('.ga-headlines').clone().children().remove('.mgbox').end().text();
    
    var constructedArticle = {
        title : news_title,
        body : news_body,
        date : last_modified
    };
    return constructedArticle;
};

/*fetchTOI_trending_links().then((links)=>{
    fetchNewsTOI(links).then((articles)=>{
        printArticles(articles);
    })
});*/

// ANI - ENtertainment - Bollywood

async function fetchANIEntertainment_trending_links() {
    var links=[]
    await driver.get('https://aninews.in/category/entertainment/bollywood/');
    //await driver.findElement(By.id("load_more")).click();
    html = await driver.getPageSource();
    $ = cheerio.load(html);

    $('.news-article  article  .content  .read-more').each((i,elem)=>{
        url="https://aninews.in/"+elem.attribs.href;
        links.push(url);
    });
    $('.extra-related-block  figcaption  .read-more').each((i,elem)=>{
        url="https://aninews.in/"+elem.attribs.href;
        links.push(url);
    });
    
    return links;
}

async function fetchNewsANIEntertainment(links){ 
    var saved_articles = [];
    //await driver.findElement(By.id("load_more")).click();
    console.log("lets grab :"+links.length+" articles");
    for(var  i=0;i<links.length;i++){
        console.log("fetching  article "+i);
        await driver.get(links[i]);
        html=await driver.getPageSource();
        saved_articles.push(helperANIEntertainment(html));
    }
  
    return saved_articles;
       
}

function helperANIEntertainment(html){
    $ = require('cheerio').load(html);
    var news_title = $('#news-detail-block  .content  h1').text();
    var last_modified = $('#news-detail-block  .time-red').text();
    var news_body =  $("#news-detail-block div[itemprop='articleBody'] p" ).text();
    
    var constructedArticle = {
        title : news_title,
        body : news_body,
        date : last_modified
    };
    return constructedArticle;
};

fetchANIEntertainment_trending_links().then((links)=>{
    fetchNewsANIEntertainment(links).then((articles)=>{
        printArticles(articles);
    })
});


// Utilities 
async function printArticles(articles){
    console.log("Print function called.");
    console.log("length of saved articles :"+articles.length);
    articles.forEach((article)=>{
        console.log(chalk.yellow("\n******************"));
        console.log(chalk.yellow(article.title + "\n\n" + article.body));
        console.log(chalk.yellow("\nLast Updated : "+article.date));
    });
}