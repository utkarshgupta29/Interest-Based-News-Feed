/**

        Website Name : ANI 

        Website Structure For News Categories And Subcategories

        --------------------------------------------------------------------------------
        CATEGORY                    SUBCATEGORY                     URL
        --------------------------------------------------------------------------------
        1) national                                               /national
                                a) general-News                   /national/general-news  
                                b) politics                       /national/politics
                                c) features                       /national/features

        2) world                                                  /world
                                a) asia                           /world/asia
                                b) us                             /world/us
                                c) europe                         /world/europe
                                d) pacific                        /world/pacific
                                e) others                         /world/others
                                f) middle-east                    /world/middle-east

        3) business                                               /business
                                a) corporate                      /business/corporate
        
        4) sports                                                 /sports
                                a) cricket                        /sports/cricket
                                b) football                       /sports/football
                                c) tennis                         /sports/tennis
                                d) hockey                         /sports/hockey
                                e) others                         /sports/others
                                
        5) lifestyle                                              /lifestyle
                                a) relationship                   /lifestyle/relationships
                                b) sexuality                      /lifestyle/sexuality
                                c) beauty                         /lifestyle/beauty
                                d) parenting                      /lifestyle/parenting
                                e) fashion                        /lifestyle/fashion
                                f) food                           /lifestyle/food
                                g) travel                         /lifestyle/travel
                                h) quirky                         /lifestyle/quirky
                                i) fitness                        /lifestyle/fitness
                                j) culture                        /lifestyle/culture     

        6) entertainment                                          /entertainment
                                a) bollywood                      /entertainment/bollywood
                                b) hollywood                      /entertainment/hollywood
                                c) music                          /entertainment/music
                                d) out-Of-box                     /entertainment/out-of-box
       
        7) health                                                 /health

        8) science                                                /science
       
        9) technology                                             /tech
            1) mobile                                             /tech/mobile
            2) internet                                           /tech/internet
            3) computers                                          /tech/computers
            4) others                                             /tech/others
        
        10) environment                                           /environment

        -----------------------------------------------------------------------------
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


// getLatest() function
// Yet to be done

// getTrending() function 
// Yet to be done

//this function will fetch links of news articles based on category
async function fetchCategoryLinks(category,subcategory) {
    var links=[]
    
    if(subcategory)
        await driver.get('https://aninews.in/category/'+category+"/"+subcategory);
    else
        await driver.get('https://aninews.in/category/'+category);
    
    html = await driver.getPageSource();
    $ = cheerio.load(html);

    $('.news-article  article  .content  .read-more').each((i,elem)=>{
        url="https://aninews.in/"+elem.attribs.href;
        var link = {
            url : url,
            category : category,
            subcategory : subcategory
        };
        links.push(link);
    });
    // $('.extra-related-block  figcaption  .read-more').each((i,elem)=>{
    //     url="https://aninews.in/"+elem.attribs.href;
    //     var link = {
    //         url : url,
    //         category : category,
    //         subcategory : subcategory
    //     };
    //     links.push(link);
    // });
    
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
    var news_title = $('#news-detail-block  .content  h1').text();
    var last_modified = $('#news-detail-block  .time-red').text();
    var news_body =  $("#news-detail-block div[itemprop='articleBody'] p" ).text();
    
    var constructedArticle = {
        title : news_title,
        body : news_body,
        date : last_modified,
        url : link.url,
        //thumbnail :,
        websiteName : 'ani',
        category : link.category,
        subcategory : link.subcategory,
    };
    return constructedArticle;
};

async function getByCategory(category,subcategory){
    fetchCategoryLinks(category,subcategory).then((links)=>{
        fetchArticles(links).then((articles)=>{
            return (articles);
        })
    });
}

async function main(){
    var fetched_articles = await getByCategory('entertainment','music');
    console.log(fetched_articles);
}
