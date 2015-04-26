var express    = require("express");
var mysql      = require('mysql');
var bodyParser = require('body-parser');


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
    connection.query('Select comics.issue, series.name, series.publisher,comics.release_date, comics.cover, comics.description from comics join series on comics.series_id=series.idseries where idcomics = ?', id, function(err, rows, fields){
      res.send(rows);
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
      connection.query('Select comics.idcomics,comics.issue, series.name, series.publisher,comics.release_date, comics.cover, comics.description, comics.series_id from comics join series on comics.series_id=series.idseries',  function(err, rows, fields) {
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

app.get('/series', function(req,res){

  var id = req.params.id;
  connectionpool.getConnection(function(err, connection){
    connection.query('Select * from series', function(err, rows, fields){
      res.send(rows);
    })
  })
});

app.get('/publishers', function(req,res){

  connectionpool.getConnection(function(err, connection){
    connection.query('Select distinct publisher from series', function(err, rows, fields){
      res.send(rows);
    });
  });
});

app.get('/review', function(req,res){
  var user_id = req.body.user_id;
  var comic_id = req.body.comic_id;
  connectionpool.getConnection(function(err, connection){
    connection.query('Select * from reviews where user_id = ? and comics_id = ?',user_id,comic_id, function(err, rows, fields){
      res.send(rows);
    });
  });
});

app.post('/add_user', function(req,res){

  var data={
    mail:req.body.mail, 
    password: req.body.password
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

app.post('/add_comic', function(req,res){
  var data;
  var userid;

  connectionpool.getConnection(function(err, connection) {
    connection.query('SELECT iduser from user where mail = ?', req.body.mail, function(err, rows, fields) {
      userid=rows[0].iduser;
      data={
        user_id: userid, 
        comic: req.body.comic_id
      };
      console.log(data);
    });
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

app.post('/add_review', function(req, res){
  connectionpool.getConnection(function(req, res){

    if(err){
       console.error('CONNECTION error: ',err);
      res.statusCode = 503;
      res.send({
      result: 'error',
      err: err.code
      });
    }
    else{

      review = {
        content: req.body.content,
        score: req.body.score,
        user_id: req.body.user_id,
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

app.delete('/delete_user_comic', function(req,res){

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
      console.log(req.body.nmail);

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
  connectionpool.getConnection(function(req, res){

    if(err){
       console.error('CONNECTION error: ',err);
      res.statusCode = 503;
      res.send({
      result: 'error',
      err: err.code
      });
    }
    else{

      review = {
        content: req.body.content,
        score: req.body.score,
        user_id: req.body.user_id,
        comics_id: req.body.comic_id
      }

      connection.query("UPDATE reviews set ? where user_id = ? and comics_id = ?", review, review.user_id, review.comics_id, function(err, rows, fields){
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

app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});



app.listen(3000);