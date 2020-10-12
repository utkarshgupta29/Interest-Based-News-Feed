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

		

class TheHindu{

	//CATEGORIES=['national','politics','sports'];
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
		await this.driver.get('https://www.thehindu.com/latest-news/');
		  html = await this.driver.getPageSource();
		   $ = cheerio.load(html);
		 
		$('.latest-news li a').each((i,elem)=>{
		 // pagetofetch.push(elem.attribs.href);


			 var url=elem.attribs.href;
			  route=url.split("/");
			  var link;
			 if(route[3]==="news"){
			        if(route[4]==="national"){
			          link={'url':url,'category':'national'};
			        }
			        else if(route[4]==="international"){
			          link={'url':url,'category':'international'};
			        }
			        else if(route[4]==="cities"){
			          link={'url':url,'category':'cities','subtcategory':route[5].toLowerCase()};  //city name
			        }
			  }
			  else if(route[3]==="business"){
			    link={'url':url,'category':'business'};
			  }
			  else if(route[3]==="entertainment"){
			    link={'url':url,'category':'entertainment'};
			  }
			  else if(route[3]==="sci-tech"){
			    link={'url':url,'category':'sci-tech'};
			  }
			  else if(route[3]==="books"){
			    link={'url':url,'category':'books'};
			  }
			  else if(route[3]==="sport"){
			    link={'url':url,'category':'sports','subcategory':route[4].toLowerCase()};
			  }
			  links.push(link);
		});
		  await this.driver.quit();
		  return links;
	}


	async getTrending(){

	}

	async fetchArticle(link){
		var html,$;
		await this.driver.get(links[i].url);
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


}

module.exports= TheHindu;