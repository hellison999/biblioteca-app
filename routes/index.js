var express = require('express');
var connection     = require('../lib/dbconn');
var router = express.Router();

/* GET home page. redirect user to signin page */

router.get('/', function(req, res) {
    console.log(req);
    res.render('index');

});

router.post('/evaluate', function(req, res){
    connection.query('SELECT * FROM usuario where nome='+'\''+req.body.name+'\'',function(err,rows)
        {
            if(err)
            {
                var errornya  = ("Erro na base de dados : %s ",err );
                req.flash('info', errornya);
                res.redirect('/');
            }else
            {
                if(rows.length <=0)
                {
                    req.flash('info', "Usuário não cadastrado!");
                    res.redirect('/');
                }
                else
                {
                    req.session.user=rows[0]
                    res.redirect('/evaluation');

                }
            }
        });
});

router.get('/evaluation', function(req, res){
    connection.query('SELECT * FROM livro',function(err,rows)
    {
        if(err)
        {
            var errornya  = ("Erro na base de dados : %s ",err );
            req.flash('info', errornya);
            res.redirect('/');
        }else
        {
            if(rows.length <=0)
            {
                req.flash('info', "Nenhum livro cadastrado!");
                res.redirect('/');
            }
            else
            {
                res.render('evaluation',{usuario:req.session.user,livros:rows});

            }
        }
    });
});

router.post('/saveEvaluation', function(req, res){

    var aval = req.body;
    aval['id_usuario'] = req.session.user.id;

    var insert_sql = 'INSERT INTO avaliacao SET ?';
    var query = connection.query(insert_sql, aval, function(err, result){
        if(err)
        {
            var errornya  = ("Erro na base de dados : %s ",err );
            req.flash('info', errornya);
            res.redirect('/');
        }else
        {
            req.flash('info', "Avaliação Cadastrada com suceso");
            res.redirect('/evaluation');
        }
    });

});


module.exports = router;
