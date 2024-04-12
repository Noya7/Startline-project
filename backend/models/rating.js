const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    //definicion de tipo, si es un review de un medico o de un paciente.

    type: {type: String, required: true},

    //si es paciente:

    appointment: {type: mongoose.Schema.Types.ObjectId,ref: "Appointment", required: false},
    patient: {type: mongoose.Schema.Types.ObjectId,ref: "Patient", required: false},

    //si es medico:

    reviewingMedic: {type: mongoose.Schema.Types.ObjectId, ref: "Medic", required: false},

    //global:

    area: {type: String, required: true},
    reviewedMedic: {type: mongoose.Schema.Types.ObjectId, ref: "Medic", required: true},
    rating: {type: Number, required: true},
    message: {type: String, required: false},

    name: {type: String, required: true},
    surname: {type: String, required: true},

    creationDate: {type: String, required: true},
})

module.exports = mongoose.model('Review', reviewSchema);