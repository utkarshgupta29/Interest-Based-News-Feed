//import modules 

const cheerio = require('cheerio');
const chalk = require('chalk');
const Article = require('../schema/article');
var newsSummarizer = require('../news-summarizer');
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
		var last_modified = $('.the-modified-date > .updated').text().toLowerCase();
		var thumbnail = $('.news-featured-image').attr('src');
	    var news_body =  "";
	    $('.td-post-content > p').each(function(){
	        news_body += $(this).text();
		});
		var mapMonth = {
			jan : 0,
			feb : 1,
			mar : 2,
			apr : 3,
			may : 4,
			june : 5,
			july : 6,
			aug : 7,
			sept : 8,
			oct : 9,
			nov : 10,
			dec : 11,
			january : 0,
			february : 1,
			march : 2,
			april : 3,
			may : 4,
			june : 5,
			july : 6,
			august : 7,
			september : 8,
			october : 9,
			november : 10,
			december : 11  
		};
		var dateParts = last_modified.trim().split(/[\s,:]+/);
		
			
		var rawDate = {day : Number(dateParts[1]),month : mapMonth[dateParts[0].toLowerCase()],year : Number(dateParts[2]),hour: Number(dateParts[3]) ,minutes: Number(dateParts[4])};  
		if(dateParts[5]==='pm' && rawDate.hour<12){
			rawDate.hour += 12;
		}else if(dateParts[5]==='am'){
			if(rawDate.hour==12)
				rawDate.hour = 0;
		}
		var date = new Date(rawDate.year,rawDate.month,rawDate.day,rawDate.hour,rawDate.minutes);
		
		
		var news_summary = await newsSummarizer.getNewsSummary(news_body);
	    var constructedArticle = {
	        title : news_title,
	        body : news_body,
	        date : date,
	        url : link.url,
	        thumbnail : thumbnail,
	        websiteName : 'beebom',
	        category : 'technology',
			subcategory : link.subcategory,
			summary : news_summary
		};
		if(constructedArticle.body.length<20)
			constructedArticle = null;
		else
			console.log(constructedArticle.summary.split(" ").length);
	    return constructedArticle;

	}

	async getLatestNews(){
		var fetched_articles = [];
    	await this.getLatest().then(async(links)=>{
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
					if(fa!=null){
					
						fetched_articles.push(fa);
						await Article.create(fa).then((s_article)=>{
							if(s_article){
								console.log("Article saved successfully : "+s_article._id);
							}else{
								console.log("article not saved"+s_article);
							}
						});
					}
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


// async function main(){
// 	const beebom = new Beebom();
// 	var fetched_articles = await beebom.getLatestNews();
// 	console.log(fetched_articles);
// 	// console.log(await ani.getLatest());
// }

// main();

