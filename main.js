var mongoose=require("mongoose");
var CronJob = require('cron').CronJob;
const cron = require('node-cron');

var retext = require('retext')
var pos = require('retext-pos')
var keywords = require('retext-keywords')
var toString = require('nlcst-to-string')

const {ani,beebom,theHindu,jagran} =require('./schema/article.js');
const tofetch =require('./schema/tofetch.js');
const aajtak = require("./websites/AajTak.js");
const aniWEb = require("./websites/Ani.js");
const beebomWeb = require("./websites/Beebom.js");
const jagranWeb = require("./websites/EnglishJagran.js");
const thehinduWeb = require("./websites/TheHindu.js");


//mongoose.connect("mongodb+srv://testUser:caJVL81AbLu7pe4D@cluster0.stbzy.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true , useUnifiedTopology: true});

//mongo "mongodb+srv://cluster0.stbzy.mongodb.net/" --username testUser



// i will fetch latest artiles link every 3 minute
var bee_getlatest = new CronJob('0 */20 * * * *',async ()=>{
	 bee();
},null,false,'Asia/Kolkata');



//bee_getlatest.start();

var hindu_getlatest =new CronJob('0 */20 * * * *',async()=>{
  console.log('fetching latest links from hindu new instance ');
  hindu();
},null,false,'Asia/Kolkata');

//hindu_getlatest.start();

var jagran_getlatest = new CronJob('0 */20 * * * *',async ()=>{
   jagrant();
},null,false,'Asia/Kolkata');

//jagran_getlatest.start();

var ani_getlatest = new CronJob('0 */20 * * * *',async ()=>{
  anni();
},null,false,'Asia/Kolkata');

//ani_getlatest.start();


function addtofetchqueue(data){
  console.log("i will connect to db");
  data.forEach(link=>{
      //console.log("saving this: ");
      console.log(link);
          tofetch.create({
              url:link.url,
              websitename:link.websitename,
              category:link.category,
              subcategory:link.subcategory,
              },(err,data)=>{
                if(err) console.log(err);
                else console.log(data);
          });
  });
  
  
}

//beebom_getlatest.start();




async function anni(){
  var inst=await new aniWEb();
  await inst.getLatest()
       .then((links)=>{  inst.fetchArticles(links)
            .then((articles)=>{console.log("anni done "); inst.quit();}) ;
        }).catch((err)=>console.log(err));
}

//anni();


async function hindu(){
  var inst2=await new thehinduWeb();
  await inst2.getLatest()
       .then((links)=>{  inst2.fetchArticles(links)
            .then((articles)=>{console.log("hindu done "); inst2.quit();}) ;
        }).catch((err)=>console.log(err));
}


hindu();


async function bee(){
  var inst3=await new beebomWeb();
  await inst3.getLatest()
       .then((links)=>{  inst3.fetchArticles(links)
            .then((articles)=>{console.log("beeebom done "); inst3.quit();}) ;
        }).catch((err)=>console.log(err));
}

//bee();
async function jagrant(){
  var inst4=await new jagranWeb();
  await inst4.getLatest()
       .then((links)=>{  inst4.fetchArticles(links)
            .then((articles)=>{console.log("jagran done "); inst4.quit();}) ;
        }).catch((err)=>console.log(err));
}
//jagrant();

//directcall();

module.exports ={ anni, hindu,bee,jagrant};














// var body='Chasing a massive target of 195 runs, KKR only managed to score 112 runs. Chris Morris and Washington Sundar took two wickets each to help RCB win the match.Karthik admitted that his team needs to improve batting performance."We need to sit down and make sure there are few things we need to do better. Batting is one area we didnt do well today and thats something we are going to try and improve," he said."We have three days break and we need to start fresh after that. It\'s been an interesting  so far as a lot of teams are comfortable batting first. I think every captain has a day like this where everything doesn\'t go according to plan and it\'s one of those days for me, I dont want to read too much into it, Karthik added.';




// retext()
//   .use(pos) // Make sure to use `retext-pos` before `retext-keywords`.
//   .use(keywords)
//   .process(body, done)

// function done(err, file) {
//   if (err) throw err

//   console.log('Keywords:')
//   file.data.keywords.forEach(function(keyword) {
//     console.log(toString(keyword.matches[0].node))
//   })

//   console.log()
//   console.log('Key-phrases:')
//   file.data.keyphrases.forEach(function(phrase) {
//     console.log(phrase.matches[0].nodes.map(stringify).join(''))
//     function stringify(value) {
//       return toString(value)
//     }
//   })
// }