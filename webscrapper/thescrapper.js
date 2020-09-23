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

const driver = new webdriver.Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options().headless().windowSize(screen)).build();



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

//console.log($('.td-module-thumb a'));
}

//==============================================================================
async function fetchANI_National() {
  await driver.get('https://aninews.in/category/national/');
  html = await driver.getPageSource();
   $ = cheerio.load(html);
 
$('.extra-related-block .bottom figcaption a').each((i,elem)=>{
 // pagetofetch.push(elem.attribs.href);
  url=elem.attribs.href;
  pagetofetch[url]={'domain':'ani','type':'national'};
});
  await driver.quit();
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
  await driver.quit();
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
  await driver.quit();
}

//==============================================================================







function pagefetcher(){
  // one fetcher specific to particular domain  since all article page under a domain are same
 //  check if that link already fetched before   else avoid  as every single fetch costs.
 //  should also delete that object key from pagetofetch
 //  object already have a property of page "domain" and "type"   use that info to tag the article while saving

}