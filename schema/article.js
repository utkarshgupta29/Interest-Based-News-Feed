var mongoose = require("mongoose");

const user = "admin";	//replace with your username   testUser
const pass = "admin";	//replace with your password   caJVL81AbLu7pe4D


// For local MongoDB
// const db_url = 'mongodb://localhost/InterestBasedNewsFeed';	

//For Cloud MongoDB
const db_url = 'mongodb+srv://'+user+':'+pass+'@cluster0.stbzy.mongodb.net/InterestBasedNewsFeed?retryWrites=true&w=majority';

mongoose.connect(db_url,{useNewUrlParser: true , useUnifiedTopology: true});

var articleSchema = new mongoose.Schema({
    title : String,
    thumbnail : String,
    body : String,
    date :  String, // {type : Date},     //TODO need to format datees of all websites befire nabling it
    websiteName : String,
    category : String,
    subcategory : String,
    url : String,
	keywords:String,
});


var Article = mongoose.model('Article',articleSchema);
module.exports = Article;

/*
module.exports={ 
		ani:mongoose.model("ani",articleSchema),
		beebom:mongoose.model("beebom",articleSchema),
		theHindu:mongoose.model("theHindu",articleSchema),
		jagran:mongoose.model("jagran",articleSchema),
	};
*/