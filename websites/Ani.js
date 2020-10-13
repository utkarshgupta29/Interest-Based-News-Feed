//import modules 
const mongoose=require('mongoose');
const cheerio = require('cheerio');
const chalk = require('chalk');
// Selenium web driver configuration
const articles =require('../schema/article.js').ani;

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

mongoose.connect("mongodb+srv://testUser:caJVL81AbLu7pe4D@cluster0.stbzy.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true , useUnifiedTopology: true});

	

class Ani {

	//CATEGORIES=['national','politics','sports'];
	constructor(){
		//console.log("constructor called yess");
		this.driver = new webdriver.Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().windowSize(screen)).build();
		this.pagetofetch={};
		
	}

	async  getLatest() {
		var html;
		var url;
		var $;
		var links=[];
	    await this.driver.get('https://aninews.in/category/national/');
		html = await this.driver.getPageSource();
		$ = cheerio.load(html);
		 var link;
		$('.extra-related-block .bottom figcaption .read-more').each((i,elem)=>{
		 // pagetofetch.push(elem.attribs.href);
		  url="https://aninews.in"+elem.attribs.href;
		  link={'url':url,'websitename':'ani','category':'national'};
		  links.push(link);
		});
	 
		

	 	
	 	return links;
	}


	async getTrending(){

	}

	async fetchArticle(link){
		console.log("i got order to fetch this link :" +link.url);
		var html;
		var url;
		var $;
		await this.driver.get(link.url);
		html=await this.driver.getPageSource();
		 $ = require('cheerio').load(html);
	    var news_title = $('#news-detail-block  .content  h1').text();
	    var last_modified = $('#news-detail-block  .time-red').text();
	    var news_body =  $("#news-detail-block div[itemprop='articleBody'] p" ).text();
	    
	    var constructedArticle = {
	        title : news_title,
	        body : news_body,
	        date : last_modified,
	        url : link.url,
	        //thumbnail :,
	        websiteName : 'ani',
	        category : link.category,
	        subcategory : link.subcategory,
	    };
	    return constructedArticle;
	}

	async getByCategory(category,subcategory){
		var fetched_articles = [];
    	await fetchCategoryLinks(category,subcategory).then(async(links)=>{
        await fetchArticles(links).then((articles)=>{
            fetched_articles = articles;
        	})
    	});
    	return fetched_articles;
	}

	async search(keyword){
		var posts =[];
		var html;
		var $;
   		var val = keyword.trim();                       
    	var key = encodeURIComponent(val);
    	if (key.length != 0) {
        URL = "https://aninews.in/search/?query=" + key
      		}
  		await this.driver.get(URL);

    	html = await driver.getPageSource();
        $ = cheerio.load(html);
        $(".extra-news-block .card").each((i,elem)=>{
 
     
	       image=elem.children[1].children[1].children[1].attribs['data-src'];
	       url=elem.children[1].children[3].children[1].attribs.href;
	       title=elem.children[1].children[3].children[1].children[1].children[0].data;
	       time=elem.children[1].children[3].children[3].children[1].children[0].children[0].data + elem.children[1].children[3].children[3].children[1].children[1].data;
	       
	       var post={'title':title,'image':image,'date':time};
       	   posts.push(post);
        });
		await this.driver.quit();
  		return posts;
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
	        url="https://aninews.in/"+elem.attribs.href;
	        var link = {
	            url : url,
	            category : category,
	            subcategory : subcategory
	        };
	        links.push(link);
	    });
	    $('.extra-related-block  figcaption  .read-more').each((i,elem)=>{
	        url="https://aninews.in/"+elem.attribs.href;
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
		console.log("in fetcharticles");
		var fetched_articles=[];
		//console.log(links);
		for(var i=0;i<links.length;i++){
			await articles.findOne({url:links[i].url}).exec().then(async (err,article)=>{
				if(err){
					console.log("already exists");
				}else{
					    console.log("not cached lets fetch this url");
						var fa=await this.fetchArticle(links[i]);
						await articles.create({
							url:fa.url,
							title:fa.title,
							body:fa.body,
							date:fa.date,
							websitename:fa.websiteName,
							category:fa.category,
							subcategory:fa.subcategory,
						}).then((data)=>{
							
							console.log("successfully inserted one article ");
						});
					
				}
			});	
		}
		
	}

	quit(){
		this.driver.quit();
	}



}

module.exports= Ani;