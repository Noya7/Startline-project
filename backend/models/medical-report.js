const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const medicalReportSchema = new Schema({
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true},
    medic: {type: mongoose.Schema.Types.ObjectId, ref: "Medic", required: true},
    // area: {type: String, required: true},
    date: {type: Date, required: true},
    motiveForConsultation: {type: String, required: false},
    diagnosis: {type: String, required: false},
    treatment: {type: String, required: false},
    imageResults: [{type: String, required: false}],
    observations: {type: String, required: false}
})

module.exports = mongoose.model("MedicalReport", medicalReportSchema);