//import modules 

const cheerio = require('cheerio');
const chalk = require('chalk');
const Article =require('../schema/article');
const request=require('request');

var rp      = require('request-promise');  
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

		

class EnglishJagran {

	//CATEGORIES=['national','politics','sports'];
	constructor(){
		
		this.driver = new webdriver.Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().headless().windowSize(screen)).build();
		this.pagetofetch={};
	
	}

	async  getLatest() {
		var links=[];
		var link1=await this.fetchJagran('https://english.jagran.com/latest-news');
		links=links.concat(link1);

		link1=await this.fetchJagran('https://english.jagran.com/latest-news-page2');
		links=links.concat(link1);

		link1=await this.fetchJagran('https://english.jagran.com/latest-news-page3');
		links=links.concat(link1);

		link1=await this.fetchJagran('https://english.jagran.com/latest-news-page4');
		links=links.concat(link1);

		
		return links;
	}


	async getTrending(){

	}

	async fetchArticle(link){
		var html,$;
	    var url;
	    await this.driver.get(link.url);
	    html = await this.driver.getPageSource();
	     $ = require('cheerio').load(html);
	    var news_title = $('#topHeading h1').text();
	    var last_modified = $('.dateInfo span').text().trim();
	    var news_body =  $("#article-des" ).clone().children().remove('.relativeNews').end().text();
	    
	    var constructedArticle = {
	        title : news_title,
	        body : news_body,
	        date : last_modified,
	        url : link.url,
	        //thumbnail :,
	        websiteName : 'jagran',
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
        	})
    	});
    	return fetched_articles;
	}

	async searchF(keyword){
		var posts =[];
	   	var val = keyword.trim();                       
	   	var key = encodeURIComponent(val);
	   	var url,html,$,image,title,image,time,post={},data;

	   	if (key.length != 0) {
	      URL = "https://english.jagran.com/search/" + key;
	      }
	  	//await this.driver.get(URL);
        await rp(URL).then((data)=>{
        	console.log(data);
         		 $ = cheerio.load(data);
			     $(".topicList li a").each((i,elem)=>{
			       url="https://english.jagran.com"+elem.attribs.href;
			       image=elem.children[1].children[1].attribs['data-src'];
			       title=elem.children[3].children[1].children[0].data;
			       time=elem.children[3].children[5].children[2].children[0].data;
			       data=elem.children[3].children[3].children[0].data;
			       //console.log(data);
			       post={'url':url,'title':title,'thumbnail':image,'date':time,'body':data};
			       posts.push(post);
			  	});
				
			  	return posts;
			});
	 
	}

	async search(keyword){
		var posts =[];
	   	var val = keyword.trim();                       
	   	var key = encodeURIComponent(val);
	   	var url,html,$,image,title,image,time,post={},data;

	   	if (key.length != 0) {
	      URL = "https://english.jagran.com/search/" + key;
	      }
	  	await this.driver.get(URL);

	    html = await this.driver.getPageSource();
	     $ = cheerio.load(html);
	     $(".topicList li a").each((i,elem)=>{
	 
	     
	       url="https://english.jagran.com"+elem.attribs.href;
	       image=elem.children[1].children[1].attribs['data-src'];
	       title=elem.children[3].children[1].children[0].data;
	       time=elem.children[3].children[5].children[2].children[0].data;
	       data=elem.children[3].children[3].children[0].data;
	       //console.log(data);
	       post={'url':url,'title':title,'thumbnail':image,'date':time,'body':data};
	       posts.push(post);
	  	});
		await this.driver.quit();
	  	return posts;
	}

	async fetchCategoryLinks(category,subcategory) {
	    var links=[];
	    var html,$;
	    var url;
	    await this.driver.get('https://english.jagran.com/'+category);
	    html = await this.driver.getPageSource();
	    $ = cheerio.load(html);

	    $('.topicList li a').each((i,elem)=>{
	        url = "https://english.jagran.com"+elem.attribs.href;
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
		console.log("Fetching "+links.length+" articles from jagran.");
		var fetched_articles=[];
		//console.log(links);
		for(var i=0;i<links.length;i++){
			await Article.findOne({url:links[i].url}).exec().then(async (article,err)=>{
				if(article){
					// article already exists in db
					console.log('this article from jagran already exists');
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
	//helper function fo getLatest()
    async fetchJagran(url) {
    	var html;
    	var $;
    	var url;
    	var links=[];
		  await this.driver.get(url);
		  html = await this.driver.getPageSource();
		   $ = cheerio.load(html);
		 
		$('.topicList li a').each((i,elem)=>{
		 // pagetofetch.push(elem.attribs.href);
		  url=elem.attribs.href;
		  url='https://english.jagran.com'+url;
		  var route=url.split("/");
		  var link;
		  if(route[3]==="cricket"){
		   link={'url':url,'category':'sport','subcategory':'cricket'};
		  }
		  else if(route[3]==="trending"){
		    link={'url':url,'websiteName':'jagran','category':'national'};
		  }
		  else if(route[3]==="india"){
		     link={'url':url,'websiteName':'jagran','category':'national'};
		  }
		  else if(route[3]==="education"){
		     link={'url':url,'websiteName':'jagran','category':'education'};
		  }
		  else if(route[3]==="lifestyle"){
		     link={'url':url,'websiteName':'jagran','category':'lifestyle'};
		  }
		  else if(route[3]==="technology"){
		     link={'url':url,'websiteName':'jagran','category':'sci-tech'};
		  }
		  
		  else if(route[3]==="elections"){
		     link={'url':url,'websiteName':'jagran','category':'national'};
		  }
		  else if(route[3]==="business"){
		     link={'url':url,'websiteName':'jagran','category':'business'};
		  }
		  else if(route[3]==="entertainment"){
		     link={'url':url,'websiteName':'jagran','category':'entertainment'};
		  }
		  else  link={'url':url,'websiteName':'jagran','category':'other'};

		  links.push(link);
		});
		  return links;

	}

	quit(){
			this.driver.quit();
		}


}

module.exports= EnglishJagran;