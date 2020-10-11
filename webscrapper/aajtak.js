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

// fetchNewsAajTak

/*

CATEGORY                 URL
---------------------------------
home                   /
trending               /trending
india                  /india
photos                 /photos
videos                 /videos
elections              /elections
entertainment          /entertainment
corona                 /coronavirus-covid-19-outbreak
religion               /religion   
lifestyle              /lifestyle
business               /business
sports                 /sports
crime                  /crime
technology             /technology
world                  /world
fact-check             /fact-check
automobiles            /auto
education              /education

*/



async function fetchAajTak_trending_links(category) {
    links=[]
    await driver.get('https://www.aajtak.in/'+category);
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
    var saved_articles = [];
    //await driver.findElement(By.id("load_more")).click();
    console.log("lets grab :"+links.length+" articles");
        for(var  i=0;i<links.length;i++){
        console.log("fetching  article "+i);
           await driver.get(links[i]);
            html=await driver.getPageSource();
  
            saved_articles.push(helperAajTak(html));
        }
      //   await driver.quit();
  
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
  
  async function fetchAajTakNews(category){
      fetchAajTak_trending_links(category)
      .then((links)=>{
            fetchNewsAajTak(links)
              .then((articles)=>{
                   fetched_articles.push(articles);
              });
        });   
  
  }
  