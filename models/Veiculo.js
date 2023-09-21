const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Veiculo = new Schema({
    marca:{
        type: String,
        required: true
    },
    cor:{
        type: String,
        required: true
    },
     placa:{
        type: String,
        required: true
    },
    detalhes:{ 
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now() //valor default
    },
    propId:{
        type: Schema.Types.ObjectId, //vai armazenar 'id' de uma categoria
        ref: 'proprietarios', // nome de model de uma categoria 
        required: true
    }
})

mongoose.model('veiculos', Veiculo)