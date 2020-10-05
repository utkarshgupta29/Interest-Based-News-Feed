/*
 Input: search(keyword,target)    keyword: word to search , target: website name to search on
 Output: list of links of matching article    
*/



//=============== initi requi.=======================
const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    promise=webdriver.promise;

const cheerio = require('cheerio');
const firefox =require('selenium-webdriver/firefox');
promise.USE_PROMISE_MANAGER =false;
const screen = {
  width: 1280,
  height: 720
};

const driver = new webdriver.Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().windowSize(screen)).build();
//==============================================================


async function search(keyword,target){
	if(target==='AajTak')
		 return await searchAajTak(keyword);

}

async function searchAajTak(keyword){
 	var posts ={};
 	 var val = keyword.trim();                       //stolen from their event script
 	 var key = encodeURIComponent(val);
 	 if (key.length != 0) {
    	URL = "https://www.aajtak.in/topic/" + key
    	}
 	await driver.get(URL);

  	html = await driver.getPageSource();
  	 $ = cheerio.load(html);
  	 $("#more_content_container a").each((i,elem)=>{
 
  		url=elem.attribs.href;
  		title=elem.attribs.title;
  		//console.log(title+" ,"+url);
  		image=elem.children[1].children[0].attribs.src;
  		//console.log(image);
  		 date=elem.children[3].children[3].children[1].children[3].children[0].data;
  		// console.log(date);
  		 posts[url]={'title':title,'image':image,'date':date};
  		
	});
 await driver.quit();
 	return posts;
 }

//=========== driver  for testing ==========
search('rape','AajTak').then((data)=>{
console.log(data);
});