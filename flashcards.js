module.exports= function(app, connection){
    app.get('/flashcards',function(req,res){
        connection.query('SELECT * FROM flashcards', function(err,rows){
            if(err){
                console.log("error reading flash cards");
                return res.sendStatus(500);

            }
            res.json(rows);
        });
    });
    app.post('/flashcards',function(req,res){
        var query= `INSERT INTO flashcards(front_text, back_text, owner, subject)
         VALUES ('${req.body.front_text}', '${req.body.back_text}', '${req.body.owner}', '${req.body.subject}')`;
         connection.query(query,function(err,result){
             if(err){
                 console.log("error writing flash card " + err.toString());
                 return res.sendStatus(500);
             }
             res.json(result);
         });
    });
    app.put('/flashcards', function(req,res){
        var query= `UPDATE flashcards set front_text= '${req.body.front_text}', back_text= '${req.body.back_text}'
        where id= ${req.body.id}`;
        console.log(query);
        connection.query(query,function(err,result){
            if(err){
                console.log("error updating flashcard with id " + req.body.id);
                console.log(err.toString());
                return res.sendStatus(500);

            }
            res.json(result);

        });

    });
};
