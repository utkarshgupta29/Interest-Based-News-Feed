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

// ANI - ENtertainment - Bollywood

async function fetchANIEntertainment_trending_links(category,subcategory) {
    var links=[]
    await driver.get('https://aninews.in/category/'+category+"/"+subcategory);
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

async function fetchANINews(category,subcategory){
    if(!subcategory)
        subcategory ="";
    category = category.toLowerCase();
    subcategory = subcategory.toLowerCase();
    
    fetchANIEntertainment_trending_links(category,subcategory).then((links)=>{
        fetchNewsANIEntertainment(links).then((articles)=>{
            printArticles(articles);
        })
    });
}
/*
    Cateogries Available : 
        1) national 
            1) general-News 
            2) politics
            3) features
        2) world
            1) asia
            2) us
            3) europe
            4) pacific
            5) others
            6) middle-east
        3) business
            1) corporate
        4) sports
            1) cricket
            2) football
            3) tennis
            4) hockey
            5) others
        5) lifestyle
            1) relationship
            2) sexuality
            3) beauty
            4) parenting
            5) fashion
            6) food
            7) travel
            8) quirky
            9) fitness
            10) culture
        6) entertainment
            1) bollywood
            2) hollywood
            3) music
            4) out-Of-box
        7) health
        8) science
        9) tech
            1) mobile
            2) internet
            3) computers
            4) others
        10) environment
*/
// fetchANINews("entertainment","music");  //first argument refers to category and second for subcategory


// The Hindu

async function fetchTheHindu_links(category,subcategory) {
    var links=[]
    await driver.get('https://www.thehindu.com/'+category+"/"+subcategory);
    //await driver.findElement(By.id("load_more")).click();
    html = await driver.getPageSource();
    $ = cheerio.load(html);

    $('.story-thumb66-text').each((i,elem)=>{
        url = elem.attribs.href;
        links.push(url);
    });
    
    return links;
}

async function fetchNewsTheHindu(links){ 
    var saved_articles = [];
    //await driver.findElement(By.id("load_more")).click();
    console.log("lets grab :"+links.length+" articles");
    for(var  i=0;i<links.length;i++){
        console.log("fetching  article "+i);
        await driver.get(links[i]);
        html=await driver.getPageSource();
        saved_articles.push(helperTheHindu(html));
    }
  
    return saved_articles;
}

function helperTheHindu(html){
    $ = require('cheerio').load(html);
    var news_title = $('h1.title').text();
    var last_modified = $('div.teaser-text.update-time span').first().text().trim();
    var news_body =  $(".paywall" ).text();
    
    var constructedArticle = {
        title : news_title,
        body : news_body,
        date : last_modified
    };
    return constructedArticle;
};

async function fetchTheHinduNews(category,subcategory){
    if(!subcategory)
        subcategory ="";
    category = category.toLowerCase();
    subcategory = subcategory.toLowerCase();
    
    fetchTheHindu_links(category,subcategory).then((links)=>{
        fetchNewsTheHindu(links).then((articles)=>{
            printArticles(articles);
        })
    });
}

// fetchTheHinduNews("sport","cricket");  //first argument refers to category and second for subcategory

// English Jagran

async function fetchEnglishJagran_links(category,subcategory) {
    var links=[]
    await driver.get('https://english.jagran.com/'+category);
    //await driver.findElement(By.id("load_more")).click();
    html = await driver.getPageSource();
    $ = cheerio.load(html);

    $('.topicList li a').each((i,elem)=>{
        url = "https://english.jagran.com"+elem.attribs.href;
        links.push(url);
    });
    
    return links;
}

async function fetchNewsEnglishJagran(links){ 
    var saved_articles = [];
    //await driver.findElement(By.id("load_more")).click();
    console.log("lets grab :"+links.length+" articles");
    for(var  i=0;i<links.length;i++){
        console.log("fetching  article "+i);
        await driver.get(links[i]);
        html=await driver.getPageSource();
        saved_articles.push(helperEnglishJagran(html));
    }
  
    return saved_articles;
}

function helperEnglishJagran(html){
    $ = require('cheerio').load(html);
    var news_title = $('#topHeading h1').text();
    var last_modified = $('.dateInfo span').text().trim();
    var news_body =  $("#article-des" ).clone().children().remove('.relativeNews').end().text();
    
    var constructedArticle = {
        title : news_title,
        body : news_body,
        date : last_modified
    };
    return constructedArticle;
};

async function fetchEnglishJagranNews(category,subcategory){
    if(!subcategory)
        subcategory ="";
    else   
        subcategory = "/"+subcategory;
    category = category.toLowerCase();
    subcategory = subcategory.toLowerCase();
    
    fetchEnglishJagran_links(category,subcategory).then((links)=>{
        fetchNewsEnglishJagran(links).then((articles)=>{
            printArticles(articles);
        })
    });
    await driver.quit();
}

fetchEnglishJagranNews("technology");  //first argument refers to category and second for subcategory

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