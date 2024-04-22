const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    surname: {type: String, required: true},
    DNI: {type: Number, required: true, unique: true},

    gender: {type: String, required: true},
    birthDate: {type: Date, required: true},

    address: {type: String, required: true},
    medicalHistory: [{type: mongoose.Schema.Types.ObjectId, ref: "MedicalReport", required: false}],

    appointments: [{type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: false}],
    creationDate: {type: String, required: true},
})

module.exports = mongoose.model("Patient", patientSchema);