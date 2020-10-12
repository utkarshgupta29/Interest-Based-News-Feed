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
		var links=[];
	    await driver.get('https://beebom.com/category/news/');
		html = await driver.getPageSource();
		$ = cheerio.load(html);

		$('.td-module-thumb a').each((i,elem)=>{
		 
		  url=elem.attribs.href;
		  var link={'url':url,'category':'tech'};
		  links.push(link);
		});
		 await this.driver.quit();
		return links;
	}
	 


	async getTrending(){

	}

	async fetchArticle(link){
		var html;
		var $;
		await this.driver.get(links[i].url);
        html=await driver.getPageSource();
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

	}

	async getByCategory(category,subcategory){

	}

	async search(keyword){  //TODO    no completed yet : server side issue taking too long to show results'
		var posts ={};
	    var val = keyword.trim();                       
	    var key = encodeURIComponent(val);
	    var URL;
	    var html,$;
	    if (key.length != 0) {
	      URL = "https://beebom.com/?s=" + key;
	      }
	    await this.driver.get(URL);

	    html = await driver.getPageSource();
	    $ = cheerio.load(html);
	    $("#datafetch .search-list").each((i,elem)=>{
	       data=elem
	       console.log(data);
	
	    });
	
	    return posts;
	}

}

module.exports= Beebom;