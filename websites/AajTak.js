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

		

class AajTak {

	CATEGORIES=['national','politics','sports'];
	constructor(){
		console.log("constructor called yess");
		this.driver = new webdriver.Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().windowSize(screen)).build();
		this.pagetofetch={};
	
	}

	async  getLatest() {
		var html;
		var url;
		var $;

	    await this.driver.get('https://www.aajtak.in/india/news');
	  
	    html = await this.driver.getPageSource();
	    $ = cheerio.load(html);
	 
		$('.widget-listing-content-section a').each((i,elem)=>{
		 
		  url=elem.attribs.href;
		  this.pagetofetch[url]={'domain':'aajtak','type':'national'};
		});
		

		await this.driver.get('https://www.aajtak.in/india/politics');
	  
	    html = await this.driver.getPageSource();
	    $ = cheerio.load(html);
	 
		$('.widget-listing-content-section a').each((i,elem)=>{
	 
	  	url=elem.attribs.href;
	  	this.pagetofetch[url]={'domain':'aajtak','type':'politics'};
		});
		await this.driver.get('https://www.aajtak.in/india/uttar-pradesh');
	  
	  	html = await this.driver.getPageSource();
	   	$ = cheerio.load(html);
	 
		$('.widget-listing-content-section a').each((i,elem)=>{
	
	  	url=elem.attribs.href;
	  	this.pagetofetch[url]={'domain':'aajtak','type':'state','subtype':'uttar-pradesh'};
		});
		await this.driver.get('https://www.aajtak.in/india/delhi');
	  
	  	html = await this.driver.getPageSource();
	    $ = cheerio.load(html);
	 
		$('.widget-listing-content-section a').each((i,elem)=>{
	 
	  	url=elem.attribs.href;
	  	this.pagetofetch[url]={'domain':'aajtak','type':'state','subtype':'delhi'};
		});

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

module.exports= AajTak;