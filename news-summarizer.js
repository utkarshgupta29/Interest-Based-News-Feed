let SummarizerManager = require("node-summarizer").SummarizerManager;


function getNewsSummary(text_to_summarize){
    return new Promise((resolve,reject)=>{
        // Convert all smart quotes to straight quotes

        text_to_summarize = text_to_summarize.replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"');


        // Summary By Text Rank

        // Summarizer.getSummaryByRank().then((summary_object)=>{
            //    console.log(summary_object.summary);
            // console.log(summary_object.summary.split(" ").length);

        // })

        // Summary By Frequency

        function getPerfectSummary(){
            return new Promise((resolve,reject)=>{
                var si = 1;
                var ei = 10;
                
                var Summarizer = new SummarizerManager(text_to_summarize,1); 
                var summary = Summarizer.getSummaryByFrequency().summary;
                
                
                var lastAns = summary;
                
                while(si<=ei){
                    var mi = si + (ei-si)/2;
                    console.log("inside loop"+mi);
                    Summarizer = new SummarizerManager(text_to_summarize,mi); 
                    summary = Summarizer.getSummaryByFrequency().summary;
                    var wordsCount = summary.split(" ").length;
                    if(wordsCount<=70){
                        lastAns = summary;
                        si = mi+1;
                    }else{
                        ei = mi-1;
                    }
                }
                resolve(lastAns);
            })    
        }
        getPerfectSummary().then((sum)=>{
            resolve(sum);
        });
    });

}

module.exports =  {getNewsSummary : getNewsSummary};
