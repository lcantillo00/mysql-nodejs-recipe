// import express package
var express= require('express');
var mysql =require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'flashcards',
    port: '8889'
});
connection.connect(function(err, result){
    if(err){
        console.log(err.toString());
        return;
    }
    console.log(result);
})
//create web app
var app = express();
var bodyParser= require('body-parser');
var bcrypt = require('bcryptjs');

// configure web app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/users/register', function (req,res){
    if (!req.body || !req.body.username || !req.body.password){
        return res.sendStatus(400);
    }
    var salt = bcrypt.genSaltSync(3);
    var hashedPassword = bcrypt.hashSync(req.body.password, salt);
    console.log("here if what i' would be saving ", req.body.username, hashedPassword);
    var query = `INSERT INTO users(username, hashed_password) VALUES('${req.body.username}', '${hashedPassword}')`;

    connection.query(query, function(err, result){
        if (err){
            console.log(err.toString());
            return res.status(500).send(err);
        }


        res.json(result);
        console.log("db request succeded");


    });

});
app.get('/', function (req,res){
    res.end('Hello world');
});
app.post('/users/register', function (req,res){
    if (!req.body || !req.body.username || !req.body.password){
        return res.sendStatus(400);
    }
    var query= `SELECT * FROM users WHERE username='${req.body.username}'`;
    connection.query(query, function(err, rows){
        if (err){
            console.log("error looking up user");
            return res.sendStatus(500);
        }
        if(rows.length !=1){
            console.log("multiple or no users found");
            return res.sendStatus(500);
        }
        var userInDB= rows[0];
        var isPasswordCorrect= bcrypt.compareSync(req.body.password, userInDB.hashed_password);
        if(!isPasswordCorrect){
            console.log("failed at logging in with bad password");
            res.sendStatus(401);
        }
        return res.sendStatus(200);
    });
});
require('./flashcards.js')(app, connection);

//make app listen
app.listen(8887);
