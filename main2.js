const Ani = require("./websites/Ani.js");
const Beebom = require("./websites/Beebom.js");
const Jagran = require("./websites/EnglishJagran.js");
const TheHindu = require("./websites/TheHindu.js");

const ani = new Ani();
const thehindu = new TheHindu();
const beebom = new Beebom();
const jagran = new Jagran();

// ANI 

function startFetchFromANI() {
    setInterval(fetchFromANI, 5 * 60 * 1000);
}
async function fetchFromANI() {
    await ani.getNews();
}


// The Hindu

function startFetchFromTheHindu() {
    setInterval(fetchFromTheHindu, 5 * 60 * 1000);
}
async function fetchFromTheHindu() {
    await thehindu.getNews();
}

// For Jagran

function startFetchFromJagran() {
    setInterval(fetchFromJagran, 5 * 60 * 1000);
}
async function fetchFromJagran() {
    await jagran.getNews();
}

// For Beebom
function startFetchFromBeebom() {
    setInterval(fetchFromBeebom, 5 * 60 * 1000);
}
async function fetchFromBeebom() {
    await beebom.getLatestNews();
}

setTimeout(startFetchFromANI,0);
setTimeout(startFetchFromBeebom,2 * 60 * 1000);
setTimeout(startFetchFromJagran, 4 * 60 * 1000);
setTimeout(startFetchFromTheHindu, 6 * 60 * 1000);


