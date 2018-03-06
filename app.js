var express = require('express');
var path = require('path');
var app = express();

var sql = require('mssql');
var config = {
    user: 'sa',
    password: 'tsd@123',
    server: '210.245.8.58', 
    database: 'test_tracuu' 
};
// configure app
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
// use middleware

// define routes
app.get('/',function(req,res){
    Read(1,500,function(rs){
        res.render('index',rs);
    });
});

app.get('/:page',function(req,res){
        var page = parseInt(req.params.page);
        Read(page,500,function(rs){
            res.render('index',rs);
        });

});

var server = app.listen(6969, function () {
    console.log('Server is running..');
});

function Read(page, size, callback){
    console.log(page+1);
    var from = (page-1)*size+1;
    var to = page*size;
    sql.close();
    sql.connect(config, function (err) {
    
        if (err) callback(err);
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
        try{
            request.query(`select count (*) as total from Girl `, function (err, recordset) {
                if (err) callback(err);
                total = recordset['recordset'][0].total;
                console.log(total);
                //get image
                request.query(`select * from Girl where id >= ${from} and id <= ${to}`, function (err, recordset) {
                    if (err) callback(err);
                    console.log(recordset);
                    if(recordset!=undefined){var image = recordset['recordset'];callback({total : total/size,images:image});}
                    
                });
            });
        }catch(err){
            console.log(err);
        }

        
    });
}
