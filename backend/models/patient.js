const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},

    name: {type: String, required: true},
    surname: {type: String, required: true},
    gender: {type: String, required: true},
    birthDate: {type: Date, required: true},
    DNI: {type: Number, required: true},
    address: {type: Number, required: true},
    medicalHistory: [{type: mongoose.Schema.Types.ObjectId, ref: "MedicalReport", required: true}],

    appointments: [{type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: false}],
    creationDate: {type: String, required: true},
})

module.exports = mongoose.model("Patient", patientSchema);