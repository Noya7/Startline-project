const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const receiptSchema = new Schema({
    date: {type: Date, required: true},
    paymentMethod: {type: String, required: true},
    total: {type: Number, required: true},

    patient: {type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true},
    medic: {type: mongoose.Schema.Types.ObjectId, ref: "Medic", required: true},
    service: {type: String, required: true}
})

module.exports = mongoose.model("Receipt", receiptSchema)