const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const medicSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    surname: {type: String, required: true},
    DNI: {type: Number, required: true, unique: true},

    gender: {type: String, required: true},
    birthDate: {type: Date, required: true},
    
    matricula: {type: String, required: true, unique: true},
    area: {type: String, required: true},
    image: {type: String, required: true},

    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: "Review", required: false}],
    creationDate: {type: String, required: true},
})

module.exports = mongoose.model('Medic', medicSchema);