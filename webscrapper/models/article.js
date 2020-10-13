var mongoose = require('mongoose');

// const db_url = 'mongodb://localhost/InterestBasedNewsFeed';
const db_url = 'mongodb+srv://admin:admin@cluster0.stbzy.mongodb.net/InterestBasedNewsFeed?retryWrites=true&w=majority';
mongoose.connect(db_url);

var articleSchema = new mongoose.Schema({
    title : String,
    thumbnail : String,
    body : String,
    date : {type : Date},
    websiteName : String,
    category : String,
    subcategory : String,
    url : String
});

var Article = mongoose.model('Article',articleSchema);
module.exports = Article;