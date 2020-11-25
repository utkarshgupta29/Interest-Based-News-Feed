/**
 * 	Website Name : ANI
 *  
 */

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
	

class Ani {

	//CATEGORIES=['national','politics','sports'];
	constructor(){
		this.driver = new webdriver.Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().headless().windowSize(screen)).build();
		this.pagetofetch={};
		
	}

	async  getLatest() { 
		var links=[]
	    var html;
		var url;
		var $;
		
		
		await this.driver.get('https://aninews.in');
	    
	    html = await this.driver.getPageSource();

	    $ = cheerio.load(html);
		
		$('.content-block figcaption a').each((i,elem)=>{
			url="https://aninews.in"+elem.attribs.href;
			var temp = elem.attribs.href.split("/");
			var category,subcategory;
			
			if(temp.length>=4){
				category = temp[2];	//for getting category

				if(temp.length>=5)	//check if subcategory exists
					subcategory = temp[3];	//get subcategory
			}

			var link = {
	            url : url,
	            category : category,
	            subcategory : subcategory
	        };
	        links.push(link);
		});
		
		$('.top-news-block .avtaar-wrapper .avtaar-list a').each((i,elem)=>{
			url="https://aninews.in"+elem.attribs.href;
			var temp = elem.attribs.href.split("/");
			var category,subcategory;
			
			if(temp.length>=4){
				category = temp[2];	//for getting category

				if(temp.length>=5)	//check if subcategory exists
					subcategory = temp[3];	//get subcategory
			}

			var link = {
	            url : url,
	            category : category,
	            subcategory : subcategory
	        };
	        links.push(link);
	    });
	    
	    return links;

	}


	async getTrending(){
		var links = await this.fetchCategoryLinks('national');	
		return links;
	}

	async fetchArticle(link){
		var html;
		var url;
		var $;
		await this.driver.get(link.url);
		html=await this.driver.getPageSource();
		 $ = require('cheerio').load(html);
	    var news_title = $('#news-detail-block  .content  h1').text();
	    var last_modified = $('#news-detail-block  .time-red').text().trim().toLowerCase();
	    var news_body =  $("#news-detail-block div[itemprop='articleBody'] p" ).text();
	    var category = (link.category==='tech')?'technology':link.category;
		var news_summary = await newsSummarizer.getNewsSummary(news_body);
	    var thumbnail = $('.img-container img').attr('src');
		var dateParts = last_modified.trim().split(/[\s,:]+/);
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
		var rawDate = {day : Number(dateParts[1]),month : mapMonth[dateParts[0].toLowerCase()],year : Number(dateParts[2]),hour: Number(dateParts[3]) ,minutes: Number(dateParts[4])};  
		var date = new Date(rawDate.year,rawDate.month,rawDate.day,rawDate.hour,rawDate.minutes);

		var constructedArticle = {
	        title : news_title,
	        body : news_body,
			summary : news_summary,
			date : date,
	        url : link.url,
			websiteName : 'ani',
	        category : category,
			subcategory : link.subcategory,
			thumbnail : thumbnail
		};
		console.log(constructedArticle.date);
		if(constructedArticle.body.length<20)
			constructedArticle = null;
		else
			console.log(constructedArticle.summary.split(" ").length);
		// console.log(constructedArticle);
	    return constructedArticle;
	}

	async getNews(category,subcategory){
		console.log("Fetching News From ANI Started.....")
		var fetched_articles = [];
    	await this.getLatest().then(async(links)=>{
        await this.fetchArticles(links).then((articles)=>{
			fetched_articles = articles;
			console.log("Fetching From ANI Completed Succesfully.");
        	})
    	});
    	return fetched_articles;
	}

	async fetchCategoryLinks(category,subcategory) {
	    var links=[]
	    var html;
		var url;
		var $;
		
		
	    if(subcategory)
	        await this.driver.get('https://aninews.in/category/'+category+"/"+subcategory);
	    else
	        await this.driver.get('https://aninews.in/category/'+category);
	    
	    html = await this.driver.getPageSource();

	    $ = cheerio.load(html);

	    $('.news-article  article  .content  .read-more').each((i,elem)=>{
			url="https://aninews.in"+elem.attribs.href;
			var temp = elem.attribs.href.split("/");
			
			if(temp.length>=5)	//check if subcategory exists
				subcategory = temp[3];	//get subcategory
			
			var link = {
	            url : url,
	            category : category,
	            subcategory : subcategory
	        };
	        links.push(link);
	    });
	    $('.extra-related-block  figcaption  .read-more').each((i,elem)=>{
	        url="https://aninews.in/"+elem.attribs.href;
	        var temp = elem.attribs.href.split("/");
	        if(temp.length>=5)	//check if subcategory exists
				subcategory = temp[3];	//get subcategory
			var link = {
	            url : url,
	            category : category,
	            subcategory : subcategory
	        };
	        links.push(link);
	    });
	    
	    return links;
	}

	async fetchArticles(links){
		console.log("Fetching "+links.length+" articles from ani");
		var fetched_articles=[];
		//console.log(links);
		for(var i=0;i<links.length;i++){
			await Article.findOne({url:links[i].url}).exec().then(async (article,err)=>{
				if(article){
					// article already exists in db
					console.log("already exists");
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
		return fetched_articles;
	}

	// For searching directly in main website's search bar
	async search(keyword){
		var posts =[];
		var html;
		var $,image,url,title,time,data;
   		var val = keyword.trim();                       
    	var key = encodeURIComponent(val);
    	if (key.length != 0) {
        URL = "https://aninews.in/search/?query=" + key
      		}
  		await this.driver.get(URL);

    	html = await this.driver.getPageSource();
        $ = cheerio.load(html);
        $(".extra-news-block .card").each((i,elem)=>{
 
     
	       image=elem.children[1].children[1].children[1].attribs['data-src'];
	       url=elem.children[1].children[3].children[1].attribs.href;
	       title=elem.children[1].children[3].children[1].children[1].children[0].data;
	       time=elem.children[1].children[3].children[3].children[1].children[0].children[0].data + elem.children[1].children[3].children[3].children[1].children[1].data;
	       try{
	       data=elem.children[1].children[3].children[5].children[0].data;
	   		}catch(e){}
	       //console.log(data);
	       var post={'title':title,'thumbnail':image,'date':time,'body':data};
       	   posts.push(post);
        });
		await this.driver.quit();
  		return posts;
	}

	quit(){
		this.driver.quit();
	}
}

module.exports= Ani;

	// For testing purpose :

	// async function main(){
	// 	const ani = new Ani();
	// 	var fetched_articles = await ani.getNews();
	// 	console.log(fetched_articles);
	// 	// console.log(await ani.getLatest());
	// }

	// main();
