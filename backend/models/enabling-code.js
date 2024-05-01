const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const enablingCodeSchema = new Schema({
    matricula: {type: Number, required: true},
    email: {type: String, required: true},
    expDate: {type: Date, required: true},
    isActive: {type: Boolean, required: true}
})

module.exports = mongoose.model('EnablingCode', enablingCodeSchema)