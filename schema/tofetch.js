var mongoose = require("mongoose");

const user = "admin";	//replace with your username
const pass = "admin";	//replace with your password


// For local MongoDB
// const db_url = 'mongodb://localhost/InterestBasedNewsFeed';	

//For Cloud MongoDB
const db_url = 'mongodb+srv://'+user+':'+pass+'@cluster0.stbzy.mongodb.net/InterestBasedNewsFeed?retryWrites=true&w=majority';

mongoose.connect(db_url);

var tofetchSchema=new mongoose.Schema({
	url:String,
	websitename:String,
	category:String,
	subcategory:String,
	
});

module.exports=mongoose.model("tofetch",tofetchSchema);