var {Builder ,By,Key,promise,util}=require ('selenium-webdriver');
const {writeFile} =require('fs');
const { promisify} =require('util');
const firefox =require('selenium-webdriver/firefox');

promise.USE_PROMISE_MANAGER =false;


let options = new firefox.Options().setBinary(firefox.Channel.NIGHTLY);
//options.addArguments("--headless");
let driver = new Builder()
         .forBrowser('firefox')
         .setFirefoxOptions(options)
         .build();

async function main() {
  await driver.get('https://developer.mozilla.org/');
  await driver.findElement(By.id('home-q')).sendKeys('testing', Key.RETURN);
  await driver.wait(until.titleIs('Search Results for "testing" | MDN'));
  await driver.wait(async () => {
    const readyState = await driver.executeScript('return document.readyState');
    return readyState === 'complete';
  });
  const data = await driver.takeScreenshot();
  await promisify(writeFile)('screenshot.png', data, 'base64');
  await driver.quit();
}

main();
