var mongoose=require("mongoose");

var tofetchSchema=new mongoose.Schema({
	url:String,
	websitename:String,
	category:String,
	subcategory:String,
	
});

module.exports=mongoose.model("tofetch",tofetchSchema);