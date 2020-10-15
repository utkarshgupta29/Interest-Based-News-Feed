var express=require("express");
var app=express();
var scraper=require("./main.js");
var bodyParser=require("body-parser");
const Article = require('./schema/article');

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

app.get("/search",(req,res)=>{
	q=req.query.q;
	console.log(q);
	if(q==''||q==undefined)
	res.render("search");
	else{
		
		Article.find({ body: { $regex: req.query.q, $options: "i" } } , function(err, articles) {
			res.send(articles);
		}).limit(10);
	}
});

app.get("/",(req,res)=>{
	res.render("preference");
});



	
app.listen(3000,process.env.IP,function(){
console.log("server sarted");
});

