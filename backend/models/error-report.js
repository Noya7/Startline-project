const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const errorReportSchema = new Schema({
    patient: {type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: false},
    medic: {type: mongoose.Schema.Types.ObjectId, ref: 'Medic', required: false},
    admin: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false},
    description: {type: String, required: true},
    date: {type: Date, required: true},
    state: {type: String, enum: ['pending', 'in process', 'solved'], required: true}
})

module.exports = mongoose.model("ErrorReport", errorReportSchema)