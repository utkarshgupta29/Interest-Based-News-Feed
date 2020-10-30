//import modules 

const cheerio = require('cheerio');
const chalk = require('chalk');
const Article = require('../schema/article');
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
		
		this.driver = new webdriver.Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().windowSize(screen)).build();
		this.pagetofetch={};
	
	}

	async  getLatest() {
		var html;
		var url;
		var $;
		var links=[];
	    await this.driver.get('https://beebom.com/category/news/');
		html = await this.driver.getPageSource();
		$ = cheerio.load(html);

		$('.td-module-thumb a').each((i,elem)=>{
		 
		  url=elem.attribs.href;
		  var link={'url':url,'websitename':'beebom','category':'tech'};
		  links.push(link);
		});
		 
		return links;
	}
	 


	async getTrending(){

	}

	async fetchArticle(link){
		var html;
		var $;
		await this.driver.get(link.url);
        html=await this.driver.getPageSource();
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
		var fetched_articles = [];
    	await this.fetchCategoryLinks(category,subcategory).then(async(links)=>{
	        await this.fetchArticles(links).then((articles)=>{
	            fetched_articles = articles;
	        	});
        });
    	return fetched_articles;
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

	async fetchArticles(links){
		console.log("Fetching "+links.length+" articles. from beebom");
		var fetched_articles=[];
		//console.log(links);
		for(var i=0;i<links.length;i++){
			await Article.findOne({url:links[i].url}).exec().then(async (article,err)=>{
				if(article){
					// article already exists in db
					console.log("this article from beebom already exists")
					fetched_articles.push(article);
				}else{
					// article is not present in our db
					var fa=await this.fetchArticle(links[i]);
					fetched_articles.push(fa);
					await Article.create(fa).then((s_article)=>{
						if(s_article){
							console.log("Article saved successfully : "+s_article._id);
						}else{
							console.log("article not saved"+s_article);
						}
					});

				}
			});	
		}
		console.log("beebom done fetching articles");
		return fetched_articles;
	}

	quit(){
		this.driver.quit();
	}

}

module.exports= Beebom;