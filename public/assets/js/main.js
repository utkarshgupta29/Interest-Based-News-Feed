
console.log("reached js ");
$(document).ready(function(){
    $("#filterForm").submit(func);
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
            for(var i=0;i<res.from.length;i++){
                var title = res.from[i].title;
                var body = res.from[i].body;
                var date = res.from[i].date;
                var websiteName = res.from[i].websiteName;
                str += "<div><h3>"+title+"</h3><p>"+body+"</p><p>Article From : <em>"+websiteName+"</em>  on "+date+".</p></div><br>";
            }
            str += "</div>";
            $('#display').html(str);

        },
        error : function(err){
            console.log(err);
        }
        
    })
}




