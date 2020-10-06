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

async function fetchNewsAajTak(){
  console.log(chalk.green('Execution started'));
  await driver.get('https://www.aajtak.in/trending');
  await driver.findElement(By.id("load_more")).click();
  html = await driver.getPageSource();
  $ = cheerio.load(html);
  console.log(chalk.green("fetching each article"));
  $('div .manoranjan-widget > ul > li > a').each(async function(){
      
      //console.log($(this).text());
      await driver.get($(this).attr('href'));
      var html_article = await driver.getPageSource();
      helper(html_article);

    });
}
async function helper(html){
    $ = require('cheerio').load(html);
    var news_title = $('.photo-Detail-LHS-Heading > h1').text();
    var news_body =  "";
    $('.photo-detail-text > p').each(async function(){
        news_body += $(this).text()+"<br>";
    });
    var constructedArticle = {
        title : news_title,
        body : news_body,
        date : new Date()
    }
    saved_articles.push(constructedArticle);
};

async function printArticles(){
    console.log("Print function called.");
    saved_articles.forEach((article)=>{
        console.log("******************");
        console.log(article.title + "\n" + article.body.substring(0,article.body.indexOf('<br>')));
        console.log("******************");
        
    });
}

fetchNewsAajTak();
printArticles();