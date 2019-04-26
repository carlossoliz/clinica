
var express = require("express");
var sql = require("mssql");
var app = express();  
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type");
    next();
});

 var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
 });

var dbConfig = {
    user:  "user",
    password: "pass",
    server: "localhost",
    database: "db"
};

var executeQuery = function(req, res){             
    sql.connect(dbConfig, function (err) {
        if (err) {   
            res.send(err);
            sql.close();
        }
        else {
          var request = new sql.Request();
          request.query(req, function (err, response) {
            if (err) {
              res.send(err);
              sql.close();
              }
              else {
                res.send(response.recordset);
                sql.close();    
              }
          });
        }
    });      
      
}

app.post("/asegurados", function(req, res){
     var query = "select  * from asegurados$ where (select count(*) from usuario where nombre = '@user' and pass = '@pass') = 1 and ([CARNET ID] like '%' +'@valor'+ '%' or AP_PATERNO +' '+AP_MATERNO + ' ' + NOMBRES like '%' +'@valor'+ '%') ";
     query = query.replace('@valor',req.body.dato);
     query = query.replace('@valor',req.body.dato);
     query = query.replace('@user',req.body.user);
     query = query.replace('@pass',req.body.pass);
     executeQuery(query, res);
});



app.post('/login' , function(req , res){
    var query = "select count(*) as login from usuario where nombre = '@nombre' and pass = '@pass' ";
    query = query.replace('@nombre',req.body.user);
    query = query.replace('@pass',req.body.pass);
    executeQuery(query, res);
});
