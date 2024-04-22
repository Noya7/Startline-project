const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    fullDate: {type: Date, required: true, unique: true},
    date: {type: Date, required: true},
    timeIndex: {type: Number, required: true},
    area: {type: String, required: true},
    medic: {type: mongoose.Schema.Types.ObjectId, ref: "Medic", required: false},

    name: {type: String, required: true},
    surname: {type: String, required: true},
    DNI: {type: Number, required: true},

    existingPatient: {type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: false},
    medicalReport: {type: mongoose.Schema.Types.ObjectId, ref: "Report", required: false},
    receipt: {type: mongoose.Schema.Types.ObjectId, ref: "Receipt", required: false},
    review: {type: mongoose.Schema.Types.ObjectId, ref: "Review", required: false},

    creationDate: {type: String, required: true},
})

module.exports = mongoose.model('Appointment', appointmentSchema);