/**
 * Website Name :  English Jagran
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




//this function will fetch links of news articles based on category
async function fetchCategoryLinks(category,subcategory) {
    var links=[]
    await driver.get('https://english.jagran.com/'+category);
    html = await driver.getPageSource();
    $ = cheerio.load(html);

    $('.topicList li a').each((i,elem)=>{
        url = "https://english.jagran.com"+elem.attribs.href;
        var link = {
            url : url,
            category : category,
            subcategory : subcategory
        };
        links.push(link);
    });
    
    return links;
}

//this function will fetch articles that belong to the provided links
async function fetchArticles(links){ 
    var saved_articles = [];
    //await driver.findElement(By.id("load_more")).click();
    console.log("lets grab :"+links.length+" articles");
    for(var  i=0;i<links.length;i++){
        console.log("fetching  article "+i);
        await driver.get(links[i].url);
        html=await driver.getPageSource();
        saved_articles.push(fetchArticleHelper(html,links[i]));
    }
    await driver.quit();

    return saved_articles;
}

//this is a helper function of fetchArticle that creates and returns a article
function fetchArticleHelper(html,link){
    $ = require('cheerio').load(html);
    var news_title = $('#topHeading h1').text();
    var last_modified = $('.dateInfo span').text().trim();
    var news_body =  $("#article-des" ).clone().children().remove('.relativeNews').end().text();
    
    var constructedArticle = {
        title : news_title,
        body : news_body,
        date : last_modified,
        url : link.url,
        //thumbnail :,
        websiteName : 'jagran',
        category : link.category,
        subcategory : link.subcategory,
    };
    return constructedArticle;
};

async function getByCategory(category,subcategory){
    var fetched_articles = [];
    await fetchCategoryLinks(category,subcategory).then(async(links)=>{
        await fetchArticles(links).then((articles)=>{
            fetched_articles = articles;
        })
    });
    return fetched_articles;
}
async function main(){
    var fetched_articles = await getByCategory('technology');
    console.log(fetched_articles);
}
main();
