
var mysql = require('mysql');
var  connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'cbm'
});

var http = require('http');

//Marvel API stuff
var crypto = require('crypto');
var timestamp = "1";
//Add your Marvel API keys here
var api_key = "";
var p_key = "";
var hash = crypto.createHash("md5").update(timestamp+p_key+api_key).digest("hex");

var query = "dateDescriptor=thisWeek&noVariants=true&limit=100&orderBy=title&ts="+timestamp+"&apikey="+api_key+"&hash="+hash;
var url = "http://gateway.marvel.com/v1/public/comics?"+query;
console.log("Querying Marvel's database...");

//Get comic list from Marvel's API and add new comics to the database
http.get(url,function(res){
    var body= '';
    res.on('data', function(d){
        body +=d;
    });
    res.on('end', function(){
        var arr = JSON.parse(body);
        addToDatabase(arr);
    });
}).on('error', function(e) {
    console.log("Got error: " + e.message);
});

function addToDatabase(array){
    var count = array.data.count;

    

    for(var i = 0; i < count; i++){

        addComic(array, i);

    }

    function addComic(array, index){

        var title = "";
        var issue = "";
        var match = 0;
        var release = "";
        var title_id = 0;
        var match = 0;

        title = array.data.results[i].title;
        title = title.substr(0, title.lastIndexOf(")")+1);
        issue = array.data.results[i].issueNumber;
        release = array.data.results[i].dates[0].date;

        var newIssue={
            series_id: 0,
            issue : issue,
            release_date : release
        }

        var newTitle={
            name: title,
            publisher: "Marvel"
        }

        connection.query('Select * from series where name = ?', title, function(err,rows,fields){
                if(err)
                    throw err;

                if(rows.length <= 0){

                    console.log(title+ " was not in the DB");
                    
                    connection.query("INSERT into series set ?", newTitle, function(err, rows, fields){
                        if(err)
                            throw(err);
                        console.log("Added "+newTitle.name);
                    });
                }

                connection.query('Select idseries from series where name = ?', title, function(err, rows, fields){
                        newIssue.series_id = rows[0].idseries;
                        connection.query('Select * from comics where series_id = ? AND issue = ?', [newIssue.series_id, newIssue.issue], function(err, rows, fields){

                            if(err)
                                throw err;

                            if(rows.length <= 0){
                                connection.query("INSERT into comics set ?", newIssue, function(err, rows, fields){
                            if(err)
                                throw(err);
                            console.log("Added "+ title + " #"+newIssue.issue);
                            connection.end(function(err){});
                        });
                            }

                        })
                        
                });             
        });

    }

}