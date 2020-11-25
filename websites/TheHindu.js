//import modules 

const cheerio = require('cheerio');
const chalk = require('chalk');
const Article=require('../schema/article');
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

		

class TheHindu{

	//CATEGORIES=['national','politics','sports'];
	constructor(){
		
		this.driver = new webdriver.Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().windowSize(screen)).build();
		this.pagetofetch={};
	
	}

	async  getLatest() {
		var html;
		var url;
		var $;
		var links=[];
		await this.driver.get('https://www.thehindu.com/latest-news/');
		  html = await this.driver.getPageSource();
		   $ = cheerio.load(html);
		 
		$('.latest-news li a').each((i,elem)=>{
		 // pagetofetch.push(elem.attribs.href);


			 var url=elem.attribs.href;
			  var route=url.split("/");
			  var link;
			 if(route[3]==="news"){
			        if(route[4]==="national"){
			          link={'url':url,'websitename':'thehindu','category':'national'};
			        }
			        else if(route[4]==="international"){
			          link={'url':url,'category':'international'};
			        }
			        else if(route[4]==="cities"){
			          link={'url':url,'websitename':'thehindu','category':'cities','subtcategory':route[5].toLowerCase()};  //city name
			        }
			  }
			  else if(route[3]==="business"){
			    link={'url':url,'websitename':'thehindu','category':'business'};
			  }
			  else if(route[3]==="entertainment"){
			    link={'url':url,'websitename':'thehindu','category':'entertainment'};
			  }
			  else if(route[3]==="sci-tech"){
			    link={'url':url,'websitename':'thehindu','category':'sci-tech'};
			  }
			  else if(route[3]==="books"){
			    link={'url':url,'websitename':'thehindu','category':'books'};
			  }
			  else if(route[3]==="sport"){
			    link={'url':url,'websitename':'thehindu','category':'sports','subcategory':route[4].toLowerCase()};
			  }
			  else{
			  	link={'url':url,'websitename':'thehindu','category':route[3].toLowerCase()};
			  }
			  links.push(link);
		});
		  
		  return links;
	}


	async getTrending(){

	}

	async fetchArticle(link){
		var html,$;
		await this.driver.get(link.url);
        html=await this.driver.getPageSource();
        $ = require('cheerio').load(html);
	    var news_title = $('h1.title').text();
	    var last_modified = $('div.teaser-text.update-time span').first().text().trim().toLowerCase();
	    var news_body =  $(".paywall" ).text();
	    var news_summary = await newsSummarizer.getNewsSummary(news_body);
	    var thumbnail = $('.img-container > picture > source:first-child').attr('srcset');
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
	        date : date,
	        url : link.url,
			thumbnail : thumbnail,
			summary : news_summary,
	        websiteName : 'thehindu',
	        category : (link.category==='sport')?'sports':link.category,
	        subcategory : link.subcategory,
		};
		if(constructedArticle.body.length<20)
			constructedArticle = null;
		else
			console.log(constructedArticle.summary.split(" ").length);
	    return constructedArticle;
	}


	async search(keyword){

	}
	async fetchCategoryLinks(category,subcategory) {
	    var links=[];
	    var html,$;
	    if(subcategory)
	        await this.driver.get('https://www.thehindu.com/'+category+"/"+subcategory);
	    else
	        await this.driver.get('https://www.thehindu.com/'+category);

	    html = await this.driver.getPageSource();
	    $ = cheerio.load(html);

	    $('.story-thumb66-text').each((i,elem)=>{
	        var url = elem.attribs.href;
	        var link = {
	            url : url,
	            category : category,
	            subcategory : subcategory
	        };
	        links.push(link);
	    });
	    
	    return links;
	}

	async getByCategory(category,subcategory){
		var fetched_articles = [];
    	await this.fetchCategoryLinks(category,subcategory).then(async(links)=>{
        await this.fetchArticles(links).then((articles)=>{
            fetched_articles = articles;
        	})
    	});
    	return fetched_articles;
	}
	async getNews(){
		var fetched_articles = [];
		console.log("Fetching From TheHindu Started....")
    	await this.getLatest().then(async(links)=>{
        await this.fetchArticles(links).then((articles)=>{
            fetched_articles = articles;
			console.log("Fetching From TheHindu Completed.");
		})
		});
		return fetched_articles;
	}
	async fetchArticles(links){
		console.log("Fetching "+links.length+" articles from the TheHindu.");
		var fetched_articles=[];
		//console.log(links);
		for(var i=0;i<links.length;i++){
			//console.log(links[i]);
			await Article.findOne({url:links[i].url}).exec().then(async (article,err)=>{
				if(article){
					// article already exists in db
					console.log("this article from TheHindu  alredy exists");
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

	quit(){
		this.driver.quit();
	}


}

module.exports= TheHindu;

	// For testing purpose :

	// async function main(){
	// 	const thehindu = new TheHindu();
	// 	var fetched_articles = await thehindu.getNews();
	// 	console.log(fetched_articles);
	// 	// console.log(await ani.getLatest());
	// }

	// main();
