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

		

class EnglishJagran {

	//CATEGORIES=['national','politics','sports'];
	constructor(){
		console.log("constructor called yess");
		this.driver = new webdriver.Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().windowSize(screen)).build();
		this.pagetofetch={};
	
	}

	async  getLatest() {
		var links=[];
		var link1=await fetchJagran('https://english.jagran.com/latest-news');
		links=links.concat(link1);

		link1=await fetchJagran('https://english.jagran.com/latest-news-page2');
		links=links.concat(link1);

		link1=await fetchJagran('https://english.jagran.com/latest-news-page3');
		links=links.concat(link1);

		link1=await fetchJagran('https://english.jagran.com/latest-news-page4');
		links=links.concat(link1);

		this.driver.quit();
		return links;
	}


	async getTrending(){

	}

	async fetchArticle(link){
		var html,$;
	    var url;
	    await this.driver.get(link);
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

	}

	async search(keyword){
		var posts =[];
	   	var val = keyword.trim();                       
	   	var key = encodeURIComponent(val);
	   	var URL,html,$;

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
	       
	       post={'url':url,'title':title,'image':image,'date':time};
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
		  route=url.split("/");
		  var link;
		  if(route[3]==="cricket"){
		   link={'url':url,'category':'sport','subcategory':'cricket'};
		  }
		  else if(route[3]==="trending"){
		    link={'url':url,'category':'national'};
		  }
		  else if(route[3]==="india"){
		     link={'url':url,'category':'national'};
		  }
		  else if(route[3]==="education"){
		     link={'url':url,'category':'education'};
		  }
		  else if(route[3]==="lifestyle"){
		     link={'url':url,'category':'lifestyle'};
		  }
		  else if(route[3]==="technology"){
		     link={'url':url,'category':'sci-tech'};
		  }
		  
		  else if(route[3]==="elections"){
		     link={'url':url,'category':'national'};
		  }
		  else if(route[3]==="business"){
		     link={'url':url,'category':'business'};
		  }
		  else if(route[3]==="entertainment"){
		     link={'url':url,'category':'entertainment'};
		  }
		  else  link={'url':url,'category':'other'};

		  links.push(link);
		});
		  return links;

	}




}

module.exports= EnglishJagran;