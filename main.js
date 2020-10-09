
const aajtak = require("./websites/AajTak.js");
const ani = require("./websites/Ani.js");
const beebom = require("./websites/Beebom.js");
const englishjagran = require("./websites/EnglishJagran.js");
const thehindu = require("./websites/TheHindu.js");



console.log("calling aajtakfetc");

new aajtak().getLatest();

new aajtak().getArticle('https://');


