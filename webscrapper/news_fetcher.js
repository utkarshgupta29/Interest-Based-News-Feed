/*
    This module will fetch news from the following news websites :
    1) AajTak
    2) Beebom
    3) ANI
    4) Jagran
    5) TheHindu
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

//global array of articles


//Driver Code

async function news_fetcher(){
    // fetchAajTakNews("india");

    // fetchBeeB omNews();

    // fetchANINews("entertainment","music");  //first argument refers to category and second for subcategory

    const ans = await fetchTheHinduNews("sport","cricket");  //first argument refers to category and second for subcategory

    // fetchEnglishJagranNews("technology");  //first argument refers to category and second for subcategory
    return ans;
}

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


module.exports = news_fetcher;