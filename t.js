var newsSummarizer = require('./news-summarizer');

async function main(){
    var finalSummary = await newsSummarizer.getNewsSummary("This is a news article. And I love it.\"this is a quoted text. Please don't split it.\"");
    console.log(finalSummary);
}
main();
