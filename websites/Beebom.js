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

		

class Beebom {

	//CATEGORIES=['tech'];
	constructor(){
		console.log("constructor called yess");
		this.driver = new webdriver.Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().windowSize(screen)).build();
		this.pagetofetch={};
	
	}

	async  getLatest() {
		var html;
		var url;
		var $;

	    await this.driver.get('https://');
	  
	    html = await this.driver.getPageSource();
	    $ = cheerio.load(html);
	 
		

	 	await this.driver.quit();
	 	return this.pagetofetch;
	}


	async getTrending(){

	}

	async fetchArticle(link){

	}

	async getByCategory(category,subcategory){

	}

	async search(keyword){

	}

}

module.exports= Beebom;