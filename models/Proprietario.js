const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Proprietario = new Schema({
    nomeCompleto:{
        type: String,
        required: true
    },
    cpf:{
        type: String,
        required: true
    },
    contato:{
        type: String,
        required: true
    },
    endereco:{
        type: String,
        required: true
    }, 
    date:{
        type: Date,
        default: Date.now() //valor default
    }
})

mongoose.model('proprietarios', Proprietario)