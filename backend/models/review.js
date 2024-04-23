const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    //definicion de tipo, si es un review de un medico o de un paciente.
    type: {type: String, required: true},
    //si es paciente:
    appointment: {type: mongoose.Schema.Types.ObjectId,ref: "Appointment", required: false, unique: true},
    //si es medico:
    reviewingMedic: {type: mongoose.Schema.Types.ObjectId, ref: "Medic", required: false},
    //global:
    reviewedMedic: {type: mongoose.Schema.Types.ObjectId, ref: "Medic", required: true},
    rating: {type: Number, required: true},
    review: {type: String, required: false},
    creationDate: {type: Date, required: true},
})

module.exports = mongoose.model('Review', reviewSchema);