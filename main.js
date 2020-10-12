var mongoose=require("mongoose");
var CronJob = require('cron').CronJob;
const cron = require('node-cron');
const {ani,beebom,theHindu,jagran} =require('./schema/article.js');

const aajtak = require("./websites/AajTak.js");
const aniWEb = require("./websites/Ani.js");
const beebomWeb = require("./websites/Beebom.js");
const jagranWeb = require("./websites/EnglishJagran.js");
const thehinduWeb = require("./websites/TheHindu.js");


mongoose.connect("mongodb+srv://testUser:caJVL81AbLu7pe4D@cluster0.stbzy.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true , useUnifiedTopology: true});





// i will fetch latest artiles link every 3 minute
var aajtak_getlatest = new CronJob('0 */3 * * * *',async ()=>{
	console.log('fetching latest articles link from AajTak');
	var latest=await new aajtak().getLatest();
	addtofetchqueue(latest);
},null,false,'Asia/Kolkata');



aajtak_getlatest.start();



function addtofetchqueue(data){
	console.log("i will connect to db");
	console.log(data);
}