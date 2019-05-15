var express = require('express');
var router = express.Router();
var connection     = require('../lib/dbconn');

/* GET home page. redirect user to signin page */

router.get('/', function(req, res, next) {

    res.redirect('/signin');

});

/* GET user information after login */

router.get('/home', isAuthenticated, function(req, res, next) {

    var select_aval = 'SELECT a.id,u.nome as nome_usuario,l.nome as nome_livro,a.estado_conservacao,a.nota \nFROM avaliacao as a \nLEFT JOIN livro as l on l.id=a.id_livro\nLEFT JOIN usuario as u on u.id=a.id_usuario';
    connection.query(select_aval,function(err,rows)
    {
        if(err)
        {
            console.log(err);
            var errornya  = ("Erro na base de dados : %s ",err );
            req.flash('info', errornya);
            res.redirect('/');
        }else
        {
            if(rows.length <=0)
            {
                req.flash('info', "Nenhuma avaliacao!");
                res.redirect('/');
            }
            else
            {
                res.render('admin/home', {avaliacoes:rows});

            }
        }
    });

});


router.get('/users', isAuthenticated, function(req, res, next) {

    var queryString = 'select IFNULL(avg(nota), 0) as nota_media,nome,usuario.id as id\nfrom usuario\nleft join avaliacao on avaliacao.id_usuario=usuario.id\ngroup by usuario.id;';
    var query = connection.query(queryString,function(err,rows)
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
                req.flash('info', "Nenhum usuário!");
                res.redirect('/');
            }
            else{
                res.render('admin/users', {users:rows});
            }

        }
    });


});


router.post('/users/add', isAuthenticated, function(req, res, next) {

    var insert_sql = 'INSERT INTO usuario SET ?';
    var query = connection.query(insert_sql, req.body, function(err, result){
        if(err)
        {
            console.log(err);
            var errornya  = ("Erro na base de dados : %s ",err );
            req.flash('error', errornya);

        }else
        {
            req.flash('info', "Usuário Cadastrado com suceso");
        }
        res.redirect('/admin/users');
    });

});

router.get('/books', isAuthenticated, function(req, res, next) {

    connection.query('select IFNULL(count(avaliacao.id), 0) as total_avaliacao,livro.nome,livro.id,IFNULL(avg(nota), 0) as nota_media,\n       SUM(IF(estado_conservacao = 4, 1, 0))/count(avaliacao.id)*100 AS otimo,\n       SUM(IF(estado_conservacao = 3, 1, 0))/count(avaliacao.id)*100 AS bom,\n       SUM(IF(estado_conservacao = 1, 1, 0))/count(avaliacao.id)*100 AS ruim,\n       SUM(IF(estado_conservacao = 2, 1, 0))/count(avaliacao.id)*100 AS regular\nfrom livro\nleft join avaliacao on avaliacao.id_usuario=livro.id\ngroup by livro.id;',function(err,rows)
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
                req.flash('info', "Nenhum livro!");
                res.redirect('/');
            }
            else
            {
                res.render('admin/books', {livros:rows});

            }
        }
    });

});


router.post('/books/add', function(req, res, next) {

    var insert_sql = 'INSERT INTO livro SET ?';
    var query = connection.query(insert_sql, req.body, function(err, result){
        if(err)
        {
            console.log(err);
            var errornya  = ("Erro na base de dados : %s ",err );
            req.flash('error', errornya);

        }else
        {
            req.flash('info', "Livro Cadastrado com suceso");
        }
        res.redirect('/admin/books');
    });

});

function isAuthenticated(req, res, next) {
    if (req.session.user)
        return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SIGNIN PAGE
    res.redirect('/signin');
}

module.exports = router;
