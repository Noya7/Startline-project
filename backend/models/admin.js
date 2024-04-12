const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    surname: {type: String, required: true},
    DNI: {type: Number, required: true},
    creationDate: {type: String, required: true},
})

module.exports = mongoose.model('Admin', adminSchema);