/*
 Input: search(keyword,target)    keyword: word to search , target: website name to search on
 Output: list of objects of matching article  with title and thumbnail  
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
  if (target==='beebom')
    return await searchBeebom(keyword);
  if (target==='ani')
    return await searchAni(keyword);
  if (target==='jagran')
    return await searchJagran(keyword);

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

//============================= beebom  ==================
//              site side issue taking too long to render results  #WILLDOLATER
async function searchBeebom(keyword){
  var posts ={};
   var val = keyword.trim();                       
   var key = encodeURIComponent(val);
   if (key.length != 0) {
      URL = "https://beebom.com/?s=" + key
      }
  await driver.get(URL);

    html = await driver.getPageSource();
     $ = cheerio.load(html);
     $("#datafetch .search-list").each((i,elem)=>{
 
     
       data=elem
       console.log(data);
      // posts[url]={'title':title,'image':image,'date':date};
      
  });
 //await driver.quit();
  return posts;
 }

//==================
async function searchAni(keyword){
  var posts ={};
   var val = keyword.trim();                       
   var key = encodeURIComponent(val);
   if (key.length != 0) {
      URL = "https://aninews.in/search/?query=" + key
      }
  await driver.get(URL);
//await driver.findElement(By.css("body")).sendKeys(Key.chord(Keys.CONTROL, Keys.END));  //was taking to long to load image and data of lower articles/cards ... hope scrolling will take some time and help loading
// just hit and try  
//rip it not worked ; figured alternative way
    html = await driver.getPageSource();
     $ = cheerio.load(html);
     $(".extra-news-block .card").each((i,elem)=>{
 
     
       image=elem.children[1].children[1].children[1].attribs['data-src'];
       url=elem.children[1].children[3].children[1].attribs.href;
       title=elem.children[1].children[3].children[1].children[1].children[0].data;
       time=elem.children[1].children[3].children[3].children[1].children[0].children[0].data + elem.children[1].children[3].children[3].children[1].children[1].data;
       
       posts[url]={'title':title,'image':image,'date':time};
      
  });
await driver.quit();
  return posts;
 }

//====================== english jagran =====================
async function searchJagran(keyword){
  var posts ={};
   var val = keyword.trim();                       
   var key = encodeURIComponent(val);
   if (key.length != 0) {
      URL = "https://english.jagran.com/search/" + key;
      }
  await driver.get(URL);

    html = await driver.getPageSource();
     $ = cheerio.load(html);
     $(".topicList li a").each((i,elem)=>{
 
     
       url="https://english.jagran.com"+elem.attribs.href;
       image=elem.children[1].children[1].attribs['data-src'];
       title=elem.children[3].children[1].children[0].data;
       time=elem.children[3].children[5].children[2].children[0].data;
       
       posts[url]={'title':title,'image':image,'date':time};
      
  });
await driver.quit();
  return posts;
 }

//=========== driver  for testing ==========
// search('rape','AajTak').then((data)=>{
// console.log(data);
// });


