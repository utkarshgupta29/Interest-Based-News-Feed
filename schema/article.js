var mongoose=require("mongoose");

var articleSchema=new mongoose.Schema({
	url:String,
	thumbnail:String,
	date:String,
	websitename:String,
	category:String,
	subcategory:String,
	keywords:String,
	
});

module.exports=mongoose.model("article",articleSchema);