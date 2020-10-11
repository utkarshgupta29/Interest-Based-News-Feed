
var parser  = require('fast-xml-parser');
var request = require('request');
var rp      = require('request-promise');    

async function getLatest(){
	var link=[];
	await rp('https://edition.cnn.com/sitemaps/article-2020-10.xml')
			.then((data)=>{
				if(parser.validate(data)===true){
					var jsonObj=parser.parse(data);
					
					for(var i=0;i<20;i++){
						link.push({'url':jsonObj.urlset.url[i].loc ,'timestamp':jsonObj.urlset.url[i].lastmod});
							//console.log("pushed "+jsonObj.urlset.url[i].loc);
					}
				}
				
			});
			return await link;
}


getLatest().then((link)=> console.log(link));