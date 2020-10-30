var express=require("express");
var app=express();
var scraper=require("./main.js");
var bodyParser=require("body-parser");
const Article = require('./schema/article');
const jagranWeb = require("./websites/EnglishJagran.js");
const aniWeb = require("./websites/Ani.js");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs")
app.use(express.static(__dirname+'/public'));





app.get("/scraper",(req,res)=>{
	
	res.render("getlatest");
});

app.get("/scraper/:website",(req,res)=>{
	if (req.params.website=='beebom'){
		scraper.bee();
	}else if(req.params.website=='ani'){
		scraper.anni();
	}else if(req.params.website=='thehindu'){
		scraper.hindu();
	}else if(req.params.website=='jagran'){
		scraper.jagrant();
	}
	
	res.render("getlatest");
});

app.get("/search",async (req,res)=>{
	q=req.query.q;
	console.log(q);
	if(q==''||q==undefined)
	res.render("search");
	else{

		var inst=await new aniWeb();
         await inst.search(q)
            .then((posts)=>{
            	console.log("mujhe milgya");
              //console.log(posts);
              res.json(posts);
              
            }); 
		
		//await scraper.search("jagran",q).then((posts)=>{console.log("mujhe milgya data"); console.log(posts);});
		//console.log(posts);
		

	}
});

app.get("/",(req,res)=>{
	res.render("preference");
});



	
app.listen(3000,process.env.IP,function(){
console.log("server sarted");
});

