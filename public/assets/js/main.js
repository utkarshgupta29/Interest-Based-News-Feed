
console.log("reached js ");
$(document).ready(function(){
    $("#filterForm").submit(func);
    $("#filterbutton").trigger("click")
})
function func(e){
    e.preventDefault();
    var mywebsites = ['hello'];
    $.each($("input[name='websites']:checked"),function(){
        mywebsites.push($(this).val());    
    });
    console.log(mywebsites);
        
    $.ajax({
        url : '/category/'+$('#cat').text(),
        data : {websites : mywebsites},
        method : "POST",
        contentType : "application/x-www-form-urlencoded",
        success : function(res){
            console.log("ajax success");
            console.log(res);
            var str = "<div class='container'>";
            var articles = res.from.articles;
            var categoryName = res.from.categoryName;
            str += '<div class="features-clean">'+
                    '<div class="container">'+
                        '<div class="intro">'+
                            '<h2 class="text-center">'+categoryName+'</h2>'+
                        '</div>'+
                        '<div class="row features">'+
                                '<div class="card mb-3">'+
                                    '<div class="row">'
            
            for(var i=0;i<articles.length;i++){
                var title = articles[i].title;
                var body = articles[i].body;
                var date = new Date(articles[i].date);
                var websiteName = articles[i].websiteName;
                var thumbnail = articles[i].thumbnail;

                str += '<div class="col-md-4"><img class="card-img-top" src="'+articles[i].thumbnail+'" alt="Card image cap"></div>'
                            +
                        '<div class="col-md-8 d-inline">'
                            +
                        '<div class="card-body">'
                            +
                        '<h5 class="card-title">'+articles[i].title+'</h5>'
                            +
                        '<p class="card-text">'+articles[i].summary+'</p>'
                            +
                        '<p class="card-text"><small class="text-muted">Last updated : '+new Date(articles[i].date)+'</small></p>'
                            +
                        '<p class="card-text d-inline"><small class="text-muted d-inline">News From : '+articles[i].websiteName+'</small></p>'
                            +
                        '&nbsp;&nbsp;'
                            +
                        '<a style="float:right"class="text-right card-text" href="/articles/'+articles[i]._id+'"><small class="text-left text-muted">Read Full News</small></a>'
                            +
                        '</div>'
                            +
                        '</div>'
            }
                                            
            str +=                  '</div>'+
                                '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'

            $('#display').html(str);

        },
        error : function(err){
            console.log(err);
        }
        
    })
}




