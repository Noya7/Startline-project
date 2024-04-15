const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const enablingCodeSchema = new Schema({
    matricula: {type: Number, required: true},
    email: {type: String, required: true},
    code: {type: String, required: true},
    expDate: {type: Date, required: true},
    status: {type: String, required: true}
})

module.exports = mongoose.model('EnablingCode', enablingCodeSchema)