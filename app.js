var express = require('express');
var path = require('path');
var app = express();

var sql = require('mssql');

// configure app
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
// use middleware

// define routes

var server = app.listen(6969, function () {
    console.log('Server is running..');
});

app.get('/',function(req,res){
    var config = {
        user: 'sa',
        password: '123456',
        server: 'localhost', 
        database: 'Girl' 
    };
    sql.close();
    sql.connect(config, function (err) {
    
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
        var total;
        request.query('select count (*) as total from Girl;select top 1 * from Girl', function (err, recordset) {
            if (err) console.log(err)
            total = recordset['recordset'][0].total;
            console.log(recordset[1]);
        });
        console.log(total);
        request.query('select top 1000 * from Girl', function (err, recordset) {
            if (err) console.log(err)
            res.render('index',{total : total,images:recordset['recordset']}); 
            
        });
    });
});

app.get('/:page',function(req,res){
    var page = req.params.page;
    res.send(page);
});