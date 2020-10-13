var mongoose=require("mongoose");

var articleSchema=new mongoose.Schema({
	title:String,
	url:String,
	thumbnail:String,
	date:String,
	body:String,
	websitename:String,
	category:String,
	subcategory:String,
	keywords:String,
	
});

module.exports={ 
		ani:mongoose.model("ani",articleSchema),
		beebom:mongoose.model("beebom",articleSchema),
		theHindu:mongoose.model("theHindu",articleSchema),
		jagran:mongoose.model("jagran",articleSchema),
	};