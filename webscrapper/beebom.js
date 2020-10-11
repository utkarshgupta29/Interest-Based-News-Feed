/**
 *  Website Name : BeeBom
 * 
 */

//import modules 

const cheerio = require('cheerio');
const chalk = require('chalk');



// Selenium web driver configuration

const firefox =require('selenium-webdriver/firefox');
const { supportsColor } = require('chalk');
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

//  Beebom Section : 

async function getLatestLinks(category,subcategory) {
    var links=[]
    await driver.get('https://beebom.com/category/news/');
    //await driver.findElement(By.id("load_more")).click();
    html = await driver.getPageSource();
    $ = cheerio.load(html);
    $('.bee-list > div > a').each((i,elem)=>{
        url=elem.attribs.href;
        var link = {
            url : url,
            category : category,
            subcategory : subcategory
        };
        links.push(link);
    });
    return links;
}

async function fetchArticles(links){
    var tech_articles = [];
    //await driver.findElement(By.id("load_more")).click();
    console.log("lets grab :"+links.length+" articles");
    html_article=[]
    for(var  i=0;i<links.length;i++){
        console.log("fetching  article "+i);
        await driver.get(links[i].url);
        html=await driver.getPageSource();
        tech_articles.push(fetchArticleHelper(html,links[i]));
    }
    await driver.quit();
  
    return tech_articles;
       
}
function fetchArticleHelper(html,link){
    $ = require('cheerio').load(html);
    var news_title = $('.entry-title').text();
    var last_modified = $('.the-modified-date > .updated').text();
    var news_body =  "";
    $('.td-post-content > p').each(function(){
        news_body += $(this).text();
    });
    var constructedArticle = {
        title : news_title,
        body : news_body,
        date : last_modified,
        url : link.url,
        //thumbnail :,
        websiteName : 'beebom',
        category : link.category,
        subcategory : link.subcategory,
    };
    return constructedArticle;
};

async function getLatestNews(){
    var fetched_articles = [];
    await getLatestLinks().then(async(links)=>{
        await fetchArticles(links).then((articles)=>{
            fetched_articles = articles;
        })
    });
    return fetched_articles;
}
async function main(){
    var fetched_articles = await getLatestNews();
    console.log(fetched_articles);
}
main();