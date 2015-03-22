var express    = require("express");
var mysql      = require('mysql');
var  connectionpool = mysql.createPool({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'cbm'
});
var app = express();


app.get('/comics', function(req,res){
  connectionpool.getConnection(function(err, connection) {
    if (err) {
      console.error('CONNECTION error: ',err);
      res.statusCode = 503;
      res.send({
        result: 'error',
        err: err.code
      });
    } 
    else {
      connection.query('SELECT * FROM test', req.params.id, function(err, rows, fields) {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.send({
            result: 'error',
            err: err.code
          });
        }
        res.send(rows);
        connection.release();
      });
    }
  });
});

app.listen(3000);