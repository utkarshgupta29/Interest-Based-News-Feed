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



pagetofetch={};


async function fetchBeebom() {
  await driver.get('https://beebom.com/category/news/');
  html = await driver.getPageSource();
   $ = cheerio.load(html);

$('.td-module-thumb a').each((i,elem)=>{
 // pagetofetch.push(elem.attribs.href);
  url=elem.attribs.href;
  pagetofetch[url]={'domain':'beebom','type':'tech'};
});
  await driver.quit();
console.log(pagetofetch);
//console.log($('.td-module-thumb a'));000
}

//fetchBeebom();
//===================================ANI===========================================
async function fetchANI_National() {
  await driver.get('https://aninews.in/category/national/');
  html = await driver.getPageSource();
   $ = cheerio.load(html);
 
$('.extra-related-block .bottom figcaption a').each((i,elem)=>{
 // pagetofetch.push(elem.attribs.href);
  url=elem.attribs.href;
  pagetofetch[url]={'domain':'ani','type':'national'};
});
  //await driver.quit();
}

async function fetchANI_Businesss() {
  await driver.get('https://aninews.in/category/business/corporate/');
  html = await driver.getPageSource();
   $ = cheerio.load(html);
 
$('.extra-related-block .bottom figcaption a').each((i,elem)=>{
 // pagetofetch.push(elem.attribs.href);
  url=elem.attribs.href;
  pagetofetch[url]={'domain':'ani','type':'business'};
});
 // await driver.quit();
}

async function fetchANI_Lifestyle() {
  await driver.get('https://aninews.in/category/lifestyle/');
  html = await driver.getPageSource();
   $ = cheerio.load(html);
 
$('.extra-related-block .bottom figcaption a').each((i,elem)=>{
 // pagetofetch.push(elem.attribs.href);
  url=elem.attribs.href;
  pagetofetch[url]={'domain':'ani','type':'lifestyle'};
});
  await driver.quit();
}

async function fetchANI_Entertainment() {
  await driver.get('https://aninews.in/category/entertainment/');
  html = await driver.getPageSource();
   $ = cheerio.load(html);
 
$('.extra-related-block .bottom figcaption a').each((i,elem)=>{
 // pagetofetch.push(elem.attribs.href);
  url=elem.attribs.href;
  pagetofetch[url]={'domain':'ani','type':'entertainment'};
});
 // await driver.quit();
}

//================================== The Hindu========================================

async function fetchTheHindu() {
  await driver.get('https://www.thehindu.com/latest-news/');
  html = await driver.getPageSource();
   $ = cheerio.load(html);
 
$('.latest-news li a').each((i,elem)=>{
 // pagetofetch.push(elem.attribs.href);
  url=elem.attribs.href;
  route=url.split("/");
  if(route[3]==="news"){
        if(route[4]==="national"){
          pagetofetch[url]={'domain':'thehindu','type':'national'};
        }
        else if(route[4]==="international"){
          pagetofetch[url]={'domain':'thehindu','type':'national'};
        }
        else if(route[4]==="cities"){
          pagetofetch[url]={'domain':'thehindu','type':'cities','subtype':route[5].toLowerCase()};  //city name
        }
  }
  else if(route[3]==="business"){
    pagetofetch[url]={'domain':'thehindu','type':'business'};
  }
  else if(route[3]==="entertainment"){
    pagetofetch[url]={'domain':'thehindu','type':'entertainment'};
  }
  else if(route[3]==="sci-tech"){
    pagetofetch[url]={'domain':'thehindu','type':'sci-tech'};
  }
  else if(route[3]==="books"){
    pagetofetch[url]={'domain':'thehindu','type':'books'};
  }
  else if(route[3]==="sport"){
    pagetofetch[url]={'domain':'thehindu','type':'sport','subtype':route[4].toLowerCase()};
  }
});
  await driver.quit();
  //console.log(pagetofetch);
}

//========================================= Jagran ===========================================

