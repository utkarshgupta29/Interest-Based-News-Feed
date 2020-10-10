const chalk = require('chalk');

class TrieNode{
    constructor(data){
        this.data = data;
        this.childCount = 0;
        this.children = [];
        for(var i =0;i<256;i++){
            this.children.push(null);
        }
        this.relatedArticles = [];
        this.isTerminating = false;
    }
}
class Trie{
    constructor(){
        this.root = new TrieNode('\0');
        this.root.isTerminating = false;
    }
    add(word,articleId){
        this.addUtil(this.root,word,articleId);
    }
    addUtil(node,word,articleId){
        if(word.length==0){
            node.isTerminating = true;
            node.relatedArticles.push(articleId);
            return ;
        }
        const childIndex = word.charCodeAt(0);
        var child = node.children[childIndex];
        if(!child){
            child = new TrieNode(word[0])
            node.children[childIndex] = child;
        }
        this.addUtil(child,word.substring(1),articleId);
    }
    search(word){
        return this.searchUtil(this.root,word);
    }
    searchUtil(node,word){
        if(word.length==0){
            return node.relatedArticles;
        }
        const childIndex = word.charCodeAt(0);
        var child = node.children[childIndex];
        if(!child){
            return null;
        }
        
        return this.searchUtil(child,word.substring(1));
    }

}
// const chalk = require('chalk');
// console.log('mukesh'[0]);
var articles = [    {
                        title : "kkr won last matcch",
                        body : "very well palyed"
                    },
                    {
                        title : "csk won last match",
                        body : "played good"
                    },
                    {
                        title : "delhi captails got defeat from kkr",
                        body : "good news"
                    }
                ];

const p = new Trie();
for(var i =0;i<articles.length;i++){
    var article = articles[i];
    var words  = article.title.split(" ");
    // console.log(words);
    for(var j=0;j<words.length;j++){
        p.add(words[j],i);
    }
}
var similarArticles = p.search('won');
if(similarArticles){
    if(similarArticles.length>0){
        for(var j=0;j<similarArticles.length;j++){
            console.log(chalk.green(articles[similarArticles[j]].title));
        }
    }
}
// console.log(p.search("kkr"));


