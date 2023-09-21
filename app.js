//Importando módulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const mongoose = require('mongoose');
    const app = express();
    const admin = require('./routes/admin');
    const path = require('path');
    const session = require('express-session');
    const flash = require('connect-flash');
    require('./models/Veiculo');
    const Veiculo = mongoose.model('veiculos');
    require('./models/Proprietario');
    const Proprietario = mongoose.model('proprietarios')
    

//configurações gerais
    //session
    app.use(session({
        secret: 'cursodenode',
        resave: true,
        saveUninitialized: true
    }))


    //Flash
    app.use(flash())

    //Middleware
    app.use((req, res, next) =>{
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        next()
    })
    //body-parser
        app.use(bodyParser.urlencoded({extended:true}));
        app.use(express.json());

    //Handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
    
    //mongoose: conexão ao banco
    mongoose.connect("mongodb://127.0.0.1:27017/blog_app", {
        useNewUrlParser: true //evitar erros

    //Verificador de conexão ao banco
    }).then(() =>{
        console.log('Conectado ao banco mongoDB!')
    }).catch((err) => {
        console.log('Erro ao se conectar: ' +err)
    })

    //Public 
        app.use(express.static(path.join(__dirname, 'public')))
        app.use((req, res, next) =>{
            console.log('Oi! Eu sou um middleware!');
            next();
        })
    //Rotas
        app.get('/', (req, res) =>{
            Veiculo.find().lean().populate('propId').sort({date: 'asc'}).then((veiculos) =>{
                res.render('index', {veiculos: veiculos})
            }).catch((err) =>{
                req.flash('error_msg', 'Houve um erro interno')
                res.redirect('/404')
            })
        })

        //difinir grupo de rotas admin
        app.use('/admin', admin) 
        
//Outros
const PORT = 9010; 
app.listen(PORT, () =>{
    console.log('Servidor rodando...p:9010');
})