async function fetchJagran(url) {
  await driver.get(url);
  html = await driver.getPageSource();
   $ = cheerio.load(html);
 
$('.topicList li a').each((i,elem)=>{
 // pagetofetch.push(elem.attribs.href);
  url=elem.attribs.href;
  url='https://english.jagran.com'+url;
  route=url.split("/");
  if(route[3]==="cricket"){
    pagetofetch[url]={'domain':'jagran','type':'sport','subtype':'cricket'};
  }
  else if(route[3]==="trending"){
    pagetofetch[url]={'domain':'jagran','type':'national'};
  }
  else if(route[3]==="india"){
    pagetofetch[url]={'domain':'jagran','type':'national'};
  }
  else if(route[3]==="education"){
    pagetofetch[url]={'domain':'jagran','type':'education'};
  }
  else if(route[3]==="lifestyle"){
    pagetofetch[url]={'domain':'jagran','type':'lifestyle'};
  }
  else if(route[3]==="technology"){
    pagetofetch[url]={'domain':'jagran','type':'sci-tech'};
  }
  
  else if(route[3]==="elections"){
    pagetofetch[url]={'domain':'jagran','type':'national'};
  }
  else if(route[3]==="business"){
    pagetofetch[url]={'domain':'jagran','type':'business'};
  }
  else if(route[3]==="entertainment"){
    pagetofetch[url]={'domain':'jagran','type':'entertainment'};
  }
  else pagetofetch[url]={'domain':'jagran','type':'other'};
});
  //await driver.quit();
  console.log(pagetofetch);
}
 function fetchjagran(){

  fetchJagran('https://english.jagran.com/latest-news');

  fetchJagran('https://english.jagran.com/latest-news-page2');

  fetchJagran('https://english.jagran.com/latest-news-page3');
  fetchJagran('https://english.jagran.com/latest-news-page4');
   await driver.quit();
}

//=====================================Aaj Tak=========================================================
async function fetchAajTak_trending() {
  await driver.get('https://www.aajtak.in/trending');
  await driver.findElement(By.id("load_more")).click();
  html = await driver.getPageSource();
   $ = cheerio.load(html);
 
$('.manoranjan-widget li a').each((i,elem)=>{
 // pagetofetch.push(elem.attribs.href);
  url=elem.attribs.href;
  pagetofetch[url]={'domain':'aajtak','type':'trending'};
});
 // await driver.quit();
 console.log(pagetofetch);
}


async function fetchAajTak() {
  await driver.get('https://www.aajtak.in/india/news');
  
  html = await driver.getPageSource();
   $ = cheerio.load(html);
 
$('.widget-listing-content-section a').each((i,elem)=>{
 // pagetofetch.push(elem.attribs.href);
  url=elem.attribs.href;
  pagetofetch[url]={'domain':'aajtak','type':'national'};
});
 // await driver.quit();

await driver.get('https://www.aajtak.in/india/politics');
  
  html = await driver.getPageSource();
   $ = cheerio.load(html);
 
$('.widget-listing-content-section a').each((i,elem)=>{
 // pagetofetch.push(elem.attribs.href);
  url=elem.attribs.href;
  pagetofetch[url]={'domain':'aajtak','type':'politics'};
});
await driver.get('https://www.aajtak.in/india/uttar-pradesh');
  
  html = await driver.getPageSource();
   $ = cheerio.load(html);
 
$('.widget-listing-content-section a').each((i,elem)=>{
 // pagetofetch.push(elem.attribs.href);
  url=elem.attribs.href;
  pagetofetch[url]={'domain':'aajtak','type':'state','subtype':'uttar-pradesh'};
});
await driver.get('https://www.aajtak.in/india/delhi');
  
  html = await driver.getPageSource();
   $ = cheerio.load(html);
 
$('.widget-listing-content-section a').each((i,elem)=>{
 // pagetofetch.push(elem.attribs.href);
  url=elem.attribs.href;
  pagetofetch[url]={'domain':'aajtak','type':'state','subtype':'delhi'};
});

 await driver.quit();
 console.log(pagetofetch);
}



//=====Uncomment to fetch ===========
//fetchAajTak()
//fetchjagran();
// fetchBeebom();
// fetchTheHindu();
// fetchANI_Entertainment();
// fetchANI_Lifestyle();
// fetchANI_Businesss();
// fetchANI_National();




function pagefetcher(){
  // one fetcher specific to particular domain  since all article page under a domain are same
 //  check if that link already fetched before   else avoid  as every single fetch costs.
 //  should also delete that object key from pagetofetch
 //  object already have a property of page "domain" and "type"   use that info to tag the article while saving

}