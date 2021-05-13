const express = require('express');  
const bodyParser = require('body-parser');  
const path = require('path');  
const NodeCouchdb = require('node-couchdb');  
  
const couch = new NodeCouchdb({  
auth:{  
    user: 'adminNicole',  
    password: '4567'  
}  
});  


const dbName = 'suscriptores';
const viewUrl = '_design/all_s/_view/all';

couch.listDatabases().then(function(dbs){  
console.log(dbs);  
});  
  
const app = express();  
app.set('view engine', 'ejs');  
app.set('views', path.join(__dirname, 'views'));  
app.use (bodyParser.json());  
app.use(bodyParser.urlencoded({extended: false}));  

app.get('/suscripciones', function(req,res){  
 couch.get(dbName, viewUrl).then(
     function(data, headers, status){
         console.log(data.data.rows);
        res.render('index',{
            suscriptores:data.data.rows
        });
     },
     function(err){
        res.send(err);
     });
});  

app.get('/suscripciones2', function(req,res){  
    couch.get(dbName, viewUrl).then(
        function(data, headers, status){
            console.log(data.data.rows);
           res.render('reporte2',{
               suscriptores:data.data.rows
           });
        },
        function(err){
           res.send(err);
        });
   });  

app.get('/home', function(req,res){  
    couch.get(dbName, viewUrl).then(
        function(data, headers, status){
            console.log(data.data.rows);
           res.render('home',{
               suscriptores:data.data.rows
           });
        },
        function(err){
           res.send(err);
        });
   });  


   app.post('/agregar', function(req,res){  
        const nombre= req.body.nombre;
        const correo= req.body.correo;
        const cedula= req.body.cedula;
        const sucursal= req.body.sucursal;
        const suscripcion= req.body.suscripcion;
        const costo=req.body.costo;
        const moroso= req.body.moroso;
        const fechaDS= req.body.fechaDS;

        couch.uniqid().then(function(ids){
            const id=ids[0];

            couch.insert('suscriptores',{
                _id:id,
                nombre:nombre,
                correo:correo,
                cedula:cedula,
                sucursal:sucursal,
                suscripcion:suscripcion,
                costo:costo,
                moroso:moroso,
                fechaDS:fechaDS
            }).then(
                function(data, headers, status){
                    res.redirect('/agregar')
                },
            function(err){
                res.send(err)
            });

        })
    });
    app.get('/agregar', function(req,res){  
        couch.get(dbName, viewUrl).then(
            function(data, headers, status){
                console.log(data.data.rows);
               res.render('agregar',{
                   suscriptores:data.data.rows
               });
            },
            function(err){
               res.send(err);
            });
       }); 

       app.post('/cancelar/delete/:id', function(req,res){  
        const id=req.params.id;
        const rev=req.body.rev; 
        
        couch.del(dbName,id,rev).then(
            function(data,headers, status){
                res.redirect('/index');
            },
            function(err){
                res.send(err)
            } );
        } ); 


       app.get('/cancelar', function(req,res){  
    couch.get(dbName, viewUrl).then(
        function(data, headers, status){
            console.log(data.data.rows);
           res.render('cancelar',{
               suscriptores:data.data.rows
           });
        },
        function(err){
           res.send(err);
        });
   });    

   app.get('/cancelar2', function(req,res){  
    couch.get(dbName, viewUrl).then(
        function(data, headers, status){
            console.log(data.data.rows);
           res.render('cancelar2',{
               suscriptores:data.data.rows
           });
        },
        function(err){
           res.send(err);
        });
   });
   


app.listen(3000, function(){  
 console.log('Server is started on Port 3000');  
});  