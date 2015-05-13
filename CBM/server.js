var express    = require("express");
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var passwordHash = require('password-hash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var  connectionpool = mysql.createPool({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'cbm'
});
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public')); 

app.get('/comics/:id', function(req,res){

  var id = req.params.id;
  connectionpool.getConnection(function(err, connection){
    connection.query('Select comics.idcomics, comics.issue, series.name, series.publisher,comics.release_date, comics.cover, comics.description from comics join series on comics.series_id=series.idseries where idcomics = ?', id, function(err, rows, fields){
      res.send(rows);
      connection.release();
    })
  })
});

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
      connection.query('Select comics.idcomics,comics.issue, series.name, series.publisher,comics.release_date, comics.cover, comics.description, comics.series_id from comics join series on comics.series_id=series.idseries ORDER BY release_date DESC',  function(err, rows, fields) {
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

app.get('/comics_by_user', function(req,res){

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
      connection.query('SELECT comics.cover, comics.idcomics FROM user_has_comics join user on user.iduser=user_has_comics.user_id join' +
        ' comics on comics.idcomics = user_has_comics.comics_id where user.mail = ?',req.query.mail, function(err, rows, fields) {
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

app.get('/weekly_comics', function(req,res){
  connectionpool.getConnection(function(err, connection){
    if (err) {
      console.error('CONNECTION error: ',err);
      res.statusCode = 503;
      res.send({
        result: 'error',
        err: err.code
      });
    }
    else{
      connection.query('Select * from comics ORDER BY release_date DESC limit 1', function(err, rows, fields){

        date = rows[0].release_date;
        connection.query('Select comics.idcomics,comics.issue, series.name, series.publisher,comics.release_date, comics.cover, comics.description, comics.series_id from comics join series on comics.series_id=series.idseries where comics.release_date = ?', date, function(err, rows, fields){

          res.send(rows);
          connection.release();
        });

      });
    } 
  });
});

app.get('/series', function(req,res){

  var id = req.params.id;
  connectionpool.getConnection(function(err, connection){
    connection.query('Select * from series', function(err, rows, fields){
      res.send(rows);
      connection.release();
    })
  })
});

app.get('/publishers', function(req,res){

  connectionpool.getConnection(function(err, connection){
    connection.query('Select distinct publisher from series', function(err, rows, fields){
      res.send(rows);
      connection.release();
    });
  });
});

app.get('/review', function(req,res){
  var user_id = req.query.mail;
  var comic_id = req.query.comic;
  connectionpool.getConnection(function(err, connection){

    connection.query('SELECT iduser from user where mail = ?', req.query.mail, function(err, rows, fields) {
      userid=rows[0].iduser;
      connection.query('Select * from reviews where user_id = ? and comics_id = ?',[userid,comic_id], function(err, rows, fields){
        res.send(rows);
        connection.release();
      });
    });
  });
});

app.get('/reviews', function(req,res){
  var comic_id = req.query.comic;
  connectionpool.getConnection(function(err, connection){
    connection.query('Select * from reviews where comics_id = ?',comic_id, function(err, rows, fields){
      res.send(rows);
      connection.release();
    });
  });
});


app.get('/user_has_comic/', function(req,res){

  var userid="";

  
  connectionpool.getConnection(function(err,connection){
    connection.query('SELECT iduser from user where mail = ?', req.query.mail, function(err, rows, fields) {
      userid=rows[0].iduser;
      connection.query('Select * from user_has_comics where user_id = ? and comics_id = ?', [userid, req.query.comic], function(err, rows, fields){
        res.send(rows);
        connection.release();
      });
    });
  });
})

app.post('/add_user', function(req,res){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      var data={
        mail:req.body.mail, 
        password: hash
      };
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
          connection.query('INSERT into user set ?', data, function(err, rows, fields) {
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
  });
  
});

app.post('/login', function(req,res){

  var hash="";
  connectionpool.getConnection(function(err, connection) {

    if (err) {
      console.error('CONNECTION error: ',err);
      res.statusCode = 503;
      res.send({
        result: 'error',
        err: err.code
      });
      connection.release();
    } 
    else {

      connection.query('SELECT password from user where mail = ?', req.body.mail , function(err, rows, fields) {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.send({
            result: 'error',
            err: err.code
          });
          connection.release();
        }
        if(rows.length >0){

         hash=rows[0].password
       }
       
       bcrypt.compare(req.body.password, hash, function(err, response) {
        res.send(response);
        connection.release();
      }); 
       

       
     });
    }
  });
});

app.post('/add_comic', function(req,res){
  var data;
  var userid;
  connectionpool.getConnection(function(err, connection) {
    connection.query('SELECT iduser from user where mail = ?', req.body.mail, function(err, rows, fields) {
      userid=rows[0].iduser;
      data={
        user_id: userid, 
        comics_id: req.body.comic_id
      };
      connection.query('INSERT into user_has_comics set ? ', data, function(err, rows, fields) {
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
      
    });

  });
});

app.post('/add_review', function(req, res){

  connectionpool.getConnection(function(err, connection){
    if(err){
     console.error('CONNECTION error: ',err);
     res.statusCode = 503;
     res.send({
      result: 'error',
      err: err.code
    });
   }
   else{
    connection.query('SELECT iduser from user where mail = ?', req.body.mail, function(err, rows, fields) {
      var userid=rows[0].iduser;
      review = {
        content: req.body.content,
        score: req.body.score,
        user_id: userid,
        comics_id: req.body.comic_id
      }
      connection.query("INSERT into reviews set ?", review, function(err, rows, fields){
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

    });
  }
});
});

app.delete('/delete_user', function(req,res){

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
      connection.query('DELETE from user where mail = ?', req.body.mail, function(err, rows, fields) {
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

app.put('/delete_user_comic', function(req,res){

  var userid;

  connectionpool.getConnection(function(err, connection) {
    connection.query('SELECT iduser from user where mail = ?', req.body.mail, function(err, rows, fields) {

      userid=rows[0].iduser;
      

      connection.query('DELETE from user_has_comics where user_id = ? AND comics_id = ?', [userid, req.body.comic_id], function(err, rows, fields) {
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
    });
  });
});

app.put('/update_password/', function(req,res){

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
      connection.query('UPDATE user set password = ? where mail = ?', [req.body.password,req.body.mail], function(err, rows, fields) {
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

app.put('/update_mail/', function(req,res){

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


      connection.query('UPDATE user set mail = ? where mail = ?', [req.body.nmail,req.body.omail], function(err, rows, fields) {
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

app.put('/update_review', function(req, res){
  connectionpool.getConnection(function(err, connection){

    if(err){
     console.error('CONNECTION error: ',err);
     res.statusCode = 503;
     res.send({
      result: 'error',
      err: err.code
    });
     connection.release();
   }
   else{

    review = {
      content: req.body.content,
      score: req.body.score,
      mail: req.body.mail,
      comics_id: req.body.comic_id
    }
    
    var iduser;
    connection.query("Select iduser from user where mail= ?",review.mail,function(err,rows,fields){

      iduser=rows[0].iduser;


      connection.query("UPDATE reviews set content = ? where user_id = ? and comics_id = ?", [review.content, iduser, review.comics_id], function(err, rows, fields){
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.send({
            result: 'error',
            err: err.code
          });
          connection.release();
        }
        else{
          res.send(200);
          connection.release();
        }

        

      });
    });
  }

});
});

app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});



app.listen(8080);
