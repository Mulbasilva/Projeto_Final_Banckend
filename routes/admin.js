const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Proprietario');
const Proprietario = mongoose.model('proprietarios');
require('../models/Veiculo');
const Veiculo = mongoose.model('veiculos');


//Proprietarios
router.get('/', (req, res) =>{
    res.render('admin/index');
})

router.get('/proprietarios', (req, res) =>{
    Proprietario.find().lean().sort({date:'asc'}).then((proprietarios) =>{
        res.render('admin/proprietarios', {proprietarios: proprietarios});
    }).catch((err) =>{
        req.flash('error_msg', 'Houve um erro ao listar as proprietarios');
        res.redirect('/admin');
    })
})

router.get('/proprietarios/add', (req, res) =>{
    res.render('admin/addproprietarios');
})

router.post('/proprietarios/nova', (req, res) =>{

    var erros = [];

    if (!req.body.nomeCompleto || typeof req.body.nomeCompleto == undefined || req.body.nomeCompleto == null){
        erros.push({texto: "Nome inválido"});
    }
    if (!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
        erros.push({texto: "CPF inválido"});
    }

    if (!req.body.contato || typeof req.body.contato == undefined || req.body.contato == null){
        erros.push({texto: "Contato inválido"});
    }

    if (!req.body.endereco || typeof req.body.endereco == undefined || req.body.endereco == null){
        erros.push({texto: "Endereço inválido"});
    }

    if(req.body.nomeCompleto.length < 1){
        erros.push({texto: "Nome da proprietario muito pequeno"})
    }
    if (erros.length > 0){
        res.render('admin/addproprietarios', {erros: erros})
    }else{
        const novoProprietario = {
            nomeCompleto: req.body.nomeCompleto,
            cpf: req.body.cpf,
            contato: req.body.contato,
            endereco: req.body.endereco
        }
    
        new Proprietario(novoProprietario).save().then(() =>{
            req.flash('success_msg', 'Proprietario cadastrado com sucesso!')
            res.redirect('/admin/proprietarios')
        }).catch((err) =>{
            req.flash('error_msg', 'Houve um erro ao cadastrar o proprietario, tente novamente.')
            res.redirect('/admin')
        })
    }
}) 

router.get('/proprietarios/edit/:id', (req, res) =>{
    Proprietario.findOne({_id:req.params.id}).lean().then((proprietario)=>{
        res.render('admin/editproprietarios', {proprietario: proprietario})
    }).catch((err) =>{
        req.flash('error_msg', 'Esta categoria não existe')
        res.redirect('/admin/proprietarios')
    })
})

router.post('/proprietarios/edit', (req, res) =>{
    Proprietario.findOne({_id: req.body.id}).then((proprietario)=>{
        proprietario.nomeCompleto = req.body.nomeCompleto
        proprietario.cpf = req.body.cpf
        proprietario.contato = req.body.contato
        proprietario.endereco = req.body.endereco

        proprietario.save().then(()=>{
            req.flash('success_msg', 'proprietario editada com sucesso')
            res.redirect('/admin/proprietarios')
        }).catch((err) =>{
            req.flash('error_msg', 'Houve um erro interno ao salvar a edição de Proprietário')
            res.redirect('/admin/proprietarios')
        })

    }).catch((err) =>{
        req.flash('error_msg', 'Houve um erro ao editar a Proprietário')
        res.redirect('/admin/proprietarios')
    })
})

router.post('/proprietarios/deletar', (req, res) =>{
    Proprietario.deleteOne({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'Proprietário deletada com sucesso!')
        res.redirect('/admin/proprietarios')
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao deletar a proprietário')
        res.redirect('/admin/proprietarios')
    })
    
})

//Veiculos
router.get('/veiculos', (req, res) =>{

    Veiculo.find().lean().populate('propId').sort({date: 'asc'}).then((veiculos) =>{
        res.render('admin/veiculos', {veiculos: veiculos})
    }).catch((err) =>{
        req.flash('erros_msg', 'Houve um erro ao listar os veiculos')
        res.redirect('/admin')
    })

})

router.get('/veiculos/add', (req, res) =>{
    Proprietario.find().lean().then((proprietarios)=>{
        res.render('admin/addveiculo', {proprietarios: proprietarios})
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao carregar o formulário')
        res.redirect('/admin')
    })
})

router.post('/veiculos/novo', (req, res) =>{
    
    var erros = [];

    if (req.body.proprietario == "0"){
        erros.push({texto: "Proprietario inválida, registre um proprietario"})
    }
    if(erros.length > 0){
        res.render('admin/addveiculo', {erros: erros})
    }else{
        const novoVeiculo = {
            marca: req.body.marca,
            cor: req.body.cor,
            placa: req.body.placa,
            detalhes: req.body.detalhes,
            propId:req.body.propId
        }
        new Veiculo(novoVeiculo).save().then(() =>{
            req.flash('success_msg', 'Veiculo criado com sucesso!')
            res.redirect('/admin/veiculos')
        }).catch((err) =>{
            req.flash('error_msg', 'Houve um erro durate o salvamento do veiculo')
            res.redirect('/admin/veiculos')
        })
    }
})

router.get('/veiculos/edit/:id', (req, res) =>{
    Veiculo.findOne({_id:req.params.id}).lean().then((veiculo)=>{
        Proprietario.find().lean().then((proprietarios) =>{
            res.render('admin/editveiculos', {proprietarios: proprietarios, veiculos: veiculo})
        }).catch((err) =>{
            req.flash('error_msg', 'Erro ao listar proprietarios')
            res.redirect('admin/editveiculos')
        })

    }).catch((err) =>{
        req.flash('error_msg', 'Este veiculo não existe')
        res.redirect('/admin/veiculos')
    })
})

router.post('/veiculo/edit', (req, res) =>{
    Veiculo.findOne({_id: req.body.id}).then((veiculo)=>{
        veiculo.marca = req.body.marca
        veiculo.cor = req.body.cor
        veiculo.placa = req.body.placa

        veiculo.save().then(()=>{
            req.flash('success_msg', 'Veiculo editado com sucesso')
            res.redirect('/admin/veiculos')
        }).catch((err) =>{
            req.flash('error_msg', 'Houve um erro interno ao salvar a edição do veiculo')
            res.redirect('/admin/veiculos')
        })

    }).catch((err) =>{
        req.flash('error_msg', 'Houve um erro ao editar o proprietario')
        res.redirect('/admin/veiculos')
    })
})


router.get('/veiculos/deletar/:id', (req, res) =>{
    Veiculo.deleteOne({_id: req.params.id}).then(()=>{
        req.flash('success_msg', 'Veiculo deletado com sucesso!')
        res.redirect('/admin/veiculos')
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao deletar o veiculo')
        res.redirect('/admin/veiculos')
    })
})
module.exports = router