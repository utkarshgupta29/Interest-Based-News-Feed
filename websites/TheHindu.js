//import modules 

const cheerio = require('cheerio');
const chalk = require('chalk');
const Article=require('../schema/article');
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
	    var last_modified = $('div.teaser-text.update-time span').first().text().trim();
	    var news_body =  $(".paywall" ).text();
	    
	    var constructedArticle = {
	        title : news_title,
	        body : news_body,
	        date : last_modified,
	        url : link.url,
	        //thumbnail :,
	        websiteName : 'thehindu',
	        category : link.category,
	        subcategory : link.subcategory,
	    };
	    return constructedArticle;
	}

	async getByCategory(category,subcategory){

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
	        url = elem.attribs.href;
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
	async fetchArticles(links){
		console.log("Fetching "+links.length+" articles from the TheHindu.");
		var fetched_articles=[];
		//console.log(links);
		for(var i=0;i<links.length;i++){
			await Article.findOne({url:links[i].url}).exec().then(async (article,err)=>{
				if(article){
					// article already exists in db
					console.log("this article from TheHindu  alredy exists");
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
		return fetched_articles;
	}


}

module.exports= TheHindu;